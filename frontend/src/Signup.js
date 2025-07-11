import React, { useState, useEffect } from 'react';

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
    <div className="login-page">
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
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
      </form>
      <p>Déjà un compte ? <span className="link" onClick={switchToLogin}>Se connecter</span></p>
    </div>
  );
}

export default Signup;
