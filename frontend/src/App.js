import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(false);
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    setError('');
    setSummary('');
    setKeyPoints([]);
    setActionItems([]);
    setLoading(true);

    const file = event.target.files[0];

    if (!file) {
      setError('Veuillez sélectionner un fichier PDF.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
        setKeyPoints(data.points || []);
        setActionItems(data.actions || []);
      }
    } catch (err) {
      setError('Erreur lors de la connexion au serveur.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  if (!token) {
    return showSignup ? (
      <Signup switchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login
        setToken={setToken}
        switchToSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1>📝 Analyse intelligente de document</h1>
        <p className="subtitle">Déposez un PDF pour obtenir un résumé, les points clés et des suggestions d'actions.</p>
        <button onClick={handleLogout} className="logout-button">Déconnexion</button>
      </div>

      <div className="upload-container">
        <label htmlFor="file-upload" className="upload-label">
          <span role="img" aria-label="upload">📄</span> Sélectionner un fichier PDF
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>

      {loading && <p className="loading">⏳ Analyse en cours...</p>}
      {error && <div className="box error fade-in">{error}</div>}

      {summary && (
        <div className="box summary fade-in">
          <h2>📰 Résumé</h2>
          <p>{summary}</p>
        </div>
      )}

      {keyPoints.length > 0 && (
        <div className="box keypoints fade-in">
          <h2>📌 Points clés</h2>
          <ul>
            {keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {actionItems.length > 0 && (
        <div className="box actions fade-in">
          <h2>✅ Suggestions d'actions</h2>
          <ul>
            {actionItems.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;