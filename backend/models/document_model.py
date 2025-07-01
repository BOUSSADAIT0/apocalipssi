class Document:
    def __init__(self, id_utilisateur, nom_fichier, chemin_fichier, taille_fichier, date_upload, statut):
        self.id_utilisateur = id_utilisateur
        self.nom_fichier = nom_fichier
        self.chemin_fichier = chemin_fichier
        self.taille_fichier = taille_fichier
        self.date_upload = date_upload
        self.statut = statut
