document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault(); // prevent page reload

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Login successful!');
      window.location.href = 'dashboard.html';
    } else {
      alert('Login failed: ' + result.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login.');
  }
});
