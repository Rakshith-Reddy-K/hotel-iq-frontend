import React from "react";
import { Typography, Box } from "@mui/material";
import hotels from "../data/hotels.json";
import HotelCard from "../components/HotelCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

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