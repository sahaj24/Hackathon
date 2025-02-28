"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userData, setUserData] = useState<{ name: string; email: string; attachmentStyle: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push("/login"); // Redirect to login if not authenticated
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as { name: string; email: string; attachmentStyle: string });
        } else {
          throw new Error("User data not found");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-4">Dashboard</h2>

        {userData ? (
          <div className="text-center">
            <p className="text-gray-700"><strong>Name:</strong> {userData.name}</p>
            <p className="text-gray-700"><strong>Email:</strong> {userData.email}</p>
            <p className="text-gray-700"><strong>Attachment Style:</strong> {userData.attachmentStyle}</p>
          </div>
        ) : (
          <p className="text-gray-600">No user data found.</p>
        )}

        <button
          onClick={() => auth.signOut().then(() => router.push("/login"))}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
