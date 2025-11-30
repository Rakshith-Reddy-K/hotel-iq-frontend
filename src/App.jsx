import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
          </Routes>
        </Container>
        <Footer />
        <Chatbot />
      </Router>
    </ThemeProvider>
  );
}