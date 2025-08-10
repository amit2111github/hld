const { getUrlFromShortUrl, insertLongUrl } = require("../accessor/url");
const { getHashedString } = require("../helper/index");

const getLongUrl = async (req, res) => {
  try {
    const { short: shortUrl } = req.params;
    const {
      rows: [{ long_url }],
    } = await getUrlFromShortUrl({ shortUrl });
    if (!long_url) {
      return res
        .status(404)
        .json({ error: "Url Not Found", message: "Invalid short url" });
    }
    return res.redirect(302, long_url);
  } catch (err) {
    console.log(err);
    return res
      .staus(500)
      .json({ error: err.message, message: "Failed to get short Url" });
  }
};

const generateLongUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "Missing long Url" });
    const shortUrl = getHashedString(longUrl);
    await insertLongUrl({ shortUrl, longUrl });
    return res.status(201).json({ data: { shortUrl } });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message, message: "Failed to create the short url" });
  }
};

module.exports = { getLongUrl, generateLongUrl };
