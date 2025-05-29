const Verse = require('../models/Verse');
const {
  validateSurahVerse,
  validateVerseData,
  scrapeQuranVerse,
  enhanceVerseWithGemini,
  enhanceVerseWithGeminiStream,
  getSurahNameByID,
  SURAH_NAMES
} = require("../utils/verseUtils");

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];


const transformVerse = (verse) => {
  if (!verse) return null;
  const transformed = verse.toObject ? verse.toObject() : verse;
  return {
    ...transformed,
    id: transformed._id.toString(),
    _id: undefined
  };
};


const transformVerses = (verses) => {
  return verses.map(verse => transformVerse(verse));
};

exports.getVerseByMood = async (req, res) => {
  try {
    const mood = req.query.mood?.toLowerCase();

    let query = {};
    if (mood) {
      query.mood = { $regex: mood, $options: 'i' };
    }

    const verses = await Verse.find(query).select('_id reference arabic english bangla mood tags context source translation_info created_by updated_by');
    if (mood && verses.length === 0) {
      return res.status(404).json({ message: "No verses found for that mood" });
    }

    const randomVerse = randomItem(verses);
    if (!randomVerse) {
      return res.status(404).json({ message: "No verses found" });
    }

    res.json({ verse: transformVerse(randomVerse) });
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
    const verseId = `${surahNum}_${verseNum}`;

    const existingVerse = await Verse.findOne({
      'reference.surah': surahNum,
      'reference.ayah': verseNum
    });

    if (existingVerse) {
      return res.status(409).json({
        message: "Verse already exists in database",
        existingVerse: transformVerse(existingVerse)
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
      const enhanceFunction =
        useStreaming === "true"
          ? enhanceVerseWithGeminiStream
          : enhanceVerseWithGemini;
      const enhancedVerse = await enhanceFunction(
        scrapedData,
        surahNum,
        verseNum
      );

      enhancedVerse.created_by = {
        userId,
        userName,
        timestamp: new Date()
      };

      const verse = new Verse(enhancedVerse);
      await verse.save();

      console.log(`Successfully added verse ${surahNum}:${verseNum}`);

      res.status(201).json({
        message: "Verse successfully added with AI enhancement",
        verse: transformVerse(verse),
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

      if (
        scrapeError.message.includes("AI service") ||
        scrapeError.message.includes("Gemini")
      ) {
        return res.status(503).json({
          message: "AI enhancement service is currently unavailable",
          error: scrapeError.message,
          suggestion:
            "The verse data was scraped but AI enhancement failed. You can try again later or add the verse manually."
        });
      }

      return res.status(500).json({
        message: "Error processing verse",
        error: scrapeError.message
      });
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
    const { userId, userName, ...verseData } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        message: "User information is required",
        error: "userId and userName are required"
      });
    }

    validateVerseData(verseData);

    const existingVerse = await Verse.findOne({
      'reference.surah': verseData.reference.surah,
      'reference.ayah': verseData.reference.ayah
    });

    if (existingVerse) {
      return res.status(409).json({
        message: "Verse with this reference already exists",
        existingVerse: transformVerse(existingVerse)
      });
    }

    const newVerse = new Verse({
      ...verseData,
      bangla: verseData.bangla || null,
      reference: {
        surah: verseData.reference.surah,
        ayah: verseData.reference.ayah,
        text:
          verseData.reference.text ||
          SURAH_NAMES[verseData.reference.surah] ||
          "Unknown"
      },
      source: verseData.source || "Manual entry",
      tags: verseData.tags || ["quran"],
      context: verseData.context || "Context not provided",
      translation_info: verseData.translation_info || {
        english_translator: userName || "Unknown",
        bangla_translator: userName || "Manual entry",
        language: "multi"
      },
      created_by: {
        userId,
        userName,
        timestamp: new Date()
      }
    });

    await newVerse.save();

    console.log(`Manually added verse with reference: ${newVerse.reference.surah}:${newVerse.reference.ayah}`);

    res.status(201).json({
      message: "Verse added manually",
      verse: transformVerse(newVerse)
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

    validateVerseData(updates);

    const verse = await Verse.findById(id);
    if (!verse) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id
      });
    }

    const originalVerse = verse.toObject();
    const updatedVerse = {
      ...originalVerse,
      ...updates,
      updated_by: {
        userId,
        userName,
        timestamp: new Date()
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

    const result = await Verse.findByIdAndUpdate(
      id,
      { $set: updatedVerse },
      { new: true }
    );

    console.log(`Updated verse with ID: ${id}`);

    res.json({
      message: "Verse updated successfully",
      verse: transformVerse(result),
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

    const verse = await Verse.findById(id);
    if (!verse) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id
      });
    }

    await Verse.findByIdAndDelete(id);

    console.log(`Deleted verse with ID: ${id} by user ${userName}`);

    res.json({
      message: "Verse deleted successfully",
      deletedVerse: {
        id: verse._id.toString(),
        reference: verse.reference,
        english: verse.english?.substring(0, 50) + "...",
        deleted_by: {
          userId,
          userName,
          timestamp: new Date()
        }
      },
      remainingCount: await Verse.countDocuments()
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalVerses = await Verse.countDocuments();
    const verses = await Verse.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      verses: transformVerses(verses),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalVerses / limit),
        totalVerses,
        versesPerPage: limit,
        hasNextPage: skip + limit < totalVerses,
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
    
    if (!id) {
      return res.status(400).json({
        message: "Verse ID is required",
        error: "No ID provided"
      });
    }

    const verse = await Verse.findById(id);
    if (!verse) {
      return res.status(404).json({
        message: "Verse not found",
        searchedId: id
      });
    }

    res.json({ verse: transformVerse(verse) });
  } catch (err) {
    console.error("Error in getVerseById:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: "Invalid verse ID format",
        error: "The provided ID is not a valid MongoDB ObjectId"
      });
    }
    res.status(500).json({
      message: "Error fetching verse",
      error: err.message
    });
  }
};

exports.getVersesByTag = async (req, res) => {
  try {
    const tag = req.query.tag?.toLowerCase();

    if (!tag) {
      return res.status(400).json({
        message: "Tag query parameter is required",
        example: "/verses/search/tag?tag=prayer"
      });
    }

    const verses = await Verse.find({
      tags: { $regex: tag, $options: 'i' }
    });

    if (verses.length === 0) {
      const allTags = await Verse.distinct('tags');
      return res.status(404).json({
        message: "No verses found for that tag",
        searchedTag: tag,
        availableTags: allTags.slice(0, 10)
      });
    }

    res.json({
      verses: transformVerses(verses),
      count: verses.length,
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
    const allMoods = await Verse.distinct('mood');
    const uniqueMoods = [...new Set(allMoods)];

    const randomMoods = uniqueMoods
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    res.json({
      moods: randomMoods,
      totalMoods: uniqueMoods.length
    });
  } catch (err) {
    console.error("Error in getMoods:", err);
    res.status(500).json({
      message: "Error fetching moods",
      error: err.message
    });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await Verse.distinct('tags');
    res.json({ tags });
  } catch (err) {
    console.error("Error in getTags:", err);
    res.status(500).json({
      message: "Error fetching tags",
      error: err.message
    });
  }
};
