from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import uuid

document_bp = Blueprint("document_bp", __name__)
client = MongoClient("mongodb://localhost:27017/")
db = client["assistant_synthese"]

@document_bp.route("/upload", methods=["POST"])
def upload_document():
    fichier = request.files["file"]
    id_utilisateur = request.form.get("id_utilisateur")

    chemin = f"./static/uploads/{fichier.filename}"
    fichier.save(chemin)

    document = {
        "_id": str(uuid.uuid4()),
        "id_utilisateur": id_utilisateur,
        "nom_fichier": fichier.filename,
        "chemin_fichier": chemin,
        "taille_fichier": len(fichier.read()),
        "date_upload": datetime.utcnow(),
        "statut": "uploaded"
    }

    db.document.insert_one(document)
    return jsonify({"message": "Document uploadé", "document_id": document["_id"]})
