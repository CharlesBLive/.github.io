export default async function handler(req, res) {
    const { messages } = req.body;
  
    // Call Cohere chat completions
    const cohRes = await fetch('https://api.cohere.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:      'command-xlarge-nightly',
        messages:   messages,
        max_tokens: 300
      })
    });
  
    const { generations } = await cohRes.json();
    const reply = generations[0].message;
  
    return res.status(200).json({ reply });
  }
  