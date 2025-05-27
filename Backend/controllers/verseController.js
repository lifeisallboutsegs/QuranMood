const { readVerses, writeVerses } = require("../utils/utils");

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

exports.getVerseByMood = async (req, res) => {
  try {
    const verses = await readVerses();
    const mood = req.query.mood?.toLowerCase();

    let filtered = verses;
    if (mood) {
      filtered = verses.filter((v) =>
        v.mood.some((m) => m.toLowerCase().includes(mood)),
      );
      if (filtered.length === 0) {
        return res
          .status(404)
          .json({ message: "No verses found for that mood" });
      }
    }

    res.json({ verse: randomItem(filtered) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error reading verses data", error: err.message });
  }
};

exports.addVerse = async (req, res) => {
  try {
    const {
      id,
      mood,
      arabic,
      english,
      reference,
      source,
      tags,
      translation_info,
    } = req.body;

    if (!id || !mood || !arabic || !english) {
      return res
        .status(400)
        .json({ message: "id, mood, arabic, and english are required" });
    }

    const verses = await readVerses();
    if (verses.find((v) => v.id === id)) {
      return res
        .status(409)
        .json({ message: "Verse with this ID already exists" });
    }

    const newVerse = {
      id,
      mood,
      arabic,
      english,
      reference,
      source,
      tags,
      translation_info,
    };
    verses.push(newVerse);

    await writeVerses(verses);
    res.status(201).json({ message: "Verse added", verse: newVerse });
  } catch (err) {
    res.status(500).json({ message: "Error adding verse", error: err.message });
  }
};

exports.editVerse = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const verses = await readVerses();
    const index = verses.findIndex((v) => v.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Verse not found" });
    }

    Object.keys(updates).forEach((key) => {
      verses[index][key] = updates[key];
    });

    await writeVerses(verses);
    res.json({ message: "Verse updated", verse: verses[index] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating verse", error: err.message });
  }
};

exports.deleteVerse = async (req, res) => {
  try {
    const id = req.params.id;

    const verses = await readVerses();
    const index = verses.findIndex((v) => v.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Verse not found" });
    }

    verses.splice(index, 1);
    await writeVerses(verses);
    res.json({ message: "Verse deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting verse", error: err.message });
  }
};
