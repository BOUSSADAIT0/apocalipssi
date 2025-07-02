import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Link, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Paper elevation={10} sx={{
        p: 5,
        maxWidth: 400,
        width: '100%',
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(4px)',
        background: 'rgba(255,255,255,0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LockOutlinedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2" fontWeight={700} color="primary.main">
            Connexion
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" mb={2}>
          Bienvenue ! Connectez-vous pour accéder à votre espace personnel.
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            autoFocus
            variant="outlined"
            sx={{
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(30,60,114,0.07)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 4px 16px rgba(30,60,114,0.13)' }
            }}
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
            sx={{
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(30,60,114,0.07)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 4px 16px rgba(30,60,114,0.13)' }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            size="large"
            sx={{
              mt: 1,
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(30,60,114,0.13)',
              textTransform: 'none',
              fontSize: '1.1rem',
              transition: 'background 0.3s',
              background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #2a5298 0%, #1e3c72 100%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Pas encore de compte ?{' '}
          <Link component="button" variant="body2" onClick={switchToSignup} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Créer un compte
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;