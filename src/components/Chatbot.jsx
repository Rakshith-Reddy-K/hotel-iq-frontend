// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  CircularProgress,
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useLocation } from "react-router-dom";

const STORAGE_KEY_PREFIX = "hoteliq_chat_session"; // Will append hotelId
const DEFAULT_HOTEL_ID = "111418";
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8000";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const [currentHotelId, setCurrentHotelId] = useState(DEFAULT_HOTEL_ID);
  const prevHotelIdRef = useRef(currentHotelId);

  // Detect hotel ID from URL
  useEffect(() => {
    const match = location.pathname.match(/\/hotel\/([^/]+)/);
    const newHotelId = match ? match[1] : DEFAULT_HOTEL_ID;
    setCurrentHotelId(newHotelId);
  }, [location.pathname]);

  // When hotel changes, load that hotel's conversation
  useEffect(() => {
    if (prevHotelIdRef.current !== currentHotelId) {
      console.log(
        `Hotel changed from ${prevHotelIdRef.current} to ${currentHotelId}`
      );
      prevHotelIdRef.current = currentHotelId;

      // Load the conversation for the new hotel
      loadSession();
    }
  }, [currentHotelId]);

  const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Get storage key specific to this hotel
  const getStorageKey = (hotelId) => {
    return `${STORAGE_KEY_PREFIX}_${hotelId}`;
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial load
  useEffect(() => {
    loadSession();
  }, []);

  // Auto-sync to GCS every 30 seconds (debounced)
  useEffect(() => {
    if (threadId && userId && messages.length > 0 && currentHotelId) {
      const timer = setTimeout(() => {
        syncToCloud();
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [messages, threadId, userId, currentHotelId]);

  const loadSession = async () => {
    try {
      const storageKey = getStorageKey(currentHotelId);
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const localData = JSON.parse(saved);

        // Verify the hotelId matches (safety check)
        if (localData.hotelId === currentHotelId) {
          console.log(`Loading session for hotel ${currentHotelId}`);
          setThreadId(localData.threadId);
          setUserId(localData.userId);
          setMessages(localData.messages || [getWelcomeMessage()]);

          // Try to load from cloud in background
          await loadFromCloud(localData.threadId, localData.userId);
        } else {
          // HotelId mismatch, initialize new session
          initializeNewSession();
        }
      } else {
        // No saved session for this hotel
        console.log(
          `No saved session for hotel ${currentHotelId}, initializing new`
        );
        initializeNewSession();
      }
    } catch (error) {
      console.error("Error loading session:", error);
      initializeNewSession();
    }
  };

  const loadFromCloud = async (threadId, userId) => {
    try {
      setSyncing(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/chat/conversation/${threadId}`,
        {
          params: { userId, hotelId: currentHotelId },
        }
      );

      if (response.data && response.data.messages) {
        console.log(
          `Loaded conversation from cloud for hotel ${currentHotelId}`
        );
        setMessages(response.data.messages);
        saveToLocalStorage(threadId, userId, response.data.messages);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error loading from cloud:", error);
      }
    } finally {
      setSyncing(false);
    }
  };

  const syncToCloud = async () => {
    if (!threadId || !userId || messages.length === 0) return;

    try {
      setSyncing(true);
      await axios.post(`${API_BASE_URL}/api/v1/chat/save`, {
        threadId,
        userId,
        hotelId: currentHotelId,
        messages,
      });
      console.log(`Synced to cloud for hotel ${currentHotelId}`);
    } catch (error) {
      console.error("Error syncing to cloud:", error);
    } finally {
      setSyncing(false);
    }
  };

  const saveToLocalStorage = (threadId, userId, messages) => {
    try {
      const storageKey = getStorageKey(currentHotelId);
      console.log(`Saving to localStorage for hotel ${currentHotelId}`);

      const sessionData = {
        threadId,
        userId,
        hotelId: currentHotelId,
        messages,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(storageKey, JSON.stringify(sessionData));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const initializeNewSession = () => {
    const newThreadId = `thread_${currentHotelId}_${generateId()}`;
    const newUserId = getUserId(); // Get or create persistent user ID

    console.log(`New session initialized for hotel ${currentHotelId}:`, {
      newThreadId,
      newUserId,
    });

    setThreadId(newThreadId);
    setUserId(newUserId);

    const welcomeMsg = getWelcomeMessage();
    setMessages([welcomeMsg]);

    saveToLocalStorage(newThreadId, newUserId, [welcomeMsg]);
  };

  // Get or create a persistent user ID (same across all hotels)
  const getUserId = () => {
    const USER_ID_KEY = "hoteliq_user_id";
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
      userId = `user_${generateId()}`;
      localStorage.setItem(USER_ID_KEY, userId);
      console.log("Created new user ID:", userId);
    }

    return userId;
  };

  const getWelcomeMessage = () => ({
    id: Date.now(),
    from: "bot",
    text: `Hi there! Welcome to HotelIQ. I'm here to help you with information about this hotel. How can I assist you today?`,
    timestamp: new Date().toISOString(),
  });

  const resetChat = async () => {
    if (
      window.confirm(
        `Are you sure you want to start a new conversation for this hotel?`
      )
    ) {
      // Delete from cloud
      try {
        await axios.delete(
          `${API_BASE_URL}/api/v1/chat/conversation/${threadId}`,
          {
            data: { userId, hotelId: currentHotelId },
          }
        );
        console.log(
          `Conversation deleted from cloud for hotel ${currentHotelId}`
        );
      } catch (error) {
        console.error("Error deleting from cloud:", error);
      }

      // Clear local storage for this hotel
      const storageKey = getStorageKey(currentHotelId);
      localStorage.removeItem(storageKey);

      initializeNewSession();
    }
  };

  const send = async () => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      from: "user",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const userText = text.trim();
    setText("");
    setLoading(true);

    // Save to localStorage immediately
    saveToLocalStorage(threadId, userId, updatedMessages);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/chat/message`,
        {
          message: userText,
          user_id: userId,
          hotel_id: currentHotelId,
          thread_id: threadId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        from: "bot",
        text:
          response.data.response ||
          response.data.message ||
          "I'm here to help!",
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Save to localStorage
      saveToLocalStorage(threadId, userId, finalMessages);

      // Sync to cloud (non-blocking)
      syncToCloud();
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        from: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again.",
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveToLocalStorage(threadId, userId, finalMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            bgcolor: "#2563eb",  // Changed to light blue
            color: "white",
            width: 64,
            height: 64,
            boxShadow: 4,
            "&:hover": { bgcolor: "#1d4ed8" },  // Darker blue on hover
            zIndex: 1000,
          }}
        >
          <ChatBubbleIcon sx={{ fontSize: 28 }} />
        </IconButton>
      )}

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            width: 420,
            height: 600,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#2563eb",  // Changed to light blue
              color: "white",
              px: 3,
              py: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "white",
                color: "#2563eb",  // Changed to light blue
                width: 40,
                height: 40,
                mr: 1.5,
                fontWeight: 700,
              }}
            >
              IQ
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                HotelIQ Assistant
              </Typography>
              {syncing && (
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontSize: 10, opacity: 0.9 }}
                >
                  Syncing...
                </Typography>
              )}
              <Typography
                variant="caption"
                sx={{ display: "block", fontSize: 9, opacity: 0.7 }}
              >
                Hotel: {currentHotelId}
              </Typography>
            </Box>
            <IconButton
              onClick={resetChat}
              sx={{ color: "white", mr: 1 }}
              title="Start new conversation"
            >
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              p: 3,
              flexGrow: 1,
              overflowY: "auto",
              bgcolor: "#fafafa",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: m.from === "bot" ? "flex-start" : "flex-end",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: "75%",
                    bgcolor: m.from === "bot" ? "white" : "#2563eb",  // Changed to light blue
                    color: m.from === "bot" ? "text.primary" : "white",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {m.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      opacity: 0.7,
                      fontSize: "0.7rem",
                    }}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Paper>
              </Box>
            ))}

            {loading && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
              >
                <Paper sx={{ p: 2, bgcolor: "white", boxShadow: 1 }}>
                  <CircularProgress size={20} sx={{ color: "#2563eb" }} />
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #e0e0e0" }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              size="medium"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !loading) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={loading}
              multiline
              maxRows={3}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={send}
                      sx={{ 
                        color: "#2563eb",  // Changed to light blue
                        "&:hover": { bgcolor: "rgba(37, 99, 235, 0.1)" }
                      }}
                      disabled={loading || !text.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
}