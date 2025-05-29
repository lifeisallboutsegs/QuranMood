require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const verseRoutes = require("./routes/verseRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

const startTime = Date.now();


connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/verse', verseRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/contact', contactRoutes);


app.get("/", (req, res) => {
  const currentTime = Date.now();
  const uptime = currentTime - startTime;
  const timeString = new Date(uptime).toISOString().substr(11, 8);
  res.send(`Quran Mood API is running | Uptime: ${timeString}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
