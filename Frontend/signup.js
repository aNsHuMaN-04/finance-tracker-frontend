document.getElementById('signup-form').addEventListener('submit', async function(e) {
  e.preventDefault(); // Stop page from refreshing

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Signup successful!");
      window.location.href = 'dashboard.html'; 
    } else {
      alert("Signup failed: " + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert("An error occurred. Try again.");
  }
});
