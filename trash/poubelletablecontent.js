import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TableContent() {
    const [filesData, setFilesData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/get_files');
                setFilesData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la base de données :', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Contenu de la table</h2>

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
