// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box, CircularProgress, Alert, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * Détermine si l'objet passé est un élément React (JSX déjà "pré‑monté").
 */
function isReactElement(obj) {
  return !!(obj && typeof obj === 'object' && obj.$$typeof);
}

/**
 * Aplatis n'importe quelle structure (objet, tableau, élément React…) et
 * renvoie **toujours** un tableau de chaînes de caractères sûres à afficher.
 */
function flattenAndStringify(value) {
  // On travaille toujours sur un tableau pour simplifier la logique.
  const arr = Array.isArray(value) ? value : [value];

  return arr
    .flat(Infinity)
    .map((el) => {
      if (isReactElement(el)) {
        console.warn("Élément React détecté dans l'historique :", el);
        return '[Composant React non affichable]';
      }
      if (el === null || el === undefined) return '';
      if (typeof el === 'string' || typeof el === 'number') return String(el);
      // Tout le reste (objet, booléen, etc.) est sérialisé JSON
      return JSON.stringify(el);
    })
    .filter(Boolean);            // retire les chaînes vides
}

/** 
 * Petit helper pour formater proprement la date renvoyée par l'API 
 * (ISO 8601 ou timestamp).
 */
function formatDate(dateLike) {
  const date = new Date(dateLike);
  return Number.isNaN(date.getTime())
    ? String(dateLike)           // si parsing impossible on renvoie brut
    : date.toLocaleString();     // sinon affichage local (France)
}

export default function Dashboard({ token, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        // On ne garde que les tableaux valides
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setError(data.error ?? 'Erreur lors de la récupération de l\'historique.');
        }
      } catch {
        setError('Erreur de connexion au serveur.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{
          mb: 3,
          background: 'linear-gradient(90deg, #ffb3c6 0%, #e0c3fc 50%, #b3c6f7 100%)',
          color: '#23243a',
          fontWeight: 700,
          boxShadow: 'none',
          textTransform: 'none',
          '&:hover': {
            background: 'linear-gradient(90deg, #e0c3fc 0%, #ffb3c6 100%)',
            color: '#23243a',
          },
        }}
      >
        Retour
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <DescriptionIcon sx={{ fontSize: 38, color: '#b3c6f7', mr: 1 }} />
        <Typography variant="h4" align="center" gutterBottom color="#fff" fontWeight={700}>
          Historique de vos analyses
        </Typography>
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      {!loading && history.length === 0 && !error && (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          Aucune analyse enregistrée pour le moment.
        </Typography>
      )}
      <Grid container spacing={5} sx={{ mt: 1 }}>
        {history.map((item) => (
          <Grid item xs={12} sm={10} md={8} key={item._id || Math.random()} sx={{ mx: 'auto' }}>
            <Card elevation={10} sx={{
              borderRadius: 5,
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'rgba(255,255,255,0.85)',
              boxShadow: '0 8px 32px 0 rgba(58,45,92,0.13)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid #e0c3fc',
              transition: 'transform 0.22s, box-shadow 0.22s',
              p: 0,
              '&:hover': {
                transform: 'translateY(-8px) scale(1.025)',
                boxShadow: '0 16px 48px 0 rgba(58,45,92,0.18)',
              },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 2 }}>
                <Chip label={item.filename || 'Document'} size="small" sx={{ bgcolor: '#6c4f8c', color: '#fff', fontWeight: 600, fontSize: '1em', px: 1.5, py: 0.5 }} />
                <Chip label={formatDate(item.date)} size="small" sx={{ bgcolor: '#ffb3c6', color: '#3a2d5c', fontWeight: 600, fontSize: '1em', px: 1.5, py: 0.5 }} />
              </Box>
              <Divider sx={{ my: 1, mx: 2, borderColor: '#e0c3fc' }} />
              <CardContent sx={{ pt: 1, pb: 3, px: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <DescriptionIcon sx={{ color: '#6c8cff', mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight={700} color="#3a4e8c">Résumé</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#23243a', mb: 1.5 }}>
                    {flattenAndStringify(item.summary).join(' ')}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <ListAltIcon sx={{ color: '#e0a96d', mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight={700} color="#a86c2c">Points clés</Typography>
                  </Box>
                  <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 8 }}>
                    {flattenAndStringify(item.key_points).map((pt, idx) => (
                      <li key={idx} style={{ fontSize: '1.04em', marginBottom: 4, color: '#3a2d5c', lineHeight: 1.6 }}>{pt}</li>
                    ))}
                  </ul>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <CheckCircleIcon sx={{ color: '#5ecb8c', mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight={700} color="#218c4e">Actions</Typography>
                  </Box>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {flattenAndStringify(item.action_items).map((act, idx) => (
                      <li key={idx} style={{ fontSize: '1.04em', marginBottom: 4, color: '#3a2d5c', lineHeight: 1.6 }}>{act}</li>
                    ))}
                  </ul>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
