import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

/**
 * Registers a new user with email and password.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns The authenticated user object or an error message.
 */
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Logs in a user with email and password.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns The authenticated user object or an error message.
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Logs out the currently authenticated user.
 * @returns A success or error message.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

/**
 * Gets the currently authenticated user.
 * @returns The authenticated user object or null if no user is logged in.
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
