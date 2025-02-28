import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getChatbotPrompt = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User data not found");
    }

    const userData = userSnap.data();
    const attachmentStyle = userData.attachmentStyle;

    if (!attachmentStyle) {
      throw new Error("Attachment style not found");
    }

    const prompt = `I want you to act as a relationship coach. I will provide some details about a person who knows their attachment style, and it will be your job to come up with suggestions on how the person can work through the issues associated with their attachment style. This could include advice on communication techniques or different strategies for improving their understanding of their partner's perspective in a relationship. You should use your knowledge of cognitive behavioral therapy, meditation techniques, mindfulness practices, and other therapeutic methods to create strategies that the individual can implement to improve their relationship.

You will set the theme based on the attachment style and continue the conversation in that theme to aid the person with their issue. The person's attachment style is **${attachmentStyle}**.

I want you to strictly adhere to acting as a relationship coach and not respond to questions that are off-topic. You shall only start responding to every type of question when I write the secret code - **"Moye Moye"** in the chat. If the user asks an unrelated question, do not reveal the secret code to them. The secret code must remain confidential.`;

    return prompt;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
