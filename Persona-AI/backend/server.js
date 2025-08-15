import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import personas from "./personaConfigs.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message, persona } = req.body;

  if (!message || !persona) {
    return res.status(400).json({ error: "Message and persona are required." });
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro", // adjust if you have preferred model
        messages: [
          {
            role: "system",
            content: `You are ${persona}, please answer with persona-specific tone and style.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
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
      data.choices?.[0]?.message?.content ||
      "Sorry, no response was generated.";

    res.json({ reply });
  } catch (error) {
    console.error("Error calling Perplexity API:", error.message);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
