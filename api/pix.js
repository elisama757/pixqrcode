export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { amount, customer } = req.body;

    if (!process.env.MANGOFY_API_KEY) {
      console.error('API Key não configurada');
      return res.status(500).json({ error: 'API Key não configurada corretamente' });
    }

    console.log('API Key da Mangofy:', process.env.MANGOFY_API_KEY);

    const payload = {
      external_code: Date.now().toString(),
      payment_method: 'pix',
      payment_format: 'regular',
      installments: 1,
      payment_amount: amount,
      customer: {
        email: customer.email,
        name: customer.name,
        document: customer.document,
        phone: customer.phone
      },
      pix: { expires_in_days: 1 }
    };

    const response = await fetch('https://checkout.mangofy.com.br/api/v1/payment', {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${process.env.MANGOFY_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro da API Mangofy:', data);
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    res.status(500).json({ error: `Erro interno ao gerar PIX: ${error.message}` });
  }
}
