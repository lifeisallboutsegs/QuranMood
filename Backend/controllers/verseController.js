const {
  readVerses,
  writeVerses,
<<<<<<< HEAD
  validateVerseId,
  validateSurahVerse,
  validateVerseData,
  scrapeQuranVerse,
  enhanceVerseWithGemini,
  getSurahNameByID,
  SURAH_NAMES
} = require("../utils/verseUtils");
=======
  scrapeQuranVerse,
  enhanceVerseWithGemini,
  enhanceVerseWithGeminiStream,
} = require("../utils/utils");
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

exports.getVerseByMood = async (req, res) => {
  try {
    const verses = await readVerses();
    const mood = req.query.mood?.toLowerCase();

    let filtered = verses;
    if (mood) {
      filtered = verses.filter((v) =>
<<<<<<< HEAD
        v.mood.some((m) => m.toLowerCase().includes(mood))
=======
        v.mood.some((m) => m.toLowerCase().includes(mood)),
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
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
<<<<<<< HEAD
    res.status(500).json({
      message: "Error reading verses data",
      error: err.message
    });
=======
    res
      .status(500)
      .json({ message: "Error reading verses data", error: err.message });
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
  }
};

exports.addVerse = async (req, res) => {
  try {
    const { surah, verse } = req.params;
    const { useStreaming } = req.query;
<<<<<<< HEAD
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        message: "User information is required",
        error: "userId and userName are required"
      });
    }

    const { surahNum, verseNum } = validateSurahVerse(surah, verse);
=======

    if (!surah || !verse) {
      return res.status(400).json({
        message:
          "Surah and verse parameters are required. Use format: /add/:surah/:verse",
      });
    }

    const surahNum = parseInt(surah);
    const verseNum = parseInt(verse);

    if (
      isNaN(surahNum) ||
      isNaN(verseNum) ||
      surahNum < 1 ||
      surahNum > 114 ||
      verseNum < 1
    ) {
      return res.status(400).json({
        message:
          "Invalid surah or verse number. Surah must be 1-114, verse must be >= 1",
      });
    }

>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    const verses = await readVerses();
    const verseId = `${surahNum}_${verseNum}`;

    if (verses.find((v) => v.id === verseId)) {
      return res.status(409).json({
        message: "Verse already exists in database",
<<<<<<< HEAD
        existingVerse: verses.find((v) => v.id === verseId)
=======
        existingVerse: verses.find((v) => v.id === verseId),
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      });
    }

    try {
      console.log(`Scraping verse ${surahNum}:${verseNum}...`);
      const scrapedData = await scrapeQuranVerse(surahNum, verseNum);

      if (!scrapedData.arabic || !scrapedData.english) {
        return res.status(404).json({
          message:
            "Could not scrape verse data. Verse may not exist or the website structure may have changed.",
<<<<<<< HEAD
          scrapedData
=======
          scrapedData,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
        });
      }

      console.log(`Enhancing verse with Gemini AI...`);
<<<<<<< HEAD
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

=======

      const enhanceFunction =
        useStreaming === "true"
          ? enhanceVerseWithGeminiStream
          : enhanceVerseWithGemini;

      const enhancedVerse = await enhanceFunction(
        scrapedData,
        surahNum,
        verseNum,
      );

>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      verses.push(enhancedVerse);
      await writeVerses(verses);

      console.log(`Successfully added verse ${surahNum}:${verseNum}`);

      res.status(201).json({
        message: "Verse successfully added with AI enhancement",
        verse: enhancedVerse,
<<<<<<< HEAD
        enhancement_method: useStreaming === "true" ? "streaming" : "standard"
=======
        enhancement_method: useStreaming === "true" ? "streaming" : "standard",
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      });
    } catch (scrapeError) {
      console.error("Error scraping or enhancing verse:", scrapeError);

      if (scrapeError.message.includes("Failed to scrape")) {
        return res.status(404).json({
          message:
            "Could not access the verse. Please check if the surah and verse numbers are correct.",
          error: scrapeError.message,
          suggestion:
<<<<<<< HEAD
            "Try a different verse or check if the website is accessible."
        });
      }

      if (scrapeError.message.includes("AI service")) {
=======
            "Try a different verse or check if the website is accessible.",
        });
      }

      if (
        scrapeError.message.includes("AI service") ||
        scrapeError.message.includes("Gemini")
      ) {
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
        return res.status(503).json({
          message: "AI enhancement service is currently unavailable",
          error: scrapeError.message,
          suggestion:
<<<<<<< HEAD
            "The verse data was scraped but AI enhancement failed. You can try again later or add the verse manually."
        });
      }

      throw scrapeError;
=======
            "The verse data was scraped but AI enhancement failed. You can try again later or add the verse manually.",
        });
      }

      return res.status(500).json({
        message: "Error processing verse",
        error: scrapeError.message,
      });
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    }
  } catch (err) {
    console.error("Error in addVerse:", err);
    res.status(500).json({
      message: "Error adding verse",
<<<<<<< HEAD
      error: err.message
=======
      error: err.message,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    });
  }
};

