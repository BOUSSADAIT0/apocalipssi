import React, { useState, useEffect } from 'react';
import logo from './assets/logocolor.png';


function Signup({ switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        switchToLogin();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, switchToLogin]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Compte créé avec succès. Redirection...');
      } else {
        setError(data.error || 'Erreur lors de la création du compte.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    }
    setLoading(false);
  };

  return (
    <div className="page-wrapper">
          <div className="login-container">
          <div className="login-page">
            <img src={logo} alt="Logo" style={{ width: 80, marginBottom: 10, borderRadius: 20 }} />
      
            <h2 style={{ marginBottom: 4 }}>ComplySummarize IA</h2>
            <p style={{ fontStyle: 'italic', color: '#555', marginBottom: 20 }}>
              Votre assistant intelligent de synthèse de documents
            </p>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}  >
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
      </form>
      <p>Déjà un compte ? <span className="link" onClick={switchToLogin}>Se connecter</span></p>
    </div>
          </div>
        </div>
  );
}

export default Signup;
