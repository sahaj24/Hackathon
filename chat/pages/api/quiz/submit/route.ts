import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { responses } = await request.json();

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      throw new Error("Invalid responses data.");
    }

    // Function to determine attachment style based on scores
    const determineAttachmentStyle = (responses: number[]) => {
      const avgScore = responses.reduce((sum, value) => sum + value, 0) / responses.length;

      if (avgScore < 2) return "Avoidant";
      if (avgScore < 4) return "Anxious";
      return "Secure";
    };

    const attachmentStyle = determineAttachmentStyle(responses);

    // First reply to user
    const firstReply = `Based on your quiz responses, your attachment style is **${attachmentStyle}**.`;

    // Prompt for Gemini AI
    const aiPrompt = `
      You are a relationship coach. The user has completed an attachment style quiz, and their attachment style is **${attachmentStyle}**.
      
      - Provide insights into this attachment style.
      - Suggest effective communication strategies.
      - Offer mindfulness techniques and emotional regulation tips.
      - Keep the response engaging and structured.
      - **Do not** answer unrelated questions unless the user types "Tori Maai Ke Chodo".

      User's attachment style: **${attachmentStyle}**
    `;

    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateText?key=YOUR_GEMINI_API_KEY", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: { text: aiPrompt },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(errorData.error?.message || "Gemini API request failed");
    }

    const data = await response.json();
    const aiReply = data?.candidates?.[0]?.output || "No response from AI.";

    return NextResponse.json({ firstReply, aiReply });

  } catch (error) {
    console.error("Chatbot Error:", error);
    return NextResponse.json({ error: "Sorry, something went wrong. Please try again." }, { status: 500 });
  }
}