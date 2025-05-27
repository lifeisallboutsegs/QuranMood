const express = require("express");
const cors = require("cors");
const verseRoutes = require("./routes/verseRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const startTime = Date.now();

app.use(cors());
app.use(express.json());

app.use("/api/verse", verseRoutes);

app.get("/", (req, res) => {
  const currentTime = Date.now();
  const uptime = currentTime - startTime;
  const timeString = new Date(uptime).toISOString().substr(11, 8);
  res.send(`Quran Mood API is running | Uptime: ${timeString}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
