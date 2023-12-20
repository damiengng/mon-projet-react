// TableContent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TableContent() {
    const [filesData, setFilesData] = useState([]);

    const sortFiles = async () => {
        try {
            // Exécuter l'API pour trier les fichiers
            const response = await axios.post('http://127.0.0.1:5000/sort_files', {
                chemin_source: '/Users/damiengennevoise/Documents/M1 Paris 8/Technologies Web Internet/Projet2/mon-projet-react/tests',
                chemin_destination: '/Users/damiengennevoise/Documents/M1 Paris 8/Technologies Web Internet/Projet2/mon-projet-react/tests'
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

    const getColorByFileType = (fileType) => {
        switch (fileType) {
            case 'texte':
                return '#3498db'; // Bleu
            case 'pdf':
                return '#e74c3c'; // Rouge
            case 'image':
                return '#2ecc71'; // Vert
            case 'html':
                return '#f39c12'; // Jaune
            default:
                return '#95a5a6'; // Gris
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={headerStyle}>Contenu de la table</h2>

            {/* Bouton pour trier les fichiers */}
            <button style={buttonStyle} onClick={sortFiles}>Trier les fichiers</button>

            {/* Afficher les données récupérées de la base de données */}
            {filesData.map((file, index) => (
                <div key={index} style={{ ...fileStyle, backgroundColor: getColorByFileType(file.file_type) }}>
                    <p style={fileTitleStyle}>Nom: {file.name}</p>
                    <p>Taille: {file.size} Ko</p>
                    <p>Type: {file.file_type}</p>
                    <p>Chemin: {file.path}</p>
                    <hr style={hrStyle} />
                </div>
            ))}
        </div>
    );
}

const buttonStyle = {
    background: '#4CAF50',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginBottom: '10px',
};

const fileStyle = {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
};

const fileTitleStyle = {
    fontWeight: 'bold',
};

const hrStyle = {
    borderTop: '1px solid #ccc',
    margin: '10px 0',
};

const containerStyle = {
    margin: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
};

const headerStyle = {
    background: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px',
    marginBottom: '10px',
};

export default TableContent;
