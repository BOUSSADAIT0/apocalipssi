import React, { useState } from 'react';
import logo from './assets/logocolor.png'; 


function Login({ setToken, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
      } else {
        setError(data.error || 'Identifiants invalides.');
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

      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
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
          disabled={loading}
          onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #B341FF 0%, #4161FF 100%)'}
          onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #4161FF 0%,, #B341FF 100%)'}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        {error && <div className="form-error">{error}</div>}
      </form>
      <p>Pas encore de compte ? <span className="link" onClick={switchToSignup}>Créer un compte</span></p>
    </div>
    </div>
    </div>
  );
}

export default Login;