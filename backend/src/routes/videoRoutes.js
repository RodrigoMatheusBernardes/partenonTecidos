router.get('/hero', async (req, res) => {
  try {
    const fileKey = VIDEO_FILES.hero;
    const url = await generateSignedUrl(fileKey);
    res.json({ url, expiresIn: 3600 });
  } catch (err) {
    console.error('❌ Erro detalhado ao gerar URL do vídeo hero:', {
      name: err.name,
      code: err.code,
      message: err.message,
      statusCode: err.$metadata?.httpStatusCode,
    });
    res.status(500).json({ error: 'Não foi possível gerar a URL do vídeo.' });
  }
});