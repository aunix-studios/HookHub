const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();

// --- Discord Credentials ---
const CLIENT_ID = "1418445495940157442";          
const CLIENT_SECRET = "I78RQII2lkeNW6tG-D23Pq2lK213_z-T"; 
const REDIRECT_URI = "https://hookhub.onrender.com/callback"; 

app.use(express.json());

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// OAuth2 callback
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code received from Discord.");

  try {
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        scope: "identify guilds"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    res.send(`
      <script>
        localStorage.setItem("discord_access_token", "${accessToken}");
        localStorage.setItem("discord_user", '${JSON.stringify(userRes.data)}');
        window.location.href = "/";
      </script>
    `);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("Failed to fetch token or user info.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
