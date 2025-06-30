import React, { useState, useRef } from 'react';
import './App.css';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setResult(null);
      setError('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur serveur.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
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
        <h1>Assistant de Synthèse</h1>
        <p>Uploadez un PDF pour générer un résumé intelligent.</p>
        <button onClick={handleLogout} className="logout-button">Déconnexion</button>
      </div>

      <div className="upload-section" onClick={handleUploadClick}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <div className="upload-icon">📄</div>
        <div className="upload-text">
          {fileName ? fileName : 'Cliquez ici pour choisir un fichier'}
        </div>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="analyze-button"
        >
          {loading ? 'Analyse en cours...' : 'Générer le résumé'}
        </button>
      )}

      {loading && <div className="loading">Analyse en cours...</div>}

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results-section">
          <h3>📝 Résumé du document</h3>
          <p>{result.summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;