"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-900 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">BondAI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/quiz" className="hover:underline">Quiz</Link>
          <Link href="/chatbot" className="hover:underline">Chatbot</Link>
          <Link href="/about" className="hover:underline">About</Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 text-center py-4 space-y-2">
          <Link href="/" className="block hover:underline">Home</Link>
          <Link href="/quiz" className="block hover:underline">Quiz</Link>
          <Link href="/chatbot" className="block hover:underline">Chatbot</Link>
          <Link href="/about" className="block hover:underline">About</Link>
        </div>
      )}
    </nav>
  );
}
