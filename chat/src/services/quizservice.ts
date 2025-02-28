import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

/**
 * Function to calculate the attachment style based on quiz responses.
 * @param responses - Array of numbers representing quiz answers.
 * @returns A string representing the attachment style.
 */
export const calculateAttachmentStyle = (responses: number[]): string => {
  const sum = responses.reduce((acc, val) => acc + val, 0);

  if (sum <= 30) return "Avoidant";
  if (sum <= 60) return "Anxious";
  if (sum <= 90) return "Secure";
  return "Fearful-Avoidant";
};

/**
 * Function to store the calculated attachment style in Firestore.
 * @param userId - The user's unique ID.
 * @param attachmentStyle - The determined attachment style.
 */
export const saveQuizResults = async (userId: string, attachmentStyle: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { attachmentStyle });

    return { success: true, message: "Quiz results saved successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
