const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenAI, Type } = require("@google/genai");

const API_KEY = "";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || API_KEY
});

const SURAH_NAMES = {
  1: "Al-Fatihah (The Opening)",
  2: "Al-Baqarah (The Cow)",
  3: "Al-Imran (The Family of Imran)",
  4: "An-Nisa (The Women)",
  5: "Al-Ma'idah (The Table Spread)",
  6: "Al-An'am (The Cattle)",
  7: "Al-A'raf (The Heights)",
  8: "Al-Anfal (The Spoils of War)",
  9: "At-Tawbah (The Repentance)",
  10: "Yunus (Jonah)",
  11: "Hud",
  12: "Yusuf (Joseph)",
  13: "Ar-Ra'd (The Thunder)",
  14: "Ibrahim (Abraham)",
  15: "Al-Hijr (The Rocky Tract)",
  16: "An-Nahl (The Bee)",
  17: "Al-Isra (The Night Journey)",
  18: "Al-Kahf (The Cave)",
  19: "Maryam (Mary)",
  20: "Ta-Ha",
  21: "Al-Anbiya (The Prophets)",
  22: "Al-Hajj (The Pilgrimage)",
  23: "Al-Mu'minun (The Believers)",
  24: "An-Nur (The Light)",
  25: "Al-Furqan (The Criterion)",
  26: "Ash-Shu'ara (The Poets)",
  27: "An-Naml (The Ants)",
  28: "Al-Qasas (The Stories)",
  29: "Al-Ankabut (The Spider)",
  30: "Ar-Rum (The Romans)",
  31: "Luqman",
  32: "As-Sajdah (The Prostration)",
  33: "Al-Ahzab (The Combined Forces)",
  34: "Saba (Sheba)",
  35: "Fatir (The Originator)",
  36: "Ya-Sin",
  37: "As-Saffat (Those Ranged in Ranks)",
  38: "Sad",
  39: "Az-Zumar (The Groups)",
  40: "Ghafir (The Forgiver)",
  41: "Fussilat (Explained in Detail)",
  42: "Ash-Shura (The Consultation)",
  43: "Az-Zukhruf (The Gold Adornments)",
  44: "Ad-Dukhan (The Smoke)",
  45: "Al-Jathiyah (The Kneeling)",
  46: "Al-Ahqaf (The Wind-Curved Sandhills)",
  47: "Muhammad",
  48: "Al-Fath (The Victory)",
  49: "Al-Hujurat (The Rooms)",
  50: "Qaf",
  51: "Adh-Dhariyat (The Wind that Scatter)",
  52: "At-Tur (The Mount)",
  53: "An-Najm (The Star)",
  54: "Al-Qamar (The Moon)",
  55: "Ar-Rahman (The Most Merciful)",
  56: "Al-Waqi'ah (The Inevitable)",
  57: "Al-Hadid (The Iron)",
  58: "Al-Mujadilah (The Pleading Woman)",
  59: "Al-Hashr (The Exile)",
  60: "Al-Mumtahanah (The Woman to be Examined)",
  61: "As-Saff (The Ranks)",
  62: "Al-Jumu'ah (Friday)",
  63: "Al-Munafiqun (The Hypocrites)",
  64: "At-Taghabun (Mutual Disillusion)",
  65: "At-Talaq (Divorce)",
  66: "At-Tahrim (The Prohibition)",
  67: "Al-Mulk (The Sovereignty)",
  68: "Al-Qalam (The Pen)",
  69: "Al-Haqqah (The Reality)",
  70: "Al-Ma'arij (The Ascending Stairways)",
  71: "Nuh (Noah)",
  72: "Al-Jinn (The Jinn)",
  73: "Al-Muzzammil (The Enshrouded One)",
  74: "Al-Muddaththir (The Cloaked One)",
  75: "Al-Qiyamah (The Resurrection)",
  76: "Al-Insan (The Human)",
  77: "Al-Mursalat (The Emissaries)",
  78: "An-Naba (The Tidings)",
  79: "An-Nazi'at (Those who Drag Forth)",
  80: "Abasa (He Frowned)",
  81: "At-Takwir (The Overthrowing)",
  82: "Al-Infitar (The Cleaving)",
  83: "Al-Mutaffifin (Defrauding)",
  84: "Al-Inshiqaq (The Splitting Open)",
  85: "Al-Buruj (The Mansions of the Stars)",
  86: "At-Tariq (The Morning Star)",
  87: "Al-A'la (The Most High)",
  88: "Al-Ghashiyah (The Overwhelming)",
  89: "Al-Fajr (The Dawn)",
  90: "Al-Balad (The City)",
  91: "Ash-Shams (The Sun)",
  92: "Al-Layl (The Night)",
  93: "Ad-Duha (The Morning Hours)",
  94: "Al-Inshirah (The Relief)",
  95: "At-Tin (The Fig)",
  96: "Al-Alaq (The Clot)",
  97: "Al-Qadr (The Power)",
  98: "Al-Bayyinah (The Clear Proof)",
  99: "Az-Zalzalah (The Earthquake)",
  100: "Al-Adiyat (The Courser)",
  101: "Al-Qari'ah (The Calamity)",
  102: "At-Takathur (The Rivalry in World Increase)",
  103: "Al-Asr (The Declining Day)",
  104: "Al-Humazah (The Traducer)",
  105: "Al-Fil (The Elephant)",
  106: "Quraysh",
  107: "Al-Ma'un (The Small Kindnesses)",
  108: "Al-Kawthar (The Abundance)",
  109: "Al-Kafirun (The Disbelievers)",
  110: "An-Nasr (The Divine Support)",
  111: "Al-Masad (The Palm Fibre)",
  112: "Al-Ikhlas (The Sincerity)",
  113: "Al-Falaq (The Daybreak)",
  114: "An-Nas (Mankind)"
};

