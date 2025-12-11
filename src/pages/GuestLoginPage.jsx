import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Place as MapPinIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:8000';

const GuestLoginPage = () => {
  const navigate = useNavigate();
  const [bookingReference, setBookingReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!bookingReference.trim()) {
      setError('Please enter your booking reference number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/guest/booking-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingReference: bookingReference.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Invalid booking reference');
      }

      const data = await response.json();
      
      // Store guest data in sessionStorage
      sessionStorage.setItem('guestData', JSON.stringify({
        bookingId: data.bookingId,
        hotelId: data.hotelId,
        roomNumber: data.roomNumber,
        guestName: data.guestName,
        hotelName: data.hotelName,
        status: data.status,
        bookingReference: bookingReference.trim()
      }));

      // Navigate to guest portal
      navigate('/guest-portal');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 450,
          width: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* Logo/Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: '#2563eb',
              borderRadius: 2,
              mx: 'auto',
              mb: 2,
            }}
          >
            <MapPinIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
            HotelIQ
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
            Guest Concierge Portal
          </Typography>
        </Box>

        {/* Login Form */}
        <Box component="form" onSubmit={handleLogin}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
            Please enter your booking reference number to access the concierge service.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Booking Reference Number"
            variant="outlined"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
            placeholder="e.g., BK123456"
            disabled={loading}
            sx={{ mb: 3 }}
            autoFocus
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
            sx={{
              bgcolor: '#2563eb',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#1d4ed8',
              },
            }}
          >
            {loading ? 'Accessing...' : 'Access Concierge'}
          </Button>

          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Don't have your booking reference?{' '}
              <Typography
                component="span"
                variant="caption"
                sx={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
              >
                Contact front desk
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default GuestLoginPage;