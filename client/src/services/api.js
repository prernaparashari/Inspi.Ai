
const CHAT_ENDPOINT = '/api/chat/gemini';

export async function sendChatMessage(message, history = []) {
  try {
    const res = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();
    if (!data || typeof data.reply !== 'string') throw new Error('bad shape');
    return data.reply;
  } catch (e) {
    await new Promise((r) => setTimeout(r, 600));
    return `(demo reply — connect ${CHAT_ENDPOINT} to your Gemini backend) I heard: "${message}"`;
  }
}