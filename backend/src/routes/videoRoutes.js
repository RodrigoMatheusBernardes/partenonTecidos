const express = require('express');
const router = express.Router();
const { generateSignedUrl } = require('../services/b2');

// Mapeamento interno dos nomes dos arquivos no B2
const VIDEO_FILES = {
  hero: 'vd ATENDIMENTO TEXTIL.mp4',
  second: 'TEXTIL LOCAL.mp4',
};

router.get('/hero', async (req, res) => {
  try {
    const fileKey = VIDEO_FILES.hero;
    const url = await generateSignedUrl(fileKey);
    res.json({ url, expiresIn: 3600 });
  } catch (err) {
    console.error('Erro ao gerar URL do vídeo hero:', err);
    res.status(500).json({ error: 'Não foi possível gerar a URL do vídeo.' });
  }
});

router.get('/second', async (req, res) => {
  try {
    const fileKey = VIDEO_FILES.second;
    const url = await generateSignedUrl(fileKey);
    res.json({ url, expiresIn: 3600 });
  } catch (err) {
    console.error('Erro ao gerar URL do vídeo second:', err);
    res.status(500).json({ error: 'Não foi possível gerar a URL do vídeo.' });
  }
});

module.exports = router;