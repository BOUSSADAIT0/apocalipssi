import os
import groq
import json
from dotenv import load_dotenv

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

# Configure le client Groq
# Assurez-vous d'avoir une variable GROQ_API_KEY dans votre fichier .env
groq_api_key = os.environ.get("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("La clé d'API GROQ n'a pas été trouvée. "
                     "Vérifiez votre fichier .env et la variable GROQ_API_KEY.")

client = groq.Groq(api_key=groq_api_key)

def summarize_text(text: str):
    """
    Génère un résumé structuré, des points clés et des actions pour le texte donné
    en utilisant le modèle Mixtral via l'API Groq.
    """
    # Limiter la taille du texte pour éviter l'erreur "Request Entity Too Large".
    # Une troncature simple peut couper la fin du texte, mais garantit que l'API ne renverra pas d'erreur.
    # ~28k caractères correspond à ~7k tokens, ce qui est généralement dans les limites des API.
    MAX_TEXT_LENGTH = 28000
    if len(text) > MAX_TEXT_LENGTH:
        text = text[:MAX_TEXT_LENGTH]

    # Prompt système pour guider la sortie du modèle
    system_prompt = (
        "Tu es un expert en analyse de texte. Ta tâche est de lire le texte fourni et de le transformer en une analyse structurée en français."
        "Le format de sortie DOIT être un objet JSON valide avec exactement les clés suivantes :"
        "  - \"summary\": Un résumé concis du texte."
        "  - \"key_points\": Une liste (array) des points clés ou des idées les plus importantes du texte."
        "  - \"action_items\": Une liste (array) d'actions concrètes ou de suggestions basées sur le contenu du texte. Si aucune action n'est pertinente, retourne une liste vide []."
        "Ne réponds RIEN d'autre que l'objet JSON. Le JSON doit être complet et valide."
    )

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": text,
                }
            ],
            model="compound-beta",
            temperature=0.3,
            max_tokens=2048,
            response_format={"type": "json_object"},
        )

        response_content = chat_completion.choices[0].message.content
        
        # Nettoyage des balises Markdown si présentes
        if response_content.strip().startswith('```json'):
            response_content = response_content.strip()[7:]
        if response_content.strip().startswith('```'):
            response_content = response_content.strip()[3:]
        if response_content.strip().endswith('```'):
            response_content = response_content.strip()[:-3]
        response_content = response_content.strip()

        # Analyse la réponse JSON du modèle
        structured_summary = json.loads(response_content)

        # Validation de base pour s'assurer que les clés attendues sont présentes
        if not all(k in structured_summary for k in ['summary', 'key_points', 'action_items']):
             return {"error": "La réponse du modèle n'a pas le format JSON attendu."}

        return structured_summary

    except json.JSONDecodeError:
        return {
            "error": "Erreur lors de l'analyse de la réponse JSON du modèle.",
            "raw_response": response_content
        }
    except Exception as e:
        # Capture les autres exceptions de l'appel API
        return {
            "error": f"Erreur lors de l'appel à l'API Groq : {str(e)}"
        }
