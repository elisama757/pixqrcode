// api/pix.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { amount, description, payer } = req.body;

    const response = await fetch("https://app.mangofy.com.br/api/v1/pix/charge", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MANGOFY_API_KEY}` // 🔑 variável ambiente no Vercel
      },
      body: JSON.stringify({
        amount: amount || 9.90,
        description: description || "Pagamento PIX",
        payer: { email: payer?.email || "lead@example.com" }
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Erro na função:", error);
    return res.status(500).json({ error: "Erro interno ao gerar PIX" });
  }
}
