const email = localStorage.getItem("userEmail");
if (!email) {
  window.location.href = "login.html";
}

async function loadExpenses() {
  try {
    const response = await fetch("http://localhost:3000/expense/user?email=" + encodeURIComponent(email));
    const data = await response.json();

    const tbody = document.getElementById("expenses-table-body");
    tbody.innerHTML = "";

    const categoryTotals = {};

    data.forEach(expense => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}</td>
        <td>${expense.paymentMode}</td>
        <td>${expense.dayOfWeek || '-'}</td>
      `;
      tbody.appendChild(tr);

      const category = expense.category;
      const amount = parseFloat(expense.amount);

      if (!isNaN(amount)) {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    });

    renderChart(categoryTotals);

  } catch (error) {
    console.error("Failed to load expenses:", error);
  }
}

function renderChart(categoryTotals) {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses by Category',
        data: values,
        backgroundColor: [
          '#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6',
          '#1abc9c', '#34495e', '#fd79a8', '#e67e22'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Expenses by Category'
        }
      }
    }
  });
}

window.onload = loadExpenses;