exports.addVerseManual = async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const {
      id,
      mood,
      arabic,
      english,
      bangla,
      reference,
      source,
      tags,
      context,
      translation_info,
    } = req.body;

    if (!id || !mood || !arabic || !english) {
      return res.status(400).json({
        message: "Required fields missing",
        required: ["id", "mood", "arabic", "english"],
        received: Object.keys(req.body),
      });
    }

    if (!Array.isArray(mood)) {
      return res.status(400).json({
        message: "Mood must be an array of strings",
        example: ["guidance", "peace", "hope"],
      });
    }

    const verses = await readVerses();
    if (verses.find((v) => v.id === id)) {
      return res.status(409).json({
        message: "Verse with this ID already exists",
        existingVerse: verses.find((v) => v.id === id),
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      });
    }

    const newVerse = {
<<<<<<< HEAD
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
=======
      id,
      mood,
      arabic,
      english,
      bangla: bangla || "Translation not available",
      reference: reference || {},
      source: source || "Manual entry",
      tags: tags || ["quran"],
      context: context || "Context not provided",
      translation_info: translation_info || {
        english_translator: "Unknown",
        bangla_translator: "Manual entry",
        language: "multi",
      },
      created_at: new Date().toISOString(),
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    };

    verses.push(newVerse);
    await writeVerses(verses);

<<<<<<< HEAD
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
=======
    console.log(`Manually added verse with ID: ${id}`);

    res.status(201).json({
      message: "Verse added manually",
      verse: newVerse,
    });
  } catch (err) {
    console.error("Error in addVerseManual:", err);
    res.status(500).json({
      message: "Error adding verse",
      error: err.message,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    });
  }
};

exports.editVerse = async (req, res) => {
  try {
    const id = req.params.id;
<<<<<<< HEAD
    const { userId, userName, ...updates } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        message: "User information is required",
        error: "userId and userName are required"
      });
    }

    validateVerseId(id);
    validateVerseData(updates);

=======
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Verse ID is required",
      });
    }

>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    const verses = await readVerses();
    const index = verses.findIndex((v) => v.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id,
<<<<<<< HEAD
        availableIds: verses.slice(0, 5).map((v) => v.id)
=======
        availableIds: verses.slice(0, 5).map((v) => v.id),
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      });
    }

    const originalVerse = { ...verses[index] };
<<<<<<< HEAD
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
=======

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && updates[key] !== null) {
        verses[index][key] = updates[key];
      }
    });

    verses[index].updated_at = new Date().toISOString();

>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    await writeVerses(verses);

    console.log(`Updated verse with ID: ${id}`);

    res.json({
      message: "Verse updated successfully",
<<<<<<< HEAD
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
=======
      verse: verses[index],
      changes: Object.keys(updates),
    });
  } catch (err) {
    console.error("Error in editVerse:", err);
    res.status(500).json({
      message: "Error updating verse",
      error: err.message,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    });
  }
};

exports.deleteVerse = async (req, res) => {
  try {
    const id = req.params.id;
<<<<<<< HEAD
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        message: "User information is required",
        error: "userId and userName are required"
      });
    }

    validateVerseId(id);

=======

    if (!id) {
      return res.status(400).json({
        message: "Verse ID is required",
      });
    }

>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    const verses = await readVerses();
    const index = verses.findIndex((v) => v.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id,
<<<<<<< HEAD
        availableIds: verses.slice(0, 5).map((v) => v.id)
=======
        availableIds: verses.slice(0, 5).map((v) => v.id),
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      });
    }

    const deletedVerse = verses[index];
    verses.splice(index, 1);
    await writeVerses(verses);

<<<<<<< HEAD
    console.log(`Deleted verse with ID: ${id} by user ${userName}`);
=======
    console.log(`Deleted verse with ID: ${id}`);
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba

    res.json({
      message: "Verse deleted successfully",
      deletedVerse: {
        id: deletedVerse.id,
        reference: deletedVerse.reference,
        english: deletedVerse.english?.substring(0, 50) + "...",
<<<<<<< HEAD
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
=======
      },
      remainingCount: verses.length,
    });
  } catch (err) {
    console.error("Error in deleteVerse:", err);
    res.status(500).json({
      message: "Error deleting verse",
      error: err.message,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
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
<<<<<<< HEAD
        hasPrevPage: page > 1
      }
=======
        hasPrevPage: page > 1,
      },
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    });
  } catch (err) {
    console.error("Error in getAllVerses:", err);
    res.status(500).json({
      message: "Error fetching verses",
<<<<<<< HEAD
      error: err.message
=======
      error: err.message,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    });
  }
};

exports.getVerseById = async (req, res) => {
  try {
    const id = req.params.id;
<<<<<<< HEAD
    validateVerseId(id);

=======
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    const verses = await readVerses();
    const verse = verses.find((v) => v.id === id);

    if (!verse) {
      return res.status(404).json({
        message: "Verse not found",
<<<<<<< HEAD
        searchedId: id
=======
        searchedId: id,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      });
    }

    res.json({ verse });
  } catch (err) {
    console.error("Error in getVerseById:", err);
<<<<<<< HEAD
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error fetching verse",
      error: err.message
=======
    res.status(500).json({
      message: "Error fetching verse",
      error: err.message,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
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
<<<<<<< HEAD
        example: "/verses/search/tag?tag=prayer"
=======
        example: "/verses/search/tag?tag=prayer",
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      });
    }

    const filtered = verses.filter((v) =>
<<<<<<< HEAD
      v.tags?.some((t) => t.toLowerCase().includes(tag))
=======
      v.tags?.some((t) => t.toLowerCase().includes(tag)),
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    );

    if (filtered.length === 0) {
      return res.status(404).json({
        message: "No verses found for that tag",
        searchedTag: tag,
        availableTags: [...new Set(verses.flatMap((v) => v.tags || []))].slice(
          0,
<<<<<<< HEAD
          10
        )
=======
          10,
        ),
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
      });
    }

    res.json({
      verses: filtered,
      count: filtered.length,
<<<<<<< HEAD
      searchedTag: tag
=======
      searchedTag: tag,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    });
  } catch (err) {
    console.error("Error in getVersesByTag:", err);
    res.status(500).json({
      message: "Error searching verses by tag",
<<<<<<< HEAD
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
=======
      error: err.message,
>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
    });
  }
};
