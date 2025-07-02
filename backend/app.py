from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import PyPDF2
from llm import summarize_text
import os

app = Flask(__name__)
CORS(app)

# Configurations MongoDB et JWT
app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/apocalipssi")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-key")

mongo = PyMongo(app)

# Test de connexion à MongoDB
try:
    print("Collections MongoDB :", mongo.db.list_collection_names())
    print("Connexion à MongoDB réussie !")
except Exception as e:
    print("Erreur de connexion à MongoDB :", e)

jwt = JWTManager(app)

# Collections
utilisateurs = mongo.db.utilisateurs
documents = mongo.db.documents
results = mongo.db.results

# Forcer la création de la base et des collections 'users' et 'results' si elles n'existent pas
if "users" not in mongo.db.list_collection_names():
    mongo.db.users.insert_one({
        "email": "test@apocalipssi.local",
        "password": "dummy",
        "created_for_init": True
    })
    print("Collection 'users' créée avec un document d'initialisation.")

if "results" not in mongo.db.list_collection_names():
    mongo.db.results.insert_one({
        "user_id": "init",
        "filename": "init.pdf",
        "date": "init",
        "summary": "init",
        "key_points": [],
        "action_items": []
    })
    print("Collection 'results' créée avec un document d'initialisation.")

# ✅ Création de compte
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    nom = data.get('nom')
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email et mot de passe requis'}), 400

    if utilisateurs.find_one({'email': email}):
        return jsonify({'error': 'Email déjà utilisé'}), 400

    hashed_password = generate_password_hash(password)

    user = {
        'email': email,
        'password': hashed_password,
        'date_creation': datetime.utcnow()
    }
    if nom:
        user['nom'] = nom

    utilisateurs.insert_one(user)

    return jsonify({'success': True}), 201


# ✅ Connexion
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = utilisateurs.find_one({'email': email})

    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Identifiants incorrects'}), 401

    token = create_access_token(identity=str(user['_id']), expires_delta=timedelta(days=1))

    return jsonify({'access_token': token}), 200


# ✅ Upload PDF (protégé)
@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier envoyé'}), 400
    file = request.files['file']
    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Format non supporté'}), 400

    try:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        if not text.strip():
            return jsonify({'error': 'PDF vide ou non lisible'}), 400
        result = summarize_text(text)
        # Si le modèle a renvoyé une erreur, on l'affiche et on la transmet
        if 'error' in result:
            print("--- Erreur retournée par le LLM ---")
            print(result)
            print("---------------------------------")
            return jsonify(result), 400

        # Stockage du résultat dans MongoDB
        user_id = get_jwt_identity()
        mongo.db.results.insert_one({
            'user_id': user_id,
            'filename': file.filename,
            'date': datetime.utcnow(),
            'summary': result.get('summary', ''),
            'key_points': result.get('key_points', []),
            'action_items': result.get('action_items', [])
        })

        return jsonify(result)
    except Exception as e:
        print(f"Une erreur inattendue est survenue: {e}")
        return jsonify({'error': 'Une erreur serveur inattendue est survenue.'}), 500


# ✅ Récupérer un résultat (protégé)
@app.route('/result/<id>', methods=['GET'])
@jwt_required()
def get_result(id):
    current_user = get_jwt_identity()

    result = results.find_one({"_id": ObjectId(id), "user_id": current_user})

    if result:
        result['_id'] = str(result['_id'])
        result['document_id'] = str(result['document_id'])
        result['user_id'] = str(result['user_id'])
        return jsonify(result)
    else:
        return jsonify({"error": "Résultat introuvable"}), 404


# ✅ Liste des documents de l'utilisateur (protégé)
@app.route('/documents', methods=['GET'])
@jwt_required()
def get_documents():
    current_user = get_jwt_identity()

    docs = documents.find({"user_id": current_user})
    doc_list = []
    for doc in docs:
        doc['_id'] = str(doc['_id'])
        doc_list.append(doc)
    return jsonify(doc_list)


@app.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    results = list(mongo.db.results.find({'user_id': user_id}).sort('date', -1))
    for r in results:
        r['_id'] = str(r['_id'])  # Pour la sérialisation JSON
        r['date'] = r['date'].strftime('%Y-%m-%d %H:%M')
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)