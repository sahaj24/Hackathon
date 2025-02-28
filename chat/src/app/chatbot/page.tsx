"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';

export default function Chatbot() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message immediately
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");  // Clear input
    setLoading(true);  // Set loading to true

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Check if the API returned an error
      if (!response.ok || data.error) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        { text: data.reply || "Sorry, no reply from the bot.", sender: "bot" }
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong. Please try again.", sender: "bot" }
      ]);
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4f8', padding: '24px' }}>
      <Paper elevation={4} sx={{ padding: '32px', borderRadius: '16px', width: '100%', backgroundColor: '#ffffff' }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', marginBottom: '24px', color: '#000000' }}>
          Relationship Coach
        </Typography>
        <Box sx={{ height: '400px', overflowY: 'auto', padding: '16px', borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '24px' }}>
          {messages.map((msg, index) => (
            <Typography key={index} variant="body1" component="p" sx={{ padding: '8px', marginBottom: '8px', borderRadius: '8px', backgroundColor: msg.sender === "user" ? '#e3f2fd' : '#e0e0e0' }}>
              <strong>{msg.sender === "user" ? "You" : "Coach"}:</strong> {msg.text}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            variant="outlined"
            fullWidth
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold' }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : "Send"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}