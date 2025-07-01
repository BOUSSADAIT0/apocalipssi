from services.llm_service import generer_synthese

def lancer_traitement(document_texte):
    prompt = f"""
    Tu es un assistant juridique.
    Résume le document suivant :
    {document_texte}

    Donne :
    - Un résumé synthétique
    - Les points clés
    - Les actions à réaliser
    """

    resultat = generer_synthese(prompt)

    if resultat is None:
        raise Exception("Erreur dans l'appel au LLM")

    return resultat
