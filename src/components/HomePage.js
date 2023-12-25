// HomePage.js
import React from 'react';

function HomePage() {
    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1>Lecture des dossiers</h1>
                <p>
                    Ici, on facilite le fait de trouver les fichiers dans un répertoire existant dans votre machine !
                    On range tout dans un dossier qui porte le même nom que l’extension de ce fichier !
                </p>
            </header>
            <div style={contentStyle}>
                <h2>Bienvenue sur notre application de tri de fichiers.</h2>

            </div>
        </div >
    );
}

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

const contentStyle = {
    marginBottom: '10px',
};

export default HomePage;