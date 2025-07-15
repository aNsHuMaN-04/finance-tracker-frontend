document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = form.querySelector('select').value;
    const amount = form.querySelector('input[type="number"]').value;
    const email = localStorage.getItem("userEmail");

    if (!email) {
      alert("User not logged in.");
      return;
    }

    if (!category || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, category, amount })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Budget added successfully!");
        form.reset();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting budget:", error);
      alert("Server error");
    }
  });
});
