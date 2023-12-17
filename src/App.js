import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import TableContent from './components/TableContent';



function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/table-content">Contenu de la table</Link>
            </li>
          </ul>
        </nav>

        <hr />
        <Routes>
          {/* Définissez vos routes avec le composant Route */}
          <Route path="/" element={<HomePage />} />
          <Route path="/table-content" element={<TableContent />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
