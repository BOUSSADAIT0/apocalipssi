import React, { useState, useRef } from 'react';
import './App.css'; // Importer le fichier CSS

function App() {
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
        body: formData,
      });
      const data = await res.json();
      if (res.status !== 200 || data.error) {
        setError(data.error || 'Une erreur est survenue.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Erreur de connexion avec le serveur. Vérifiez qu'il est bien lancé.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Assistant de Synthèse</h1>
        <p>Uploadez un document PDF pour obtenir un résumé intelligent.</p>
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

      {loading && <div className="loading">Analyse en cours, veuillez patienter...</div>}
      
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