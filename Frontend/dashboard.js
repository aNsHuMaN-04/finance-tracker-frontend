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

      const category = expense.category.toLowerCase(); // 🔁 normalize
      const amount = parseFloat(expense.amount);

      if (!isNaN(amount)) {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    });

    renderExpenseChart(categoryTotals);
    loadBudgetsAndRenderChart(categoryTotals);

  } catch (error) {
    console.error("Failed to load expenses:", error);
  }
}

async function loadBudgetsAndRenderChart(spentTotals) {
  try {
    const response = await fetch("http://localhost:3000/budget/user?email=" + encodeURIComponent(email));
    const budgets = await response.json();

    const userBudgets = {};
    budgets.forEach(row => {
      const category = row.category.toLowerCase(); // 🔁 normalize
      const amount = parseFloat(row.amount);
      if (!isNaN(amount)) {
        userBudgets[category] = amount;
      }
    });

    const categories = Object.keys(userBudgets);
    const budgetsArr = categories.map(cat => userBudgets[cat]);
    const spentArr = categories.map(cat => spentTotals[cat] || 0);

    renderBudgetChart(categories, budgetsArr, spentArr);
  } catch (err) {
    console.error("Error loading budgets:", err);
  }
}

function renderExpenseChart(categoryTotals) {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  if (window.expenseChartInstance) {
    window.expenseChartInstance.destroy();
  }

  window.expenseChartInstance = new Chart(ctx, {
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
        legend: { position: 'right' },
        title: { display: true, text: 'Expenses by Category' }
      }
    }
  });
}

function renderBudgetChart(categories, budgets, spent) {
  const ctx = document.getElementById('budgetChart').getContext('2d');

  if (window.budgetChartInstance) {
    window.budgetChartInstance.destroy();
  }

  window.budgetChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [
        {
          label: 'Budget',
          data: budgets,
          backgroundColor: 'rgba(52, 152, 219, 0.6)'
        },
        {
          label: 'Spent',
          data: spent,
          backgroundColor: 'rgba(231, 76, 60, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Budget vs Spent' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

window.onload = loadExpenses;
