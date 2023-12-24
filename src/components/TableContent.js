import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TableContent() {
    const [filesData, setFilesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    let [sourcePath, setSourcePath] = useState('');
    const [destinationPath, setDestinationPath] = useState(''); // Aucune valeur par défaut
    const [filteredFiles, setFilteredFiles] = useState([]);

    const sortFiles = async () => {
        try {
            let finalDestinationPath;

            if (destinationPath) {
                // Si le chemin destination est spécifié, on l'utilise tel quel
                finalDestinationPath = destinationPath;
            } else {
                // Sinon, valeur par défaut
                finalDestinationPath = '/results';
            }

            if (!sourcePath) {
                console.error('Le chemin source est vide.');
                return;
            }

            // Concaténer le chemin de la source avec "/results"
            finalDestinationPath = sourcePath + finalDestinationPath;

            console.log("Chemin source:", sourcePath);
            console.log("Chemin destination:", finalDestinationPath);

            const response = await axios.post('http://127.0.0.1:5000/sort_files', {
                chemin_source: sourcePath,
                chemin_destination: finalDestinationPath,
            });

            console.log(response.data);

            if (sourcePath) {
                fetchData();
            }
        } catch (error) {
            console.error('Erreur lors du tri des fichiers :', error);
            console.log('Erreur détaillée Axios :', error.response);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/get_files');
            setFilesData(response.data);
            filterFiles(response.data, searchTerm);
        } catch (error) {
            console.error('Erreur lors de la récupération des données de la base de données :', error);
        }
    };

    const cleanDatabase = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/clean_database');
            console.log(response.data);
            fetchData();
        } catch (error) {
            console.error('Erreur lors du nettoyage de la base de données :', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        filterFiles(filesData, event.target.value);
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

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

    const filterFiles = (data, term) => {
        const filteredFiles = data.filter((file) => {
            return file.name.toLowerCase().includes(term.toLowerCase());
        });
        setFilteredFiles(filteredFiles);
    };

    return (
        <div style={containerStyle}>
            <h2 style={headerStyle}>Contenu de la table</h2>

            <div style={inputContainerStyle}>
                <div>
                    <label>Chemin Source:</label>
                    <input type="text" value={sourcePath} onChange={(e) => setSourcePath(e.target.value)} />
                </div>
                <div>
                    <label>Chemin Destination:</label>
                    <input type="text" value={destinationPath} onChange={(e) => setDestinationPath(e.target.value)} />
                </div>
            </div>

            <p>
                Plusieurs choix sont possibles :
                <br></br>1) Vous renseignez un chemin de source et un chemin de destination.
                <br></br>2) Vous renseignez seulement un chemin de source, et vous aurez automatiquement un dossier "results" avec le tri dedans.
                <br></br>
                <br></br>Cliquez sur le bouton "Nettoyer" pour vider la base de données.
                <br></br>
                <br></br>Vous pouvez rechercher un fichier directement à l'aide de la barre de recherche ci-dessous.
                <br></br>
                <br></br>Les fichiers pdf sont de couleur rouge, les fichiers texte de couleur bleue, les fichiers images en vert et les fichiers html en jaune.
            </p>

            <div>
                <button style={buttonStyle} onClick={sortFiles}>
                    Trier les fichiers
                </button>
                <button style={cleanButtonStyle} onClick={cleanDatabase}>
                    Nettoyer
                </button>
            </div>

            {/* Barre de recherche */}
            <input
                type="text"
                placeholder="Rechercher par nom de fichier"
                value={searchTerm}
                onChange={handleSearch}
                style={searchBarStyle}
            />

            {filteredFiles.map((file, index) => (
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

const cleanButtonStyle = {
    background: '#e74c3c',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginLeft: '10px',
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

const searchBarStyle = {
    margin: '10px 0',
    padding: '10px',
    width: '23%',
};

const inputContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
};

export default TableContent;
