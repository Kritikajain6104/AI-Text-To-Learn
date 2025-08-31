const { google } = require("googleapis");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

exports.searchVideos = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 1,
      videoEmbeddable: "true",
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ message: "No video found." });
    }

    const videoId = response.data.items[0].id.videoId;
    res.status(200).json({ videoId });
  } catch (error) {
    console.error("Error searching YouTube:", error);
    res.status(500).json({ message: "Failed to search for videos." });
  }
};
