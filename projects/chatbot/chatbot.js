// assets/chatbot.js
const msgsEl   = document.getElementById('messages');
const inputEl  = document.getElementById('input');
const sendBtn  = document.getElementById('send');

let conversation = [
  { role: 'system', content: 'You are a helpful assistant.' }
];

function appendMessage(who, text){
  const msg = document.createElement('div');
  msg.className = `message ${who}`;
  msg.textContent = text;
  msgsEl.appendChild(msg);
  msgsEl.scrollTop = msgsEl.scrollHeight;
}

async function callOpenAI(messages){
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${window.OPENAI_API_KEY}`,
      'Content-Type':  'application/json'
    },
    body: JSON.stringify({
      model:    'gpt-4o-mini',
      messages: messages
    })
  });
  const { choices } = await res.json();
  return choices[0].message;
}

sendBtn.addEventListener('click', async () => {
  const userText = inputEl.value.trim();
  if (!userText) return;

  // show user
  appendMessage('user', userText);
  conversation.push({ role: 'user', content: userText });
  inputEl.value = '';

  // placeholder
  appendMessage('bot', '…');

  // call OpenAI
  const reply = await callOpenAI(conversation);

  // swap “…” for real text
  const placeholder = [...msgsEl.querySelectorAll('.message.bot')].pop();
  placeholder.textContent = reply.content;

  conversation.push({ role: 'assistant', content: reply.content });
});
