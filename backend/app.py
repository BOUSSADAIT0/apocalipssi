from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import PyPDF2
from llm import summarize_text
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Connexion MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/apocalipssi"
mongo = PyMongo(app)

# Collections
utilisateurs = mongo.db.utilisateur
documents = mongo.db.documents
results = mongo.db.results


# ✅ Créer un utilisateur
@app.route('/utilisateur', methods=['POST'])
def create_user():
    data = request.json
    if not data.get('nom') or not data.get('email'):
        return jsonify({"error": "Nom et email requis"}), 400

    user = {
        "_id": str(ObjectId()),
        "nom": data['nom'],
        "email": data['email'],
        "cle_api": str(ObjectId()),
        "date_creation": datetime.utcnow()
    }
    utilisateurs.insert_one(user)

    return jsonify({"message": "Utilisateur créé", "user_id": user["_id"]})


# ✅ Upload de document PDF + Résultat
@app.route('/upload', methods=['POST'])
def upload_pdf():
    user_id = request.form.get('user_id') or "68629cfa68b12f7cee7ddaa8" #juste pour test, à remplacer par l'ID de l'utilisateur
    if not user_id:
        return jsonify({'error': 'user_id manquant'}), 400

    user = utilisateurs.find_one({"_id": user_id})
    if not user:
        return jsonify({'error': 'Utilisateur introuvable'}), 404

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

        # Enregistrement document
        doc = {
            "filename": file.filename,
            "upload_date": datetime.utcnow(),
            "status": "uploaded",
            "user_id": user_id
        }
        doc_id = documents.insert_one(doc).inserted_id

        # Résumé via LLM
        result = summarize_text(text)

        # Enregistrement résultat
        res = {
            "document_id": str(doc_id),
            "user_id": user_id,
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
        return jsonify({'error': str(e)}), 500


# ✅ Récupérer un résultat
@app.route('/result/<id>', methods=['GET'])
def get_result(id):
    result = results.find_one({"_id": ObjectId(id)})
    if result:
        result['_id'] = str(result['_id'])
        result['document_id'] = str(result['document_id'])
        result['user_id'] = str(result['user_id'])
        return jsonify(result)
    else:
        return jsonify({"error": "Résultat introuvable"}), 404


# ✅ Récupérer les documents d’un utilisateur
@app.route('/documents/<user_id>', methods=['GET'])
def get_documents(user_id):
    docs = documents.find({"user_id": user_id})
    doc_list = []
    for doc in docs:
        doc['_id'] = str(doc['_id'])
        doc_list.append(doc)
    return jsonify(doc_list)


if __name__ == '__main__':
    app.run(debug=True)