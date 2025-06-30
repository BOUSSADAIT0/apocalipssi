# Apocalipssi

Application d'analyse intelligente de documents PDF (résumé, points clés, suggestions d'actions) avec Mixtral via Groq et une interface moderne React.

## Fonctionnalités
- Upload de fichiers PDF
- Résumé automatique en français
- Extraction des points clés
- Suggestions d'actions concrètes
- Interface web moderne et responsive

## Prérequis
- Python 3.8+
- Node.js 14+
- Un compte Groq (pour obtenir une clé API)

## Installation

### 1. Clonez le dépôt
```bash
git clone https://github.com/BOUSSADAIT0/apocalipssi.git
cd apocalipssi
```

### 2. Backend (API Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sous Windows
pip install -r requirements.txt
```

#### Configuration de la clé API Groq
Créez un fichier `.env` dans le dossier `backend` :
```
GROQ_API_KEY="votre_cle_groq_ici"
```
et cree la cle api depuis le site https://console.groq.com/keys

**Ne partagez jamais cette clé publiquement.**

### 3. Frontend (React)
```bash
cd ../frontend
npm install
```

## Lancement

### 1. Démarrer le backend
```bash
cd backend
python app.py
```
Le serveur écoute sur http://localhost:5000

### 2. Démarrer le frontend
```bash
cd frontend
npm start
```
L'application s'ouvre sur http://localhost:3000

## Utilisation
- Cliquez sur "Sélectionner un fichier PDF" et choisissez un document.
- Attendez l'analyse (quelques secondes).
- Le résumé, les points clés et les suggestions d'actions s'affichent dans des boîtes séparées.

## Structure des résultats
La réponse du backend est un objet JSON :
```json
{
  "summary": "...",
  "key_points": ["...", "..."],
  "action_items": ["...", "..."]
}
```

## Sécurité
- **Ne mettez jamais votre clé API Groq dans le code source public.**
- Le fichier `.env` est ignoré par git.

## Personnalisation
- Le prompt système peut être adapté dans `backend/llm.py` pour changer le style ou la structure des résultats.
- Le style de l'interface peut être modifié dans `frontend/src/App.css`.

## Licence
MIT 