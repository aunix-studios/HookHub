const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello! App is live."));
app.get("/callback", (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code received from Discord.");
  res.send(`Received code: ${code}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
