import { useState } from "react";

function Quran() {
  const [verse, setVerse] = useState("");
  const [surah, setSurah] = useState("");
  const [urduData, setUrduData] = useState(null);
  const [englishData, setEnglishData] = useState(null);
  const [error, setError] = useState("");
  const [versePictureUrl, setVersePictureUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  // generic fetch function
  const fetchData = async (apiUrl, setter) => {
    if (!verse || isNaN(verse) || !surah || isNaN(surah)) {
      setError("Please enter valid surah and verse numbers");
      return;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Invalid verse number or API error");
      }

      const result = await response.json();
      setter(result);
      setError("");
    } catch (err) {
      setter(null);
      setError(err.message || "An unexpected error occurred");
    }
  };

  // urdu translation of arabic verses
  const verseTranslationUrdu = async () => {
    const urduApiKey = `https://api.alquran.cloud/v1/ayah/${surah}:${verse}/ur.ahmedali`;
    await fetchData(urduApiKey, setUrduData);
  };

  // english translation of arabic verses
  const verseTranslationEnglish = async () => {
    const englishApiKey = `https://api.alquran.cloud/v1/ayah/${surah}:${verse}/en.asad`;
    await fetchData(englishApiKey, setEnglishData);
  };

  // submit button
  const handleSubmit = async () => {
    if (!verse || !surah) {
      setError("Please enter valid surah and verse numbers");
      return;
    }

    setVersePictureUrl(
      `https://cdn.islamic.network/quran/images/${surah}_${verse}.png`
    );

    if (selectedLanguage === "urdu") {
      await verseTranslationUrdu();
      setEnglishData(null); // Ensure to clear the previous English data
    } else if (selectedLanguage === "english") {
      await verseTranslationEnglish();
      setUrduData(null); // Ensure to clear the previous Urdu data
    }
  };

  // reset button
  const handleReset = () => {
    setVerse("");
    setSurah("");
    setUrduData(null);
    setEnglishData(null);
    setError("");
    setVersePictureUrl("");
    setSelectedLanguage("");
  };

  const handleShare = () => {
    let url;
    if (selectedLanguage === "urdu") {
      url = `https://api.alquran.cloud/v1/ayah/${surah}:${verse}/ur.ahmedali`;
    } else if (selectedLanguage === "english") {
      url = `https://api.alquran.cloud/v1/ayah/${surah}:${verse}/en.asad`;
    } else {
      alert("Language not supported");
      return;
    }
  
    setShareUrl(url);
    navigator.clipboard.writeText(url)
      .then(() => alert("Verse URL copied to clipboard"))
      .catch(err => alert("Failed to copy URL: " + err));
  };
  

  return (
    <div className="container">
      <h1>Quran</h1>
      <br />
      <input
        type="number"
        value={surah}
        id="surahNumber"
        onChange={(e) => setSurah(e.target.value)}
        placeholder="Enter surah number"
      />
      <input
        type="number"
        value={verse}
        id="verseNumber"
        onChange={(e) => setVerse(e.target.value)}
        placeholder="Enter verse number"
      />
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
      >
        <option value="">Select Language</option>
        <option value="english">English</option>
        <option value="urdu">Urdu</option>
      </select>

      <div className="btn">
        <button className="submit" onClick={handleSubmit}>
          Get Translation
        </button>
        <button className="reset" onClick={handleReset}>
          Clear
        </button>
        <button className="share" onClick={handleShare}>
          Share
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {shareUrl && (
        <div>
          <p>Share this URL: {shareUrl}</p>
        </div>
      )}
      <div className="msg">
        {(urduData || englishData) && (
          <div>
            <p className="surah-name">
              Surah Name :{" "}
              {urduData
                ? urduData.data.surah.name
                : englishData.data.surah.name}
            </p>
            <p className="surah-name-english">
              Surah Name (in English) :{" "}
              {urduData
                ? urduData.data.surah.englishName
                : englishData.data.surah.englishName}
            </p>
            <p className="suran-name-translation-english">
              Surah Name Translation (in English) :{" "}
              {urduData
                ? urduData.data.surah.englishNameTranslation
                : englishData.data.surah.englishNameTranslation}
            </p>

            {versePictureUrl && (
              <div className="verse-picture">
                <img src={versePictureUrl} alt={`Verse ${verse}`} />
              </div>
            )}

            {selectedLanguage === "urdu" && urduData && (
              <p className="urdu-translation">
                Urdu Translation : {urduData.data.text}
              </p>
            )}

            {selectedLanguage === "english" && englishData && (
              <p className="english-translation">
                English Translation : {englishData.data.text}
              </p>
            )}

            <p className="revelation-type">
              Revelation Type :{" "}
              {urduData
                ? urduData.data.surah.revelationType
                : englishData.data.surah.revelationType}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quran;
