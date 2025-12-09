import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress, Alert } from "@mui/material";
import HotelCard from "../components/HotelCard";
import { useNavigate } from "react-router-dom";
import { hotelAPI } from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelAPI.getAllHotels();
      setHotels(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to load hotels. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Typography variant="h4" fontWeight={800} mb={2}>
        Stays in Boston
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {hotels.map((hotel) => (
          <HotelCard 
            key={hotel.id}
            hotel={hotel} 
            onClick={() => navigate(`/hotel/${hotel.id}`)} 
          />
        ))}
      </Box>
    </>
  );
}