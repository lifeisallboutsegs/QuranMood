const {
  readVerses,
  writeVerses,
  validateVerseId,
  validateSurahVerse,
  validateVerseData,
  scrapeQuranVerse,
  enhanceVerseWithGemini,
  getSurahNameByID,
  SURAH_NAMES
} = require("../utils/verseUtils");

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

exports.getVerseByMood = async (req, res) => {
  try {
    const verses = await readVerses();
    const mood = req.query.mood?.toLowerCase();

    let filtered = verses;
    if (mood) {
      filtered = verses.filter((v) =>
        v.mood.some((m) => m.toLowerCase().includes(mood))
      );
      if (filtered.length === 0) {
        return res
          .status(404)
          .json({ message: "No verses found for that mood" });
      }
    }

    res.json({ verse: randomItem(filtered) });
  } catch (err) {
    console.error("Error in getVerseByMood:", err);
    res.status(500).json({
      message: "Error reading verses data",
      error: err.message
    });
  }
};

exports.addVerse = async (req, res) => {
  try {
    const { surah, verse } = req.params;
    const { useStreaming } = req.query;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        message: "User information is required",
        error: "userId and userName are required"
      });
    }

    const { surahNum, verseNum } = validateSurahVerse(surah, verse);
    const verses = await readVerses();
    const verseId = `${surahNum}_${verseNum}`;

    if (verses.find((v) => v.id === verseId)) {
      return res.status(409).json({
        message: "Verse already exists in database",
        existingVerse: verses.find((v) => v.id === verseId)
      });
    }

    try {
      console.log(`Scraping verse ${surahNum}:${verseNum}...`);
      const scrapedData = await scrapeQuranVerse(surahNum, verseNum);

      if (!scrapedData.arabic || !scrapedData.english) {
        return res.status(404).json({
          message:
            "Could not scrape verse data. Verse may not exist or the website structure may have changed.",
          scrapedData
        });
      }

      console.log(`Enhancing verse with Gemini AI...`);
      const enhancedVerse = await enhanceVerseWithGemini(
        scrapedData,
        surahNum,
        verseNum
      );

      enhancedVerse.created_by = {
        userId,
        userName,
        timestamp: new Date().toISOString()
      };

      verses.push(enhancedVerse);
      await writeVerses(verses);

      console.log(`Successfully added verse ${surahNum}:${verseNum}`);

      res.status(201).json({
        message: "Verse successfully added with AI enhancement",
        verse: enhancedVerse,
        enhancement_method: useStreaming === "true" ? "streaming" : "standard"
      });
    } catch (scrapeError) {
      console.error("Error scraping or enhancing verse:", scrapeError);

      if (scrapeError.message.includes("Failed to scrape")) {
        return res.status(404).json({
          message:
            "Could not access the verse. Please check if the surah and verse numbers are correct.",
          error: scrapeError.message,
          suggestion:
            "Try a different verse or check if the website is accessible."
        });
      }

      if (scrapeError.message.includes("AI service")) {
        return res.status(503).json({
          message: "AI enhancement service is currently unavailable",
          error: scrapeError.message,
          suggestion:
            "The verse data was scraped but AI enhancement failed. You can try again later or add the verse manually."
        });
      }

      throw scrapeError;
    }
  } catch (err) {
    console.error("Error in addVerse:", err);
    res.status(500).json({
      message: "Error adding verse",
      error: err.message
    });
  }
};

exports.addVerseManual = async (req, res) => {
  try {
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        message: "User information is required",
        error: "userId and userName are required"
      });
    }

    validateVerseData(req.body);

    const verses = await readVerses();
    if (verses.find((v) => v.id === req.body.id)) {
      return res.status(409).json({
        message: "Verse with this ID already exists",
        existingVerse: verses.find((v) => v.id === req.body.id)
      });
    }

    const newVerse = {
      ...req.body,
      bangla: req.body.bangla || null,
      reference: {
        surah: req.body.reference.surah,
        ayah: req.body.reference.ayah,
        text:
          req.body.reference.text ||
          SURAH_NAMES[req.body.reference.surah] ||
          "Unknown"
      },
      source: req.body.source || "Manual entry",
      tags: req.body.tags || ["quran"],
      context: req.body.context || "Context not provided",
      translation_info: req.body.translation_info || {
        english_translator: userName || "Unknown",
        bangla_translator: userName || "Manual entry",
        language: "multi"
      },
      created_by: {
        userId,
        userName,
        timestamp: new Date().toISOString()
      }
    };

    verses.push(newVerse);
    await writeVerses(verses);

    console.log(`Manually added verse with ID: ${newVerse.id}`);

    res.status(201).json({
      message: "Verse added manually",
      verse: newVerse
    });
  } catch (err) {
    console.error("Error in addVerseManual:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error adding verse",
      error: err.message
    });
  }
};

