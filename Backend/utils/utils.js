const fs = require("fs").promises;
const path = require("path");

const FILE_PATH = path.join(__dirname, "../data/verses.json");

async function readVerses() {
  const data = await fs.readFile(FILE_PATH, "utf8");
  return JSON.parse(data);
}

async function writeVerses(verses) {
  await fs.writeFile(FILE_PATH, JSON.stringify(verses, null, 2), "utf8");
}

module.exports = { readVerses, writeVerses };
