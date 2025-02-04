document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('messageForm');
  const messagesDiv = document.getElementById('messages');

  // fetch and display existing messages
  const loadMessages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/messages');
      const messages = await response.json();
      messagesDiv.innerHTML = messages.map(msg => `
        <div class="message">
          <h3>${msg.name}</h3>
          <p>${msg.message}</p>
          <small>${new Date(msg.created_at).toLocaleString()}</small>
        </div>
      `).join('');
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  // new message
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = { 
      name: formData.get('name'), 
      message: formData.get('message') 
    };

    try {
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        form.reset();
        loadMessages();
      }
    } catch (err) {
      console.error('Failed to submit message:', err);
    }
  });

  // add delete button not working
messagesDiv.innerHTML = messages.map(msg => `
<div class="message">
  <button class="delete" data-id="${msg.id}">Delete</button>
  <h3>${msg.name}</h3>
  <p>${msg.message}</p>
  <small>${new Date(msg.created_at).toLocaleString()}</small>
</div>
`).join('');

// delete
document.querySelectorAll('.delete').forEach(btn => {
btn.addEventListener('click', async () => {
  const id = btn.dataset.id;
  try {
    await fetch(`http://localhost:3000/api/messages/${id}`, { method: 'DELETE' });
    loadMessages();
  } catch (err) {
    console.error('Failed to delete message:', err);
  }
});
});

  // load
  loadMessages();
});