exports.editVerse = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, userName, ...updates } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        message: "User information is required",
        error: "userId and userName are required"
      });
    }

    validateVerseId(id);
    validateVerseData(updates);

    const verses = await readVerses();
    const index = verses.findIndex((v) => v.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id,
        availableIds: verses.slice(0, 5).map((v) => v.id)
      });
    }

    const originalVerse = { ...verses[index] };
    const updatedVerse = {
      ...originalVerse,
      ...updates,
      updated_by: {
        userId,
        userName,
        timestamp: new Date().toISOString()
      }
    };

   
    const requiredFields = ["arabic", "english"];
    const emptyFields = requiredFields.filter(
      (field) => !updatedVerse[field]?.trim()
    );

    if (emptyFields.length > 0) {
      return res.status(400).json({
        message: `Required fields cannot be empty: ${emptyFields.join(", ")}`,
        emptyFields
      });
    }

 
    if (!Array.isArray(updatedVerse.mood) || updatedVerse.mood.length === 0) {
      return res.status(400).json({
        message: "Mood must be a non-empty array"
      });
    }

    verses[index] = updatedVerse;
    await writeVerses(verses);

    console.log(`Updated verse with ID: ${id}`);

    res.json({
      message: "Verse updated successfully",
      verse: updatedVerse,
      changes: Object.keys(updates).filter(
        (key) => updates[key] !== originalVerse[key]
      )
    });
  } catch (err) {
    console.error("Error in editVerse:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error updating verse",
      error: err.message
    });
  }
};

exports.deleteVerse = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        message: "User information is required",
        error: "userId and userName are required"
      });
    }

    validateVerseId(id);

    const verses = await readVerses();
    const index = verses.findIndex((v) => v.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id,
        availableIds: verses.slice(0, 5).map((v) => v.id)
      });
    }

    const deletedVerse = verses[index];
    verses.splice(index, 1);
    await writeVerses(verses);

    console.log(`Deleted verse with ID: ${id} by user ${userName}`);

    res.json({
      message: "Verse deleted successfully",
      deletedVerse: {
        id: deletedVerse.id,
        reference: deletedVerse.reference,
        english: deletedVerse.english?.substring(0, 50) + "...",
        deleted_by: {
          userId,
          userName,
          timestamp: new Date().toISOString()
        }
      },
      remainingCount: verses.length
    });
  } catch (err) {
    console.error("Error in deleteVerse:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error deleting verse",
      error: err.message
    });
  }
};

exports.getAllVerses = async (req, res) => {
  try {
    const verses = await readVerses();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const paginatedVerses = verses.slice(offset, offset + limit);

    res.json({
      verses: paginatedVerses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(verses.length / limit),
        totalVerses: verses.length,
        versesPerPage: limit,
        hasNextPage: offset + limit < verses.length,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error("Error in getAllVerses:", err);
    res.status(500).json({
      message: "Error fetching verses",
      error: err.message
    });
  }
};

exports.getVerseById = async (req, res) => {
  try {
    const id = req.params.id;
    validateVerseId(id);

    const verses = await readVerses();
    const verse = verses.find((v) => v.id === id);

    if (!verse) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id
      });
    }

    res.json({ verse });
  } catch (err) {
    console.error("Error in getVerseById:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error fetching verse",
      error: err.message
    });
  }
};

exports.getVersesByTag = async (req, res) => {
  try {
    const verses = await readVerses();
    const tag = req.query.tag?.toLowerCase();

    if (!tag) {
      return res.status(400).json({
        message: "Tag query parameter is required",
        example: "/verses/search/tag?tag=prayer"
      });
    }

    const filtered = verses.filter((v) =>
      v.tags?.some((t) => t.toLowerCase().includes(tag))
    );

    if (filtered.length === 0) {
      return res.status(404).json({
        message: "No verses found for that tag",
        searchedTag: tag,
        availableTags: [...new Set(verses.flatMap((v) => v.tags || []))].slice(
          0,
          10
        )
      });
    }

    res.json({
      verses: filtered,
      count: filtered.length,
      searchedTag: tag
    });
  } catch (err) {
    console.error("Error in getVersesByTag:", err);
    res.status(500).json({
      message: "Error searching verses by tag",
      error: err.message
    });
  }
};

exports.getMoods = async (req, res) => {
  try {
    const verses = await readVerses();
    const allMoods = verses.flatMap((verse) => verse.mood || []);
    const uniqueMoods = [...new Set(allMoods)];

    res.json({ moods: uniqueMoods });
  } catch (err) {
    console.error("Error in getMoods:", err);
    res.status(500).json({
      message: "Error fetching moods",
      error: err.message
    });
  }
};
