import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const registerUser = async (email: string, password: string, userData: { name: string; age: number; gender: string; location: string; married: boolean }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user) throw new Error("User registration failed");

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { ...userData, email, userId: user.uid });

    return { user, message: "User registered successfully" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, message: "Login successful" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { message: "Logout successful" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserData = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User data not found");

    return userSnap.data();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
