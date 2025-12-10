import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as MessageCircleIcon,
  AccessTime as ClockIcon,
  Cancel as XCircleIcon,
  Place as MapPinIcon,
  Wifi as WifiIcon,
  WaterDrop as DropletIcon,
} from '@mui/icons-material';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ConciergeChat = ({ 
  initialHotelId,
  initialRoomNumber,
  initialGuestName = null,
  initialBookingId = null
}) => {
  // Guest information from backend
  const [guestInfo, setGuestInfo] = useState(null);
  const [loadingGuestInfo, setLoadingGuestInfo] = useState(true);
  const [guestInfoError, setGuestInfoError] = useState(null);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Polling for status updates
  const pollingIntervalRef = useRef(null);

  // Derived values
  const checkInStatus = guestInfo?.status || 'pending';
  const guestName = guestInfo?.guestName || initialGuestName || 'Guest';
  const roomNumber = guestInfo?.roomNumber || initialRoomNumber;
  const isChatEnabled = checkInStatus === 'checked-in';

  // Quick action buttons configuration
  const quickActions = [
    { 
      icon: WifiIcon, 
      label: 'WiFi', 
      message: 'What is the WiFi password?',
      borderColor: '#3b82f6',
      hoverBg: '#eff6ff'
    },
    { 
      icon: () => <span style={{ fontSize: 18 }}>🔧</span>, 
      label: 'Repair', 
      message: 'Something is broken in my room',
      borderColor: '#ef4444',
      hoverBg: '#fef2f2'
    },
    { 
      icon: DropletIcon, 
      label: 'Towels', 
      message: 'I need extra towels',
      borderColor: '#14b8a6',
      hoverBg: '#f0fdfa'
    },
    { 
      icon: () => <span style={{ fontSize: 18 }}>🧹</span>, 
      label: 'Clean', 
      message: 'Please clean my room',
      borderColor: '#a855f7',
      hoverBg: '#faf5ff'
    },
    { 
      icon: () => <span style={{ fontSize: 18 }}>🛎️</span>, 
      label: 'Luggage', 
      message: 'I need help with luggage',
      borderColor: '#6366f1',
      hoverBg: '#eef2ff'
    },
    { 
      icon: ClockIcon, 
      label: 'Checkout', 
      message: 'When is checkout time?',
      borderColor: '#6b7280',
      hoverBg: '#f9fafb'
    }
  ];

  // Fetch guest information from backend
  const fetchGuestInfo = async (showLoading = true) => {
    try {
      if (showLoading) setLoadingGuestInfo(true);
      
      const response = await fetch(`${API_BASE_URL}/api/guest/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: initialHotelId,
          roomNumber: initialRoomNumber
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch guest information');
      }

      const data = await response.json();
      
      // Override with initial values if provided (from login)
      if (initialGuestName) data.guestName = initialGuestName;
      if (initialBookingId) data.bookingId = initialBookingId;
      
      // Check if status changed
      const statusChanged = guestInfo && guestInfo.status !== data.status;
      
      setGuestInfo(data);
      
      // Update welcome message if this is first load
      if (!messages.length) {
        setMessages([{
          id: 1,
          sender: 'concierge',
          text: `Welcome ${data.guestName}! I am your personal concierge. You can ask me to bring towels, order food, or arrange transportation.`,
          timestamp: 'Now'
        }]);
      }
      
      // If status changed, show notification message
      if (statusChanged) {
        if (data.status === 'checked-in') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'concierge',
            text: '✅ You have been checked in! You can now use the concierge chat.',
            timestamp: 'Now'
          }]);
        } else if (data.status === 'checked-out') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'concierge',
            text: '👋 You have been checked out. Thank you for staying with us!',
            timestamp: 'Now'
          }]);
        }
      }
      
      setGuestInfoError(null);
    } catch (error) {
      console.error('Failed to fetch guest info:', error);
      if (showLoading) setGuestInfoError(error.message);
    } finally {
      if (showLoading) setLoadingGuestInfo(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchGuestInfo(true);
  }, [initialHotelId, initialRoomNumber]);

  // Set up polling for status updates (every 5 seconds)
  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Start polling
    pollingIntervalRef.current = setInterval(() => {
      fetchGuestInfo(false); // Don't show loading spinner during polling
    }, 5000); // Poll every 5 seconds

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [guestInfo?.status]); // Restart polling when status changes

  const getStatusConfig = () => {
    switch(checkInStatus) {
      case 'pending':
        return {
          text: 'Awaiting Check-In',
          color: 'warning',
          icon: <ClockIcon />,
          message: 'Please check in at the front desk to access concierge services.'
        };
      case 'checked-in':
        return {
          text: 'Checked In',
          color: 'success',
          icon: null,
          message: null
        };
      case 'checked-out':
        return {
          text: 'Checked Out',
          color: 'error',
          icon: <XCircleIcon />,
          message: 'Thank you for staying with us! Concierge services are no longer available.'
        };
      default:
        return {
          text: 'Unknown Status',
          color: 'default',
          icon: null,
          message: null
        };
    }
  };

  const statusConfig = getStatusConfig();

  const sendMessageToBackend = async (messageText) => {
    if (!guestInfo) {
      throw new Error('Guest information not loaded');
    }

    const response = await fetch(`${API_BASE_URL}/api/chat/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: guestInfo.bookingId,
        hotelId: String(guestInfo.hotelId),
        roomNumber: guestInfo.roomNumber,
        guestName: guestInfo.guestName,
        message: messageText
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send message');
    }

    return response.json();
  };

  const handleQuickAction = async (message) => {
    if (!isChatEnabled || isSending || !guestInfo) return;
    
    // Add user message to UI
    const newMessage = {
      id: messages.length + 1,
      sender: 'guest',
      text: message,
      timestamp: 'Now'
    };
    setMessages([...messages, newMessage]);
    setIsSending(true);
    
    try {
      // Call backend
      const response = await sendMessageToBackend(message);
      
      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        sender: 'concierge',
        text: response.response,
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        sender: 'concierge',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!isChatEnabled || !inputMessage.trim() || isSending || !guestInfo) return;

    const messageText = inputMessage.trim();
    const newMessage = {
      id: messages.length + 1,
      sender: 'guest',
      text: messageText,
      timestamp: 'Now'
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsSending(true);
    
    try {
      // Call backend
      const response = await sendMessageToBackend(messageText);
      
      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        sender: 'concierge',
        text: response.response,
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        sender: 'concierge',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isChatEnabled && !isSending) {
      handleSendMessage();
    }
  };

  // Loading state
  if (loadingGuestInfo) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading guest information...</Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (guestInfoError) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Alert severity="error">
          <AlertTitle>Unable to Load Guest Information</AlertTitle>
          {guestInfoError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 320,
          bgcolor: '#1e293b',
          color: 'white',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#2563eb',
              borderRadius: 2,
            }}
          >
            <MapPinIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              HotelIQ
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}
            >
              Guest Portal
            </Typography>
          </Box>
        </Box>

        {/* Welcome Card */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#334155',
            color: 'white',
            p: 3,
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: 1,
              display: 'block',
              mb: 1,
            }}
          >
            Welcome
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {guestName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
            Room {roomNumber}
          </Typography>
          <Chip
            label={statusConfig.text}
            color={statusConfig.color}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Paper>

        <Box sx={{ flexGrow: 1 }} />
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 0,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Concierge Chat
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Direct line to Front Desk • Room {roomNumber}
          </Typography>
        </Paper>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            bgcolor: '#f5f5f5',
          }}
        >
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {!isChatEnabled && statusConfig.message && (
              <Alert
                severity={statusConfig.color}
                icon={statusConfig.icon}
                sx={{ mb: 3 }}
              >
                <AlertTitle>
                  {checkInStatus === 'pending' ? 'Check-In Required' : 'Service Unavailable'}
                </AlertTitle>
                {statusConfig.message}
              </Alert>
            )}

            {isChatEnabled && messages.map((message) => (
              <Box key={message.id} sx={{ mb: 3 }}>
                {message.sender === 'concierge' && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: '#2563eb' }}>
                      <MessageCircleIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Front Desk
                        </Typography>
                        <Chip
                          label="Online & Active"
                          color="success"
                          size="small"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: 'white',
                          borderRadius: 3,
                          borderTopLeftRadius: 1,
                        }}
                      >
                        <Typography variant="body1">{message.text}</Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        {message.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {message.sender === 'guest' && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box sx={{ maxWidth: 600 }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: '#2563eb',
                          color: 'white',
                          borderRadius: 3,
                          borderTopRightRadius: 1,
                        }}
                      >
                        <Typography variant="body1">{message.text}</Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}
                      >
                        {message.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}

            {isSending && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: '#2563eb' }}>
                  <MessageCircleIcon />
                </Avatar>
                <Box>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: 'white',
                      borderRadius: 3,
                      borderTopLeftRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                      <Box sx={{ width: 8, height: 8, bgcolor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                      <Box sx={{ width: 8, height: 8, bgcolor: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
                    </Box>
                  </Paper>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Input Area with Quick Actions */}
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            borderRadius: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {/* Quick Action Buttons */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mb: 2,
              }}
            >
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                const isEmoji = typeof IconComponent === 'function' && IconComponent().type === 'span';
                
                return (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={
                      isEmoji ? (
                        <IconComponent />
                      ) : (
                        <IconComponent sx={{ fontSize: 18, color: action.borderColor }} />
                      )
                    }
                    onClick={() => handleQuickAction(action.message)}
                    disabled={!isChatEnabled || isSending}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      py: 0.75,
                      px: 2,
                      borderWidth: 2,
                      borderColor: action.borderColor,
                      color: '#1f2937',
                      bgcolor: 'white',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: action.borderColor,
                        bgcolor: action.hoverBg,
                      },
                      '&.Mui-disabled': {
                        borderColor: '#e5e7eb',
                        color: '#9ca3af',
                      }
                    }}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </Box>

            {/* Text Input */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={
                  isChatEnabled
                    ? "Type your request (e.g., 'I need more pillows')..."
                    : 'Chat is disabled. Please check in first.'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isChatEnabled || isSending}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: isChatEnabled ? '#f9fafb' : '#e5e7eb',
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!isChatEnabled || isSending || !inputMessage.trim()}
                sx={{
                  bgcolor: (isChatEnabled && !isSending) ? '#2563eb' : '#9ca3af',
                  color: 'white',
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: (isChatEnabled && !isSending) ? '#1d4ed8' : '#9ca3af',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#9ca3af',
                    color: 'white',
                  },
                }}
              >
                {isSending ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ConciergeChat;