const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expense');
const budgetRoutes = require('./routes/budget'); // ✅ NEW

app.use('/auth', authRoutes);
app.use('/expense', expenseRoutes);
app.use('/budget', budgetRoutes); // ✅ NEW

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
