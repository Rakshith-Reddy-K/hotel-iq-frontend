import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import ConciergePage from "./pages/ConciergePage";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";

import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
                    <Home />
                  </Container>
                  <Footer />
                  <Chatbot />
                </>
              }
            />

            <Route
              path="/hotel/:hotelId"
              element={
                <>
                  <Navbar />
                  <Box sx={{ mb: 8 }}>
                    <HotelDetails />
                  </Box>
                  <Footer />
                  <Chatbot />
                </>
              }
            />

            <Route path="/guest-portal" element={<ConciergePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
