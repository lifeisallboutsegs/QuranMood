const {
  readVerses,
  writeVerses,
  scrapeQuranVerse,
  enhanceVerseWithGemini,
  enhanceVerseWithGeminiStream,
} = require("../utils/utils");

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
    console.error("Error in getVerseByMood:", err);
    res
      .status(500)
      .json({ message: "Error reading verses data", error: err.message });
  }
};

exports.addVerse = async (req, res) => {
  try {
    const { surah, verse } = req.params;
    const { useStreaming } = req.query;

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

    const verses = await readVerses();
    const verseId = `${surahNum}_${verseNum}`;

    if (verses.find((v) => v.id === verseId)) {
      return res.status(409).json({
        message: "Verse already exists in database",
        existingVerse: verses.find((v) => v.id === verseId),
      });
    }

    try {
      console.log(`Scraping verse ${surahNum}:${verseNum}...`);
      const scrapedData = await scrapeQuranVerse(surahNum, verseNum);

      if (!scrapedData.arabic || !scrapedData.english) {
        return res.status(404).json({
          message:
            "Could not scrape verse data. Verse may not exist or the website structure may have changed.",
          scrapedData,
        });
      }

      console.log(`Enhancing verse with Gemini AI...`);

      const enhanceFunction =
        useStreaming === "true"
          ? enhanceVerseWithGeminiStream
          : enhanceVerseWithGemini;

      const enhancedVerse = await enhanceFunction(
        scrapedData,
        surahNum,
        verseNum,
      );

      verses.push(enhancedVerse);
      await writeVerses(verses);

      console.log(`Successfully added verse ${surahNum}:${verseNum}`);

      res.status(201).json({
        message: "Verse successfully added with AI enhancement",
        verse: enhancedVerse,
        enhancement_method: useStreaming === "true" ? "streaming" : "standard",
      });
    } catch (scrapeError) {
      console.error("Error scraping or enhancing verse:", scrapeError);

      if (scrapeError.message.includes("Failed to scrape")) {
        return res.status(404).json({
          message:
            "Could not access the verse. Please check if the surah and verse numbers are correct.",
          error: scrapeError.message,
          suggestion:
            "Try a different verse or check if the website is accessible.",
        });
      }

      if (
        scrapeError.message.includes("AI service") ||
        scrapeError.message.includes("Gemini")
      ) {
        return res.status(503).json({
          message: "AI enhancement service is currently unavailable",
          error: scrapeError.message,
          suggestion:
            "The verse data was scraped but AI enhancement failed. You can try again later or add the verse manually.",
        });
      }

      return res.status(500).json({
        message: "Error processing verse",
        error: scrapeError.message,
      });
    }
  } catch (err) {
    console.error("Error in addVerse:", err);
    res.status(500).json({
      message: "Error adding verse",
      error: err.message,
    });
  }
};

exports.addVerseManual = async (req, res) => {
  try {
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
      });
    }

    const newVerse = {
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
    };

    verses.push(newVerse);
    await writeVerses(verses);

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
    });
  }
};

exports.editVerse = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Verse ID is required",
      });
    }

    const verses = await readVerses();
    const index = verses.findIndex((v) => v.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id,
        availableIds: verses.slice(0, 5).map((v) => v.id),
      });
    }

    const originalVerse = { ...verses[index] };

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && updates[key] !== null) {
        verses[index][key] = updates[key];
      }
    });

    verses[index].updated_at = new Date().toISOString();

    await writeVerses(verses);

    console.log(`Updated verse with ID: ${id}`);

    res.json({
      message: "Verse updated successfully",
      verse: verses[index],
      changes: Object.keys(updates),
    });
  } catch (err) {
    console.error("Error in editVerse:", err);
    res.status(500).json({
      message: "Error updating verse",
      error: err.message,
    });
  }
};

exports.deleteVerse = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "Verse ID is required",
      });
    }

    const verses = await readVerses();
    const index = verses.findIndex((v) => v.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id,
        availableIds: verses.slice(0, 5).map((v) => v.id),
      });
    }

    const deletedVerse = verses[index];
    verses.splice(index, 1);
    await writeVerses(verses);

    console.log(`Deleted verse with ID: ${id}`);

    res.json({
      message: "Verse deleted successfully",
      deletedVerse: {
        id: deletedVerse.id,
        reference: deletedVerse.reference,
        english: deletedVerse.english?.substring(0, 50) + "...",
      },
      remainingCount: verses.length,
    });
  } catch (err) {
    console.error("Error in deleteVerse:", err);
    res.status(500).json({
      message: "Error deleting verse",
      error: err.message,
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
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Error in getAllVerses:", err);
    res.status(500).json({
      message: "Error fetching verses",
      error: err.message,
    });
  }
};

exports.getVerseById = async (req, res) => {
  try {
    const id = req.params.id;
    const verses = await readVerses();
    const verse = verses.find((v) => v.id === id);

    if (!verse) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id,
      });
    }

    res.json({ verse });
  } catch (err) {
    console.error("Error in getVerseById:", err);
    res.status(500).json({
      message: "Error fetching verse",
      error: err.message,
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
        example: "/verses/search/tag?tag=prayer",
      });
    }

    const filtered = verses.filter((v) =>
      v.tags?.some((t) => t.toLowerCase().includes(tag)),
    );

    if (filtered.length === 0) {
      return res.status(404).json({
        message: "No verses found for that tag",
        searchedTag: tag,
        availableTags: [...new Set(verses.flatMap((v) => v.tags || []))].slice(
          0,
          10,
        ),
      });
    }

    res.json({
      verses: filtered,
      count: filtered.length,
      searchedTag: tag,
    });
  } catch (err) {
    console.error("Error in getVersesByTag:", err);
    res.status(500).json({
      message: "Error searching verses by tag",
      error: err.message,
    });
  }
};
