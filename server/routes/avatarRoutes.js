
const router = require("express").Router();
const axios = require("axios");

// Simple in-memory cache for avatars (for demo/dev use only)
const avatarCache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID is required" });

        // Check cache first
        const cached = avatarCache.get(id);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return res.status(200).json({ image: cached.image });
        }

        // Use DiceBear Avatars API (bottts style)
        const apiUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`;
        const response = await axios.get(apiUrl, {
            responseType: 'text',
            timeout: 2000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; TalkiesBot/1.0)'
            }
        });
        const base64Data = Buffer.from(response.data, "utf-8").toString("base64");
        const image = `data:image/svg+xml;base64,${base64Data}`;
        // Cache the result
        avatarCache.set(id, { image, timestamp: Date.now() });
        res.status(200).json({ image });
    } catch (err) {
        console.error("Error fetching avatars:", err.message);
        // Fallback: return a default avatar SVG (as base64) if available
        const defaultSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='#222'/><text x='50%' y='50%' font-size='18' fill='#fff' text-anchor='middle' alignment-baseline='middle'>?</text></svg>`;
        const fallback = `data:image/svg+xml;base64,${Buffer.from(defaultSvg).toString("base64")}`;
        res.status(200).json({ image: fallback, error: "Failed to fetch avatar, using fallback." });
    }
});

module.exports = router;