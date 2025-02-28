"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { TextField, Button, Select, MenuItem, Typography, Container, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';

const InputField = styled(TextField)({
  marginBottom: '16px',
  width: '100%',
  '& .MuiInputBase-root': {
    borderRadius: '8px',
    background: '#f0f8ff',
  },
});

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    location: "",
    maritalStatus: "Not Married",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.age || !formData.email || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        attachmentStyle: null,
        createdAt: new Date().toISOString(),
      });

      router.push("/quiz");
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f8ff', padding: '24px' }}>
      <Paper elevation={4} sx={{ padding: '32px', borderRadius: '16px', textAlign: 'center', width: '100%', backgroundColor: '#ffffff' }}>
        <Box sx={{ marginBottom: '24px' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Create Your Account
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Discover your attachment style & build better relationships.
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ marginBottom: '16px' }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <InputField
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            label="Full Name"
            variant="outlined"
          />
          <InputField
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            placeholder="Age"
            label="Age"
            variant="outlined"
          />
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: '16px' }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <InputField
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Location"
            label="Location"
            variant="outlined"
          />
          <Select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: '16px' }}
          >
            <MenuItem value="Not Married">Not Married</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
          </Select>
          <InputField
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            label="Email"
            variant="outlined"
          />
          <InputField
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            label="Password"
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
          >
            {loading ? <CircularProgress size={24} /> : "Register & Start Quiz"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}