/********************************************
 * backend/server.js
 ********************************************/
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 1) Your actual Venice token:
const VENICE_API_TOKEN = "1NrQQW2p6t0TS3_KUkF_JJCoe-9wCcsEvOSBqeXQDA";

// 2) POST /api/generate-image
app.post("/api/generate-image", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Prepare request body for Venice
    const venicePayload = {
      model: "fluently-xl",
      prompt: prompt,
      width: 512,
      height: 512,
      steps: 30,
      hide_watermark: false,
      return_binary: false,
      seed: Math.floor(Math.random() * 1000000),
      cfg_scale: 7.5,
      negative_prompt: "",
    };

    // Log the payload we're sending to Venice
    console.log("Sending payload to Venice:", venicePayload);

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VENICE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(venicePayload),
    };

    // Call Venice API
    const veniceResponse = await fetch(
      "https://api.venice.ai/api/v1/image/generate",
      options
    );

    // Log the raw response from Venice
    console.log("Venice Response Status:", veniceResponse.status);
    const data = await veniceResponse.json();
    console.log("Venice Response Data:", data);

    if (!veniceResponse.ok) {
      return res.status(400).json({
        error: "Venice API error",
        details: data,
      });
    }

    console.log("Venice API response:", data);

    // According to Venice docs, "images" is an array (often of Base64 strings).
    if (!data.images || data.images.length === 0) {
      return res
        .status(400)
        .json({ error: "No image data returned from Venice." });
    }

    // data.images[0] should be the first generated image (Base64-encoded)
    const base64Image = data.images[0]; // e.g. iVBORw0KGgoAAAANSUhEUg...

    // Convert to a Data URI so it can be displayed directly in an <img> tag:
    // If your model returns PNG or JPEG specifically, adjust image/png -> image/jpeg, etc.
    const dataUri = `data:image/png;base64,${base64Image}`;

    // Return to frontend
    res.json({ image: dataUri });
  } catch (error) {
    console.error("Backend error details:", error);
    console.error("Error generating image:", error);
    res.status(500).json({
      error: "Failed to generate image",
      details: error.message,
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
