import React, { useState } from 'react';

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
    <div className="login-page">
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
          style={{
            marginTop: 8,
            borderRadius: 7,
            border: 'none',
            padding: '12px 0',
            fontSize: '1.1em',
            fontWeight: 600,
            width: '100%',
            background: 'linear-gradient(90deg, #ffb3c6 0%, #e0c3fc 50%, #b3c6f7 100%)',
            color: '#23243a',
            boxShadow: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #e0c3fc 0%, #ffb3c6 100%)'}
          onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffb3c6 0%, #e0c3fc 50%, #b3c6f7 100%)'}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        {error && <div className="form-error">{error}</div>}
      </form>
      <p>Pas encore de compte ? <span className="link" onClick={switchToSignup}>Créer un compte</span></p>
    </div>
  );
}

export default Login;