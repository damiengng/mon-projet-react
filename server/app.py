from flask import Flask, request, jsonify
import os
import shutil
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///organizer.db'
db = SQLAlchemy(app)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    size = db.Column(db.Integer)
    file_type = db.Column(db.String(50))
    path = db.Column(db.String(255))

def add_test_data():
    File.query.delete()
    test_data = [
        {'name': 'test_file1.txt', 'size': 1024, 'file_type': 'texte', 'path': '/test_folder/test_file1.txt'},
        {'name': 'test_file2.pdf', 'size': 2048, 'file_type': 'pdf', 'path': '/test_folder/test_file2.pdf'},
        {'name': 'test_file3.png', 'size': 3072, 'file_type': 'image', 'path': '/test_folder/test_file3.png'},
        {'name': 'test_file4.html', 'size': 4096, 'file_type': 'html', 'path': '/test_folder/test_file4.html'},
        {'name': 'test_file5.txt', 'size': 5120, 'file_type': 'texte', 'path': '/test_folder/test_file5.txt'},
    ]
    for data in test_data:
        file_data = File(**data)
        db.session.add(file_data)
    db.session.commit()

with app.app_context():
    db.create_all()
    add_test_data()

# Nouvelle route pour trier les fichiers
@app.route('/sort_files', methods=['POST'])
def sort_files():
    data = request.get_json()
    chemin_source = data.get('chemin_source')
    chemin_destination = data.get('chemin_destination')

    print("Chemin source:", chemin_source)
    print("Chemin destination:", chemin_destination)

    if not chemin_source or not chemin_destination:
        return jsonify({'erreur': 'Les chemins source et destination sont nécessaires'}), 400

    extensions = {
        'texte': ['.txt'],
        'pdf': ['.pdf'],
        'image': ['.png', '.gif', '.jpeg', '.jpg'],
        'html': ['.html', '.htm']
    }

    for dossier_parent, dossiers, fichiers in os.walk(chemin_source):
        for fichier in fichiers:
            chemin_fichier_source = os.path.join(dossier_parent, fichier)

            # Vérifier si le fichier existe avant de le traiter
            if not os.path.exists(chemin_fichier_source):
                print(f"Le fichier {chemin_fichier_source} n'existe pas. Ignoré.")
                continue

            _, extension = os.path.splitext(fichier)
            dossier_destination = None

            for dossier, exts in extensions.items():
                if extension.lower() in exts:
                    dossier_destination = dossier
                    break

            if dossier_destination is None:
                continue

            chemin_dossier_destination = os.path.join(chemin_destination, dossier_destination)
            os.makedirs(chemin_dossier_destination, exist_ok=True)

            shutil.move(chemin_fichier_source, os.path.join(chemin_dossier_destination, fichier))

            # Vérifier si le fichier existe après le déplacement
            chemin_fichier_destination = os.path.join(chemin_dossier_destination, fichier)
            if not os.path.exists(chemin_fichier_destination):
                print(f"Le fichier {chemin_fichier_destination} n'existe pas après le déplacement. Ignoré.")
                continue

            file_data = {
                'name': fichier,
                'size': os.path.getsize(chemin_fichier_destination),  # Utilisez le chemin destination
                'file_type': dossier_destination,
                'path': chemin_fichier_destination,
            }
            db.session.add(File(**file_data))
            db.session.commit()

    return jsonify({'message': 'Fichiers triés avec succès'}), 200

# Reste du code...

# Nouvelle route pour obtenir les données
@app.route('/api/get_files', methods=['GET'])
def get_files():
    files = File.query.all()
    files_data = [{'name': file.name, 'size': file.size, 'file_type': file.file_type, 'path': file.path} for file in files]
    return jsonify(files_data)

if __name__ == '__main__':
    app.run(debug=True)
