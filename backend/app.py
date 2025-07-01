from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import PyPDF2
from llm import summarize_text

app = Flask(__name__)
CORS(app)

# Configurations MongoDB et JWT
app.config["MONGO_URI"] = "mongodb://localhost:27017/apocalipssi"
app.config["JWT_SECRET_KEY"] = "super_cle_secrete"  # Change-la pour la prod !

mongo = PyMongo(app)
jwt = JWTManager(app)

# Collections
utilisateurs = mongo.db.utilisateurs
documents = mongo.db.documents
results = mongo.db.results


# ✅ Création de compte
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    nom = data.get('nom')
    email = data.get('email')
    password = data.get('password')

    if not nom or not email or not password:
        return jsonify({'error': 'Nom, email et mot de passe requis'}), 400

    if utilisateurs.find_one({'email': email}):
        return jsonify({'error': 'Email déjà utilisé'}), 400

    hashed_password = generate_password_hash(password)

    user = {
        'nom': nom,
        'email': email,
        'password': hashed_password,
        'date_creation': datetime.utcnow()
    }

    utilisateurs.insert_one(user)

    return jsonify({'message': 'Compte créé avec succès'}), 201


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
    current_user = get_jwt_identity()

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

        # Résumé via LLM
        result = summarize_text(text)

        if 'error' in result:
            return jsonify(result), 400

        # Enregistrement document
        doc = {
            "filename": file.filename,
            "upload_date": datetime.utcnow(),
            "status": "uploaded",
            "user_id": current_user
        }
        doc_id = documents.insert_one(doc).inserted_id

        # Enregistrement résultat
        res = {
            "document_id": str(doc_id),
            "user_id": current_user,
            "summary": result.get("summary"),
            "points": result.get("points", []),
            "actions": result.get("actions", []),
            "generated_at": datetime.utcnow()
        }
        res_id = results.insert_one(res).inserted_id

        return jsonify({
            "document_id": str(doc_id),
            "result_id": str(res_id),
            "summary": result.get("summary")
        })

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


if __name__ == '__main__':
    app.run(debug=True)
