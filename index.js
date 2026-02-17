require('dotenv').config();


const express = require('express');
const cors = require('cors');
const tokenRoute = require('./routes/token');

const app = express();
const port = process.env.PORT || 5000;

// ----------------------
// MIDDLEWARE (must come before routes)
// ----------------------
app.use(express.json());
app.use(cors());

// ----------------------
// ROUTES
// ----------------------
app.get('/', (req, res) => {
  res.send('mpesa programming in progress, time to get paid');
});

app.use('/api', tokenRoute);

// ----------------------
// START SERVER
// ----------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
