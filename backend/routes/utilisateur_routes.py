from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import uuid

utilisateur_bp = Blueprint("utilisateur_bp", __name__)
client = MongoClient("mongodb://localhost:27017/")
db = client["assistant_synthese"]

@utilisateur_bp.route("/utilisateur", methods=["POST"])
def creer_utilisateur():
    data = request.json
    utilisateur = {
        "_id": str(uuid.uuid4()),
        "nom": data["nom"],
        "email": data["email"],
        "cle_api": str(uuid.uuid4()),
        "date_creation": datetime.utcnow()
    }
    db.utilisateur.insert_one(utilisateur)
    return jsonify({"message": "Utilisateur créé", "utilisateur_id": utilisateur["_id"]})
