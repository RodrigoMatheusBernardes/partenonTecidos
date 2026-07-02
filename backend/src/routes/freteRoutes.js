const express = require('express');
const router = express.Router();

// Configurações do pacote (simuladas)
const PACOTE_PADRAO = {
  weight: 1,        // kg
  width: 20,        // cm
  height: 20,       // cm
  length: 20,       // cm
  insurance_value: 0
};

// Função para buscar frete no Melhor Envio
async function buscarMelhorEnvio(cepDestino) {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  if (!token) return null;

  const body = {
    from: { postal_code: '01310100' },  // Substitua pelo CEP da sua loja
    to: { postal_code: cepDestino },
    products: [{ ...PACOTE_PADRAO, quantity: 1 }]
  };

  const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error('Falha na consulta');
  return response.json();
}

function extrairMelhorOpcao(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const opcoes = data.sort((a, b) => a.price - b.price);
  const melhor = opcoes[0];
  return {
    valor: parseFloat(melhor.price),
    prazo_dias: melhor.delivery_time,
    transportadora: melhor.name,
  };
}

// POST /api/frete/calcular
router.post('/calcular', async (req, res) => {
  try {
    const { cep } = req.body;
    if (!cep) return res.status(400).json({ error: 'CEP é obrigatório.' });

    const cepNumerico = cep.replace(/\D/g, '');
    if (cepNumerico.length !== 8) return res.status(400).json({ error: 'CEP inválido.' });

    // Tenta buscar na API real (Melhor Envio)
    try {
      const data = await buscarMelhorEnvio(cepNumerico);
      const opcao = extrairMelhorOpcao(data);
      if (opcao && opcao.valor > 0) {
        return res.json({ ...opcao, capital: 'Via Melhor Envio' });
      }
    } catch (err) {
      console.warn('Melhor Envio indisponível, usando valor fixo:', err.message);
    }

    // Fallback: valor fixo de exemplo (substitua pelo que desejar)
    res.json({
      valor: 15.00,
      prazo_dias: 5,
      transportadora: 'Transportadora padrão (teste)',
      capital: 'Taxa fixa'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao calcular frete.' });
  }
});

module.exports = router;