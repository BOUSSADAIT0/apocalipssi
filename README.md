# Assistant de Synthèse de Documents PDF

Ce projet est une application web qui permet aux utilisateurs de télécharger un document PDF et d'obtenir un résumé concis généré par une intelligence artificielle. C'est une démonstration (POC - Proof of Concept) d'une solution d'automatisation pour la veille réglementaire ou l'analyse rapide de documents.

## ✨ Fonctionnalités

- **Interface web simple** : Une page web au design moderne pour interagir avec l'application.
- **Upload de PDF** : Zone de dépôt de fichiers intuitive pour sélectionner un document.
- **Extraction de texte** : Le backend lit automatiquement le contenu du PDF.
- **Résumé par IA** : Utilise l'API de Hugging Face pour générer un résumé pertinent.
- **Affichage dynamique** : Le résumé apparaît sur la page sans avoir besoin de la recharger.

## 🛠️ Technologies utilisées

| Catégorie | Technologie | Description |
|-----------|-------------|-------------|
| **Frontend**| React       | Pour construire l'interface utilisateur interactive. |
| **Backend** | Python      | Langage principal pour la logique serveur. |
|             | Flask       | Micro-framework web pour créer l'API. |
| **IA**      | Hugging Face| Fournit le modèle de langage pour la synthèse. |
| **PDF**     | PyPDF2      | Bibliothèque Python pour extraire le texte des PDF. |

## 📂 Structure du projet

```
apocalips/
├── backend/
│   ├── app.py             # Le serveur Flask principal
│   ├── llm.py             # Logique pour appeler l'IA
│   ├── requirements.txt   # Dépendances Python
│   └── .env               # Fichier pour les clés d'API (à créer)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Composant React principal
│   │   ├── App.css        # Styles de l'application
│   │   └── index.js       # Point d'entrée React
│   └── package.json       # Dépendances JavaScript
│
└── README.md              # Ce fichier
```

---

## 🚀 Installation et Lancement

Suivez ces étapes pour lancer l'application sur votre machine.

### Prérequis

- **Python** (version 3.8 ou plus) et son gestionnaire de paquets `pip`.
- **Node.js** (version 14 ou plus) et son gestionnaire de paquets `npm`.

### 1. Configuration du Backend

Ouvrez un **premier terminal** et suivez ces instructions :

```bash
# 1. Allez dans le dossier du backend
cd backend

# 2. Installez les dépendances Python
pip install -r requirements.txt

# 3. Créez votre fichier de configuration pour l'API
#    Créez un fichier nommé EXACTEMENT ".env" à la racine du dossier "backend"
#    et mettez-y votre token Hugging Face comme ceci :
#
#    HUGGINGFACE_API_TOKEN="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
#

# 4. Lancez le serveur backend
python app.py
```
Le serveur backend devrait maintenant tourner sur `http://127.0.0.1:5000`. Laissez ce terminal ouvert.

### 2. Configuration du Frontend

Ouvrez un **deuxième terminal** (ne fermez pas le premier !).

```bash
# 1. Allez dans le dossier du frontend
cd frontend

# 2. Installez les dépendances JavaScript (peut prendre une minute)
npm install

# 3. Lancez l'application React
npm start
```
Votre navigateur devrait s'ouvrir automatiquement sur `http://localhost:3000`. Si ce n'est pas le cas, ouvrez-le manuellement.

## 💡 Comment utiliser l'application

1.  Assurez-vous que les serveurs backend et frontend sont bien lancés.
2.  Rendez-vous sur `http://localhost:3000` dans votre navigateur.
3.  Cliquez sur la zone "Cliquez ici pour choisir un fichier" et sélectionnez un document PDF.
4.  Cliquez sur le bouton "Générer le résumé".
5.  Patientez quelques instants. Le résumé apparaîtra dans la section "Résumé du document".

---

## 🔮 Améliorations possibles

- **Gestion des erreurs plus fine** : Afficher des messages plus spécifiques (ex: "Le PDF est protégé par mot de passe").
- **Points Clés et Actions** : Améliorer le "prompt" envoyé à l'IA pour qu'elle extraie non seulement un résumé, mais aussi des points importants et des actions suggérées.
- **Gestion des gros fichiers** : Pour les PDF de plus de 1024 tokens, découper le texte et le traiter par morceaux.
- **Barre de progression** : Montrer une barre de progression pendant l'analyse du document.
- **Dockerisation** : Empaqueter l'application dans des conteneurs Docker pour un déploiement plus facile. 