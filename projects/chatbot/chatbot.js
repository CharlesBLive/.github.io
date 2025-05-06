// chatbot.js

const msgsEl  = document.getElementById('messages');   // Container for chat messages
const inputEl = document.getElementById('input');      // User input field
const sendBtn = document.getElementById('send');        // "Send" button

// Start the conversation with a system message
let conversation = [
  { role: 'system', content: 'You are a helpful assistant.' }
];

/**
 * Appends a message to the chat window.
 * @param {'user'|'bot'} who - Sender of the message
 * @param {string} text - Message content
 */
function appendMessage(who, text) {
  const msg = document.createElement('div');
  msg.className = `message ${who}`;        // CSS classes: "message user" or "message bot"
  msg.textContent = text;                  // Display the message text
  msgsEl.appendChild(msg);                 // Add to messages container
  msgsEl.scrollTop = msgsEl.scrollHeight;  // Scroll to the bottom
}

/**
 * Sends the conversation to backend and gets the AI reply.
 * @param {Array} messages - Chat history (system/user/assistant roles)
 * @returns {Promise<{role:string,content:string}>} - AI response
 */
async function callCohere(messages) {
  const res = await fetch('/api/cohereChat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })         // Send entire chat history
  });
  const { reply } = await res.json();          // { role, content }
  return reply;
}

// When "Send" is clicked:
sendBtn.addEventListener('click', async () => {
  const userText = inputEl.value.trim();      // Get user input
  if (!userText) return;                      // Ignore empty

  appendMessage('user', userText);            // Display user message
  conversation.push({ role: 'user', content: userText });  // Record it
  inputEl.value = '';                          // Clear input field

  appendMessage('bot', '…');                  // Show placeholder

  const reply = await callCohere(conversation);  // Fetch AI reply

  // Replace last bot placeholder with actual text
  const placeholders = msgsEl.querySelectorAll('.message.bot');
  placeholders[placeholders.length - 1].textContent = reply.content;

  conversation.push({ role: 'assistant', content: reply.content });  // Save AI reply
});