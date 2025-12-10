import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as MessageCircleIcon,
  AccessTime as ClockIcon,
  Cancel as XCircleIcon,
  Place as MapPinIcon,
  Wifi as WifiIcon,
  DryCleaning as ShirtIcon,
  Restaurant as UtensilsIcon,
  DirectionsCar as CarIcon,
  WaterDrop as DropletIcon,
  Coffee as CoffeeIcon,
  VpnKey as KeyIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

const ConciergeChat = ({ 
  checkInStatus = 'checked-in', 
  guestName = 'Mr. Guest', 
  roomNumber = '304' 
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'concierge',
      text: `Welcome ${guestName}! I am your personal concierge. You can ask me to bring towels, order food, or arrange transportation.`,
      timestamp: 'Now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

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

  const handleQuickAction = (message) => {
    if (!isChatEnabled) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'guest',
      text: message,
      timestamp: 'Now'
    };
    setMessages([...messages, newMessage]);
    
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: 'concierge',
        text: 'I\'ve received your request. I\'ll take care of that right away!',
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!isChatEnabled || !inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'guest',
      text: inputMessage,
      timestamp: 'Now'
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: 'concierge',
        text: 'I\'ve received your request. I\'ll take care of that right away!',
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isChatEnabled) {
      handleSendMessage();
    }
  };

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
                    disabled={!isChatEnabled}
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
                disabled={!isChatEnabled}
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
                disabled={!isChatEnabled}
                sx={{
                  bgcolor: isChatEnabled ? '#2563eb' : '#9ca3af',
                  color: 'white',
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: isChatEnabled ? '#1d4ed8' : '#9ca3af',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#9ca3af',
                    color: 'white',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ConciergeChat;