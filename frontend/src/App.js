import React, { useState } from 'react';
import './App.css'; // Importer le fichier CSS

function App() {
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    setError('');
    setSummary('');
    setKeyPoints([]);
    setActionItems([]);
    setLoading(true);

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
        setKeyPoints(data.key_points);
        setActionItems(data.action_items);
      }
    } catch (err) {
      setError('Erreur lors de la connexion au serveur.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>📝 Analyse intelligente de document</h1>
        <p className="subtitle">Déposez un PDF pour obtenir un résumé, les points clés et des suggestions d'actions.</p>
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