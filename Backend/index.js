require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const verseRoutes = require("./routes/verseRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();


connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/verse', verseRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/contact', contactRoutes);


app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
