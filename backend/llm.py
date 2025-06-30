import requests
import os
from dotenv import load_dotenv

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
HF_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")

# Vérifie si le token a bien été chargé
if not HF_TOKEN:
    raise ValueError("Le token HUGGINGFACE_API_TOKEN n'a pas été trouvé. "
                     "Vérifiez votre fichier .env ou vos variables d'environnement.")

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def summarize_text(text):
    # Limite la taille du texte pour les modèles gratuits
    # Une troncature simple peut couper des mots, mais c'est suffisant pour un POC.
    if len(text) > 1024:
        text = text[:1024]

    payload = {
        "inputs": text,
        "parameters": { # Ajout de paramètres pour un meilleur résumé
            "min_length": 30,
            "max_length": 150
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        summary_data = response.json()
        return {
            "summary": summary_data[0]['summary_text'],
            "points": [],  # Cette partie peut être développée
            "actions": []  # Cette partie peut être développée
        }
    else:
        # Retourne une erreur claire pour le débogage
        return {
            "error": f"Erreur HuggingFace API : {response.status_code} - {response.text}"
        }
