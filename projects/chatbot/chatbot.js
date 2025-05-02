const msgsEl  = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send');

let conversation = [
  { role: 'system', content: 'You are a helpful assistant.' }
];

function appendMessage(who, text) {
  const msg = document.createElement('div');
  msg.className = `message ${who}`;
  msg.textContent = text;
  msgsEl.appendChild(msg);
  msgsEl.scrollTop = msgsEl.scrollHeight;
}

async function callCohere(messages) {
  const res = await fetch('/api/cohereChat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  const { reply } = await res.json();
  return reply;  // { role, content }
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

  // get the AI reply
  const reply = await callCohere(conversation);

  // swap placeholder for real text
  const placeholders = msgsEl.querySelectorAll('.message.bot');
  placeholders[placeholders.length - 1].textContent = reply.content;

  // record it
  conversation.push({ role: 'assistant', content: reply.content });
});