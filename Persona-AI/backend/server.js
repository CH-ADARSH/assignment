import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HITESH_CHOUDHARY, PIYUSH_GARG } from "./personaConfigs.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

app.use(cors());
app.use(express.json());

// Persona prompt selector function
function getPersonaPrompt(personaId) {
  switch (personaId) {
    case "hitesh":
      return HITESH_CHOUDHARY;
    case "piyush":
      return PIYUSH_GARG;
    default:
      return null;
  }
}

// Chat API using persona prompt
app.post("/api/chat", async (req, res) => {
  const { message, personaId } = req.body;

  if (!message || !personaId) {
    return res
      .status(400)
      .json({ error: "Message and personaId are required." });
  }

  const systemPrompt = getPersonaPrompt(personaId);
  if (!systemPrompt) {
    return res.status(400).json({ error: "Unknown persona ID." });
  }

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ];

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Perplexity API error");
    }

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content || "Sorry, no response generated.";
    res.json({ reply });
  } catch (error) {
    console.error("Perplexity API error:", error.message);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
