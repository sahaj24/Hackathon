import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Securely access API key
});

const openai = new OpenAIApi(configuration);

export async function generateChatbotResponse(attachmentStyle: string, message: string) {
  try {
    const prompt = `You are a relationship coach specializing in ${attachmentStyle} attachment style. Respond empathetically to this message:\n\nUser: ${message}\nCoach:`;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo", // Use "gpt-4" if available
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.data.choices[0]?.text?.trim() || "I'm here to help! What’s on your mind?";
  } catch (error) {
    console.error("Error with OpenAI:", error);
    return "Sorry, I’m having trouble responding right now.";
  }
}
