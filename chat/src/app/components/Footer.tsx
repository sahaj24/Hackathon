"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-4 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <p className="text-sm">&copy; {new Date().getFullYear()} BondAI. All rights reserved.</p>
        <nav className="flex space-x-4 mt-2 md:mt-0">
          <a href="/about" className="hover:underline">About</a>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
