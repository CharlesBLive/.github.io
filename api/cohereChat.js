// cohereChat.js (Node.js API Route)

export default async function handler(req, res) {
  const { messages } = req.body;  // Extract chat history from request

  //for testin enbv only
  //const apiKey = 'sdafdsafsafdasfsad';

  // Send request to Cohere Chat Completions endpoint
  const cohRes = await fetch('https://api.cohere.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      //for testin enbv only
      //'Authorization': `Bearer ${apiKey}`,
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,  // Your Cohere API key
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:      'command-xlarge-nightly',  // Model selection
      messages:   messages,                  // Conversation history
      max_tokens: 300                        // Limit response length
    })
  });

  const { generations } = await cohRes.json();
  const reply = generations[0].message;  // First generated message

  res.status(200).json({ reply });       // Return reply to front-end
}