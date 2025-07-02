import React, { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import './Dashboard.css';

function flattenAndStringify(arr) {
  if (!Array.isArray(arr)) arr = [arr];
  return arr.flat(Infinity).map((el) => {
    if (el && typeof el === 'object' && el.$$typeof) {
      return '[Composant React non affichable]';
    }
    if (el === null || el === undefined) return '';
    if (typeof el === 'string' || typeof el === 'number') return el;
    return JSON.stringify(el);
  });
}

function Dashboard({ token, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setError(data.error || 'Erreur lors de la récupération de l\'historique.');
        }
      } catch (e) {
        setError('Erreur de connexion au serveur.');
      }
      setLoading(false);
    };
    fetchHistory();
  }, [token]);

  return (
    <div className="dashboard-container">
      <button className="back-btn" onClick={onBack}>⬅ Retour</button>
      <h1>📚 Historique de vos analyses</h1>
      {loading && <p>Chargement...</p>}
      {error && <div className="dashboard-error">{error}</div>}
      <div className="dashboard-grid">
        {history.map((item) => (
          <Tilt className="dashboard-card" key={item._id} glareEnable={true} glareMaxOpacity={0.25} scale={1.04} tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <div className="dashboard-card-inner">
              <div className="dashboard-card-header">
                <span className="dashboard-filename">📄 {item.filename}</span>
                <span className="dashboard-date">🕒 {item.date}</span>
              </div>
              <div className="dashboard-summary">
                <h3>📰 Résumé</h3>
                <p>{item.summary}</p>
              </div>
              <div className="dashboard-points">
                <h4>📌 Points clés</h4>
                <ul>
                  {flattenAndStringify(item.key_points).map((pt, idx) => <li key={idx}>{pt}</li>)}
                </ul>
              </div>
              <div className="dashboard-actions">
                <h4>✅ Actions</h4>
                <ul>
                  {flattenAndStringify(item.action_items).map((act, idx) => <li key={idx}>{act}</li>)}
                </ul>
              </div>
            </div>
          </Tilt>
        ))}
      </div>
      {(!loading && history.length === 0 && !error) && <p>Aucune analyse enregistrée pour le moment.</p>}
    </div>
  );
}

export default Dashboard; 