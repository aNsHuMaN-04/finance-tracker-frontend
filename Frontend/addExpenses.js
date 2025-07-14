document.getElementById("expense-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = localStorage.getItem("userEmail"); // stored after login

  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const paymentMode = document.getElementById("paymentMode").value;
  const dayOfWeek = document.getElementById("dayOfWeek").value || "";

  if (!email) {
    showMessage("User not logged in!", true);
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        category,
        date,
        paymentMode,
        dayOfWeek,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      showMessage("Expense added successfully!");

      // Clear form
      document.getElementById("expense-form").reset();
    } else {
      showMessage("Failed to add expense: " + result.message, true);
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage("Error while adding expense.", true);
  }
});

function showMessage(msg, isError = false) {
  const box = document.getElementById("message-box");
  box.textContent = msg;
  box.style.background = isError ? "#e74c3c" : "#2ecc71";
  box.style.display = "block";

  setTimeout(() => {
    box.style.display = "none";
  }, 2000);
}
