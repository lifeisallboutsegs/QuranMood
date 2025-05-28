const express = require("express");
const cors = require("cors");
const verseRoutes = require("./routes/verseRoutes");
<<<<<<< HEAD
const interactionRoutes = require("./routes/interactionRoutes");
const contactRoutes = require("./routes/contactRoutes");
=======
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba

const app = express();
const PORT = process.env.PORT || 3000;
const startTime = Date.now();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
app.use("/api/verse", verseRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/contact", contactRoutes);
=======

app.use("/api/verse", verseRoutes);
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba

app.get("/", (req, res) => {
  const currentTime = Date.now();
  const uptime = currentTime - startTime;
  const timeString = new Date(uptime).toISOString().substr(11, 8);
  res.send(`Quran Mood API is running | Uptime: ${timeString}`);
});

<<<<<<< HEAD
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
=======
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
});
