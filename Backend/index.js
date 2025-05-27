const express = require("express");
const app = express();
const PORT = 3000 | process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  const message = req.query.data;

  res.json({ message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
