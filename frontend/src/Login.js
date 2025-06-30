import React, { useState } from 'react';

function Login({ setToken, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.access_token);
        localStorage.setItem('token', data.access_token);
      } else {
        setError(data.error || 'Erreur de connexion.');
      }
    } catch {
      setError('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="login-page">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>

      {error && <div className="error">{error}</div>}

      <p>Pas encore de compte ? <span className="link" onClick={switchToSignup}>Créer un compte</span></p>
    </div>
  );
}

export default Login;