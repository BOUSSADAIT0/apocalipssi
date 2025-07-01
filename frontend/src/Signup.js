import React, { useState } from 'react';

function Signup({ switchToLogin }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
      } else {
        setError(data.error || 'Erreur lors de la création du compte.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="login-page">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
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
        <button type="submit">Créer le compte</button>
      </form>

      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}

      <p>Déjà un compte ? <span className="link" onClick={switchToLogin}>Se connecter</span></p>
    </div>
  );
}

export default Signup;
