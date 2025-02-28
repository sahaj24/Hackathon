import { NextResponse } from "next/server";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || "gemini-2.0-flash-exp"; // Default model

// Ensure API key is set
if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing! Set it in environment variables.");
  throw new Error("GEMINI_API_KEY is not set.");
}

// Ensure model name is set
if (!MODEL_NAME) {
  console.warn("⚠️ GEMINI_MODEL_NAME is not set. Defaulting to 'gemini-2.0-flash-exp'. Ensure this model is available.");
}

export async function POST(request: Request) {
  try {
    const { message, attachment_style, ...config } = await request.json();

    // Validate message input
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }
    if (message.length > 4096) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Define the initial prompt with dynamic attachment style
    const initialPrompt = `I want you to act as a relationship coach. I will provide some details about a person who knows his attachment style, and it will be your job to come up with suggestions on how the person can work through the issues associated with their attachment style. This could include advice on communication techniques or different strategies for improving their understanding of their partner's perspective in a relationship. You should use your knowledge of cognitive behavioral therapy, meditation techniques, mindfulness practices, and other therapeutic methods in order to create strategies that the individual can implement in order to improve their relationship. You will set the theme based upon the attachment style, and will continue the talk in that same theme, to aid the person with their issue.

The person's attachment style is **${attachment_style}**.

I want you to strictly adhere to acting as a relationship coach and not respond to questions which feel away from the topic. You shall only start responding to every type of question when I write the secret code - "Tori Maai Ke Chodo" in the chat. If the user asks a question which is not related to the topic, then don't reveal the secret code to the user. The secret code should be confidential.`;

    const url = `${GEMINI_API_URL}${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [{ text: `${initialPrompt}\n\nUser: ${message}` }],
        },
      ],
      ...config, // Include additional config if provided
      safetySettings: config.safetySettings || [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    };

    // Make request to Gemini API
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Handle response errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || `Gemini API Error: ${response.status} ${response.statusText}`;
      console.error("❌ Gemini API Error:", errorMessage);

      const statusMap: Record<number, string> = {
        400: "Bad Request: Check your input.",
        401: "Unauthorized: Invalid API Key.",
        429: "Too Many Requests: Rate limit exceeded.",
      };

      return NextResponse.json({ error: statusMap[response.status] || errorMessage }, { status: response.status });
    }

    const data = await response.json();

    // Extract AI response safely
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error("⚠️ No valid reply from Gemini API. Debug data:", data);
      return NextResponse.json({ error: "No reply returned from Gemini API.", debug: data }, { status: 500 });
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("❌ Server Error in POST /api/chat:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
