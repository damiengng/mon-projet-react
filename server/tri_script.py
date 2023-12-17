# tri_script.py
# Ajoutez le code pour trier vos fichiers ici
# ...

# Exemple de code pour trier les fichiers par extension dans des dossiers différents
# Ce n'est qu'un exemple, vous devrez adapter cela à vos besoins réels
import os
import shutil

def sort_files():
    base_path = '/chemin/vers/votre/dossier'  # Remplacez par le chemin réel
    for root, dirs, files in os.walk(base_path):
        for file in files:
            extension = file.split('.')[-1]
            destination_folder = os.path.join(base_path, extension)
            os.makedirs(destination_folder, exist_ok=True)
            source_path = os.path.join(root, file)
            destination_path = os.path.join(destination_folder, file)
            shutil.move(source_path, destination_path)

if __name__ == '__main__':
    sort_files()
