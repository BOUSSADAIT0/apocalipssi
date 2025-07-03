import React, { useState } from 'react';
import './App.css';
import Particles3DBackground from './Particles3DBackground';
import Background3D from './Background3D';
import Sidebar from './Sidebar';
import Login from './Login'; 
import logo from './assets/logowhite.png';
import Signup from './Signup';
import Dashboard from './Dashboard';
import uploadIcon from './assets/image.png';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
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
        // ✅ Gestion des deux noms possibles venant du backend
        setKeyPoints(data.key_points || data.points || []);
        setActionItems(data.action_items || data.actions || []);
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
    return (
      <>
        <Particles3DBackground />
        <Background3D />
        {showSignup ? (
          <Signup switchToLogin={() => setShowSignup(false)} />
        ) : (
          <Login
            setToken={setToken}
            switchToSignup={() => setShowSignup(true)}
          />
        )}
      </>
    );
  }

  if (showDashboard) {
    return (
      <>
        <Particles3DBackground />
        <Background3D />
        <Dashboard token={token} onBack={() => setShowDashboard(false)} />
      </>
    );
  }

  return (
    <>
      <Particles3DBackground />
      <Background3D />
      <div className="container">
        <Sidebar onLogout={handleLogout} />
        <main className="main">
          <img src={logo} alt="Logo" style={{ width: 150, marginBottom: 10 }} />
          <h1 className="title">ComplySummarize IA</h1>
          <p className="subtitle">Votre assistant intelligent de synthèse de documents</p>

          <div className="upload-box">
            <label htmlFor="file-upload" className="drop-area">
              <div className="upload-content">
                <img src={uploadIcon} alt="Icône upload" className="upload-icon" />
                <span>Déposez votre image ici, ou <span className="file-link">parcourez vos fichiers</span></span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="file-input"
              />
            </label>

            <button className="submit-btn" onClick={() => console.log("Soumettre")}>Résumé</button>

            {loading && <p className="loading">⏳ Analyse en cours...</p>}
            {error && <div className="error-msg">{error}</div>}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
