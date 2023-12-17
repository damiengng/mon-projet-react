import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TableContent() {
    const [filesData, setFilesData] = useState([]);

    const sortFiles = async () => {
        try {
            // Exécuter l'API pour trier les fichiers
            const response = await axios.post('http://127.0.0.1:5000/sort_files', {
                chemin_source: '/Users/damiengennevoise/Documents/M1 Paris 8/Technologies Web Internet/Projet2/mon-projet-react/tests',  // Remplacez par le chemin source approprié
                chemin_destination: '/Users/damiengennevoise/Documents/M1 Paris 8/Technologies Web Internet/Projet2/mon-projet-react/tests'  // Remplacez par le chemin destination approprié
            });

            console.log(response.data);  // Afficher la réponse de l'API (message de succès)

            // Rafraîchir les données après le tri
            fetchData();
        } catch (error) {
            console.error('Erreur lors du tri des fichiers :', error);
        }
    };

    const fetchData = async () => {
        try {
            // Exécuter l'API pour récupérer les données de la base de données
            const response = await axios.get('http://127.0.0.1:5000/api/get_files');
            setFilesData(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données de la base de données :', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h2>Contenu de la table</h2>

            {/* Bouton pour trier les fichiers */}
            <button onClick={sortFiles}>Trier les fichiers</button>

            {/* Afficher les données récupérées de la base de données */}
            {filesData.map((file, index) => (
                <div key={index}>
                    <p>Nom: {file.name}</p>
                    <p>Taille: {file.size} Ko</p>
                    <p>Type: {file.file_type}</p>
                    <p>Chemin: {file.path}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default TableContent;
