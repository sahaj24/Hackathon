"use client";
import { useState } from "react";

export default function ChatUI() {
  const [messages, setMessages] = useState<{ text: string; type: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, type: "user" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, { text: data.reply, type: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0F8FF]">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-blue-500 text-white text-center py-4 font-bold text-lg">
          Relationship Coach AI
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`p-3 rounded-lg w-fit max-w-[75%] ${msg.type === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-3 border-t flex items-center gap-2 bg-gray-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
