import type { NextApiRequest, NextApiResponse } from "next";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, age, gender, location, maritalStatus, email, password } = req.body;

    if (!name || !age || !gender || !location || !maritalStatus || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      age,
      gender,
      location,
      maritalStatus,
      email,
      attachmentStyle: null, // To be updated after quiz completion
      createdAt: new Date(),
    });

    return res.status(201).json({
      uid: user.uid,
      email: user.email,
      message: "User registered successfully",
    });

  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
