const express = require("express");
const app = express();

// Home page
app.get("/", (req, res) => {
  res.send("Hello! Your Discord OAuth2 app is live.");
});

// OAuth2 callback endpoint
app.get("/callback", (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code received from Discord.");
  res.send(`Received OAuth2 code: ${code}`);
});

// Start server on Render-assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
