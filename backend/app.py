from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
from llm import summarize_text

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
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

        return jsonify(result)

    except Exception as e:
        print(f"Une erreur inattendue est survenue: {e}")
        return jsonify({'error': 'Une erreur serveur inattendue est survenue.'}), 500

if __name__ == '__main__':
    app.run(debug=True) 