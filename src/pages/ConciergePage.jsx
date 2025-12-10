import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConciergeChat from '../components/ConciergeChat';
import { Box, CircularProgress, Typography } from '@mui/material';

const ConciergePage = () => {
  const navigate = useNavigate();
  const [guestData, setGuestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user logged in via booking reference
    const storedGuestData = sessionStorage.getItem('guestData');
    
    if (!storedGuestData) {
      // No login data, redirect to guest login page
      navigate('/guest-login');
      return;
    }

    try {
      const parsedData = JSON.parse(storedGuestData);
      setGuestData(parsedData);
    } catch (error) {
      console.error('Error parsing guest data:', error);
      // If data is corrupted, clear it and redirect
      sessionStorage.removeItem('guestData');
      navigate('/guest-login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading concierge...
        </Typography>
      </Box>
    );
  }

  // If no guest data after loading, don't render (will redirect)
  if (!guestData) {
    return null;
  }

  return (
    <ConciergeChat 
      initialHotelId={guestData.hotelId}
      initialRoomNumber={guestData.roomNumber}
      initialGuestName={guestData.guestName}
      initialBookingId={guestData.bookingId}
    />
  );
};

export default ConciergePage;