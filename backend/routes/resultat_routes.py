from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import uuid

resultat_bp = Blueprint("resultat_bp", __name__)
client = MongoClient("mongodb://localhost:27017/")
db = client["assistant_synthese"]

@resultat_bp.route("/resultat", methods=["POST"])
def creer_resultat():
    data = request.json
    resultat = {
        "_id": str(uuid.uuid4()),
        "id_document": data["id_document"],
        "resume": data["resume"],
        "points_cles": data.get("points_cles", []),
        "actions_a_realiser": data.get("actions_a_realiser", []),
        "date_generation": datetime.utcnow()
    }
    db.resultat.insert_one(resultat)
    return jsonify({"message": "Résultat créé", "resultat_id": resultat["_id"]})
