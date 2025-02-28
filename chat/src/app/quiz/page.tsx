"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Button, CircularProgress, Container, FormControl, FormHelperText, Slider, Typography, Switch, AppBar, Toolbar } from '@mui/material';

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

// Function to calculate attachment style based on the responses
const calculateAttachmentStyle = (responses: number[]): string => {
  const sum = responses.reduce((acc, val) => acc + val, 0);
  if (sum <= 30) return "Avoidant";
  if (sum <= 60) return "Anxious";
  if (sum <= 90) return "Secure";
  return "Fearful-Avoidant";
};

export default function Quiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(3)); // Default value of 3
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(auth.currentUser);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Track auth state to avoid 'null' issues
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (answers.some(answer => answer === null)) {
      setError("Please answer all the questions.");
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        throw new Error("User not found. Please log in.");
      }

      const attachmentStyle = calculateAttachmentStyle(answers);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { attachmentStyle });

      router.push(`/chatbot?style=${attachmentStyle}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: darkMode ? '#121212' : '#f0f4f8', padding: '24px' }}>
      <AppBar position="fixed" sx={{ top: 0, backgroundColor: darkMode ? '#222' : '#6200ea' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Quiz App
          </Typography>
          <Typography variant="body1" sx={{ marginRight: '16px' }}>
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </Typography>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: '32px', borderRadius: '16px', backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', boxShadow: 3, width: '100%', marginTop: '80px' }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', marginBottom: '24px', color: darkMode ? '#ffffff' : '#000000', fontSize: '2rem' }}>
          Attachment Style Quiz
        </Typography>
        {error && <FormHelperText error sx={{ textAlign: 'center', marginBottom: '16px' }}>{error}</FormHelperText>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <Box key={index} sx={{ marginBottom: '24px' }}>
              <Typography variant="body1" sx={{ marginBottom: '8px', fontWeight: 'medium', color: darkMode ? '#ffffff' : '#000000', fontSize: '1.25rem' }}>
                {index + 1}. {question}
              </Typography>
              <FormControl fullWidth>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>Strongly Disagree</Typography>
                  <Slider
                    value={answers[index]}
                    onChange={(e, value) => handleChange(index, value as number)}
                    step={1}
                    marks
                    min={1}
                    max={5}
                    valueLabelDisplay="auto"
                    sx={{
                      color: darkMode ? '#ffffff' : '#6200ea',
                      marginX: 2,
                      '& .MuiSlider-mark': {
                        height: 8, // Adjust the height of the marks
                        width: 8,  // Adjust the width of the marks
                        borderRadius: '50%', // Make the marks circular
                        backgroundColor: 'currentColor'
                      }
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>Strongly Agree</Typography>
                </Box>
              </FormControl>
            </Box>
          ))}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', backgroundColor: darkMode ? '#6200ea' : '#6200ea', color: '#ffffff', '&:hover': { backgroundColor: darkMode ? '#3700b3' : '#3700b3' } }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : "Submit & See Results"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}