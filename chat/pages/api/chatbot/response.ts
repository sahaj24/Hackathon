import { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { generateChatbotResponse } from "@/lib/chatbot"; // Helper function for LLM interaction

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userId, message, unlocked } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch user's attachment style from Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    const attachmentStyle = userSnap.data().attachmentStyle || "Unknown";

    // Secret Code Logic (Unlock Full Chat)
    if (message.trim() === "Moye Moye") {
      return res.status(200).json({
        response: "You have unlocked unrestricted chat! You can now ask about anything.",
        unlocked: true
      });
    }

    // Enforce topic restriction unless unlocked
    if (!unlocked && !message.toLowerCase().includes(attachmentStyle.toLowerCase())) {
      return res.status(200).json({
        response: `Let's focus on improving your relationships based on your ${attachmentStyle} attachment style. What struggles are you facing?`
      });
    }

    // Generate chatbot response using LLM
    const chatbotResponse = await generateChatbotResponse(attachmentStyle, message);

    return res.status(200).json({ response: chatbotResponse });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