const getSurahNameByID = (id) => {
  return SURAH_NAMES[id] || null;
};

const validateSurahVerse = (surah, verse) => {
  const surahNum = parseInt(surah);
  const verseNum = parseInt(verse);

  if (
    isNaN(surahNum) ||
    isNaN(verseNum) ||
    surahNum < 1 ||
    surahNum > 114 ||
    verseNum < 1
  ) {
    throw new Error(
      "Invalid surah or verse number. Surah must be 1-114, verse must be >= 1"
    );
  }

  return { surahNum, verseNum };
};

const validateVerseData = (data) => {
  const required = ["mood", "arabic", "english"];
  const missing = required.filter((field) => !data[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }

  if (!Array.isArray(data.mood)) {
    throw new Error("Mood must be an array of strings");
  }
};

const scrapeQuranVerse = async (surah, verse) => {
  try {
    const url = `https://quran.com/${surah}/${verse}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    const $ = cheerio.load(response.data);

    const arabic = $(".SeoTextForVerse_visuallyHidden__IYmKh > div")
      .eq(1)
      .text()
      .trim();

    const english = $(".TranslationText_text__E_qTb").first().text().trim();

    const pageTitle = $("title").text();
    const surahMatch = pageTitle.match(/Surah (.+?) - \d+/);
    const surahName = surahMatch
      ? surahMatch[1]
      : SURAH_NAMES[surah] || `Surah ${surah}`;

    return {
      arabic,
      english,
      surahName,
      surah: parseInt(surah),
      verse: parseInt(verse),
      url
    };
  } catch (error) {
    console.error("Error scraping verse:", error.message);
    throw new Error(`Failed to scrape verse ${surah}:${verse}`);
  }
};

const enhanceVerseWithGemini = async (scrapedData, surah, verse) => {
  try {
    const config = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bangla: { type: Type.STRING },
          mood: { type: Type.ARRAY, items: { type: Type.STRING } },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          context: { type: Type.STRING }
        }
      }
    };

    const prompt = `
You are an Islamic scholar and translator. I will provide you with a Quranic verse in Arabic and English. Please enhance this data by providing:

1. A Bengali (Bangla) translation
2. Emotional mood tags (what feelings/situations this verse addresses)
3. Thematic tags (key concepts/themes)
4. Context and significance

Arabic: ${scrapedData.arabic}
English: ${scrapedData.english}
Surah: ${scrapedData.surahName}
Verse: ${surah}:${verse}

Mood tags should include emotions or life situations this verse might help with (e.g., "anxiety", "gratitude", "patience", "hope", "guidance").
Thematic tags should include key Islamic concepts (e.g., "prayer", "faith", "mercy", "forgiveness", "worship").
Keep the response concise but meaningful.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      config,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    let enhancedData;
    try {
      enhancedData = JSON.parse(response.text);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      enhancedData = {
        bangla: "Translation not available",
        mood: ["guidance"],
        tags: ["quran"],
        context: "Context not available"
      };
    }

    return {
      reference: {
        surah: parseInt(surah),
        ayah: parseInt(verse),
        text: scrapedData.surahName
      },
      mood: enhancedData.mood || ["guidance"],
      arabic: scrapedData.arabic,
      english: scrapedData.english,
      bangla: enhancedData.bangla || "Translation not available",
      source: scrapedData.url,
      tags: enhancedData.tags || ["quran"],
      context: enhancedData.context || "Context not available",
      translation_info: {
        english_translator: "From source",
        bangla_translator: "Gemini AI",
        language: "multi"
      }
    };
  } catch (error) {
    console.error("Error enhancing with Gemini:", error.message);
    throw new Error("AI enhancement service is currently unavailable");
  }
};

module.exports = {
  validateSurahVerse,
  validateVerseData,
  scrapeQuranVerse,
  enhanceVerseWithGemini,
  SURAH_NAMES,
  getSurahNameByID
};
