"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const questions = [
  "I often worry that a partner will not want to stay with me.",
  "I am nervous when anyone gets too close to me.",
  "I find it relatively easy to get close to people.",
  "I often find that others are reluctant to get as close as I would like.",
  "It is very important to me to feel independent.",
  "I often worry that partners do not really love me.",
  "Partners often want to be closer or more intimate than I feel comfortable being.",
  "I am comfortable depending on others.",
  "I often want to get closer to others than they want to get to me.",
  "I prefer not to depend on others.",
  "I worry that partners don’t value me as much as I value them.",
  "I am uncomfortable when others want to be too emotionally close to me.",
  "I am comfortable developing close relationships with others.",
  "I am not sure that I can always depend on others to be there when I need them.",
  "It is very important to me to feel self-sufficient.",
  "I worry about others not accepting me.",
  "I often worry about someone getting too close to me.",
  "I know that people will be there when I need them.",
  "Sometimes people do not want to get close to me because I want so much to be close to them.",
  "I do not want to feel like I need anyone or anything."
];

const subscaleMapping: { [key: string]: number[] } = {
  "Anxious-Preoccupied": [0, 5, 10, 15],
  "Fearful-Avoidant": [1, 6, 11, 16],
  "Secure": [2, 7, 12, 17],
  "Merging": [3, 8, 13, 18],
  "Dismissive-Ambivalent": [4, 9, 14, 19]
};

export default function Quiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(questions.length).fill(2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateAttachmentStyle = (responses: number[]) => {
    let scores: { [key: string]: number } = {};
    Object.keys(subscaleMapping).forEach((style) => {
      scores[style] = subscaleMapping[style].reduce((sum, index) => sum + responses[index], 0);
    });

    let highestStyle = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
    return highestStyle;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (answers.includes(null)) {
      setError("Please answer all the questions before submitting.");
      return;
    }
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not found");
      const attachmentStyle = calculateAttachmentStyle(answers);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { attachmentStyle });
      router.push("/chatbot");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Attachment Style Quiz</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="font-semibold mb-2">{index + 1}. {question}</p>
              <div className="flex justify-between">
                <label>Not At All</label>
                <input type="range" min="0" max="4" step="1" value={answers[index]} onChange={(e) => handleChange(index, Number(e.target.value))} className="w-full mx-4" />
                <label>Very Characteristic</label>
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition hover:bg-blue-700">
            {loading ? "Submitting..." : "Submit & See Results"}
          </button>
        </form>
      </div>
    </main>
  );
}