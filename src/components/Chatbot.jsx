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
  Button,
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY_PREFIX = "hoteliq_chat_session";
const DEFAULT_HOTEL_ID = "111418";
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8000";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentHotelId, setCurrentHotelId] = useState(DEFAULT_HOTEL_ID);
  const prevHotelIdRef = useRef(currentHotelId);

  // Get authenticated user
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || null;

  // Detect hotel ID from URL
  useEffect(() => {
    const match = location.pathname.match(/\/hotel\/([^/]+)/);
    const newHotelId = match ? match[1] : DEFAULT_HOTEL_ID;
    setCurrentHotelId(newHotelId);
  }, [location.pathname]);

  // When hotel changes or user logs in, load that hotel's conversation
  useEffect(() => {
    if (isAuthenticated && userId) {
      if (prevHotelIdRef.current !== currentHotelId) {
        console.log(
          `Hotel changed from ${prevHotelIdRef.current} to ${currentHotelId}`
        );
        prevHotelIdRef.current = currentHotelId;
      }
      loadSession();
    }
  }, [currentHotelId, isAuthenticated, userId]);

  const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Get storage key specific to this hotel AND user
  const getStorageKey = (hotelId) => {
    return `${STORAGE_KEY_PREFIX}_${userId}_${hotelId}`;
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-sync to GCS every 30 seconds
  useEffect(() => {
    if (
      threadId &&
      userId &&
      messages.length > 0 &&
      currentHotelId &&
      isAuthenticated
    ) {
      const timer = setTimeout(() => {
        syncToCloud();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [messages, threadId, userId, currentHotelId, isAuthenticated]);

  const loadSession = async () => {
    if (!isAuthenticated || !userId) return;

    try {
      const storageKey = getStorageKey(currentHotelId);
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const localData = JSON.parse(saved);

        if (
          localData.hotelId === currentHotelId &&
          localData.userId === userId
        ) {
          console.log(
            `Loading session for user ${userId}, hotel ${currentHotelId}`
          );
          setThreadId(localData.threadId);
          setMessages(localData.messages || [getWelcomeMessage()]);

          await loadFromCloud(localData.threadId);
        } else {
          // Local data doesn't match - check cloud first
          await findOrCreateSession();
        }
      } else {
        console.log(
          `No local session for user ${userId}, hotel ${currentHotelId}. Checking cloud...`
        );
        // No local data - check cloud for existing conversation
        await findOrCreateSession();
      }
    } catch (error) {
      console.error("Error loading session:", error);
      initializeNewSession();
    }
  };

  const findOrCreateSession = async () => {
    try {
      setSyncing(true);
      // Check cloud for existing conversations for this user + hotel
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/chat/conversations/list`,
        {
          params: { userId, hotelId: currentHotelId, limit: 1 },
        }
      );

      if (
        response.data &&
        response.data.conversations &&
        response.data.conversations.length > 0
      ) {
        // Found existing conversation - load it
        const existingThreadId = response.data.conversations[0].threadId;
        console.log(
          `Found existing conversation in cloud: ${existingThreadId}`
        );
        setThreadId(existingThreadId);
        await loadFromCloud(existingThreadId);
      } else {
        // No existing conversation - create new one
        console.log(
          `No existing conversation found in cloud. Creating new session.`
        );
        initializeNewSession();
      }
    } catch (error) {
      console.error("Error finding session from cloud:", error);
      initializeNewSession();
    } finally {
      setSyncing(false);
    }
  };

  const loadFromCloud = async (threadId) => {
    if (!isAuthenticated || !userId) return;

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
          `Loaded conversation from cloud for user ${userId}, hotel ${currentHotelId}`
        );
        setMessages(response.data.messages);
        saveToLocalStorage(threadId, response.data.messages);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error loading from cloud:", error);
      }
    } finally {
      setSyncing(false);
    }
  };

  const syncToCloud = async (messagesToSync = null) => {
    const msgs = messagesToSync || messages;
    if (!threadId || !userId || msgs.length === 0 || !isAuthenticated) return;

    try {
      setSyncing(true);
      await axios.post(`${API_BASE_URL}/api/v1/chat/save`, {
        threadId,
        userId,
        hotelId: currentHotelId,
        messages: msgs,
      });
      console.log(
        `Synced to cloud for user ${userId}, hotel ${currentHotelId}`
      );
    } catch (error) {
      console.error("Error syncing to cloud:", error);
    } finally {
      setSyncing(false);
    }
  };

  const saveToLocalStorage = (threadId, messages) => {
    if (!userId) return;

    try {
      const storageKey = getStorageKey(currentHotelId);
      console.log(
        `Saving to localStorage for user ${userId}, hotel ${currentHotelId}`
      );

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
    if (!userId) return;

    const newThreadId = `thread_${userId}_${currentHotelId}_${generateId()}`;

    console.log(
      `New session initialized for user ${userId}, hotel ${currentHotelId}:`,
      {
        newThreadId,
      }
    );

    setThreadId(newThreadId);

    const welcomeMsg = getWelcomeMessage();
    setMessages([welcomeMsg]);

    saveToLocalStorage(newThreadId, [welcomeMsg]);
  };

  const getWelcomeMessage = () => ({
    id: Date.now(),
    from: "bot",
    text: `Hi ${
      user?.first_name || "there"
    }! Welcome to HotelIQ. I'm here to help you with information about this hotel. How can I assist you today?`,
    timestamp: new Date().toISOString(),
  });

  const resetChat = async () => {
    if (!isAuthenticated || !userId) return;

    if (
      window.confirm(
        `Are you sure you want to start a new conversation for this hotel?`
      )
    ) {
      try {
        await axios.delete(
          `${API_BASE_URL}/api/v1/chat/conversation/${threadId}`,
          {
            data: { userId, hotelId: currentHotelId },
          }
        );
        console.log(
          `Conversation deleted from cloud for user ${userId}, hotel ${currentHotelId}`
        );
      } catch (error) {
        console.error("Error deleting from cloud:", error);
      }

      const storageKey = getStorageKey(currentHotelId);
      localStorage.removeItem(storageKey);

      initializeNewSession();
    }
  };

  // Modified send to accept direct content (for "Book Now" clicks)
  const send = async (manualContent = null) => {
    const contentToSend = (
      typeof manualContent === "string" ? manualContent : text
    ).trim();

    if (!contentToSend || !isAuthenticated || !userId) return;

    const userMessage = {
      id: Date.now(),
      from: "user",
      text: contentToSend,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Only clear the text input if we sent what was in the input
    if (!manualContent) {
      setText("");
    }
    setLoading(true);

    saveToLocalStorage(threadId, updatedMessages);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/chat/message`,
        {
          message: contentToSend,
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

      saveToLocalStorage(threadId, finalMessages);
      await syncToCloud(finalMessages);
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
      saveToLocalStorage(threadId, finalMessages);
    } finally {
      setLoading(false);
    }
  };

  // Listen for "Book Now" triggers from other components
  useEffect(() => {
    const handleTrigger = (event) => {
      const { message, autoSend } = event.detail;

      setOpen(true);

      if (message) {
        if (autoSend) {
          send(message);
        } else {
          setText(message);
        }
      }
    };

    window.addEventListener("openChatbot", handleTrigger);

    return () => {
      window.removeEventListener("openChatbot", handleTrigger);
    };
  }, [messages, threadId, userId, currentHotelId, isAuthenticated, text]);

  const handleLoginClick = () => {
    setOpen(false);
    navigate("/login");
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
            bgcolor: "#2563eb",
            color: "white",
            width: 64,
            height: 64,
            boxShadow: 4,
            "&:hover": { bgcolor: "#1d4ed8" },
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
              bgcolor: "#2563eb",
              color: "white",
              px: 3,
              py: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "white",
                color: "#2563eb",
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
              {isAuthenticated && (
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontSize: 9, opacity: 0.7 }}
                >
                  Hotel: {currentHotelId}
                </Typography>
              )}
            </Box>
            {isAuthenticated && (
              <IconButton
                onClick={resetChat}
                sx={{ color: "white", mr: 1 }}
                title="Start new conversation"
              >
                <RefreshIcon />
              </IconButton>
            )}
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Show login prompt if not authenticated */}
          {!isAuthenticated ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                bgcolor: "#fafafa",
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#e0e0e0",
                  mb: 3,
                }}
              >
                <LockIcon sx={{ fontSize: 40, color: "#9e9e9e" }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Sign in to Chat
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please sign in to access the HotelIQ Assistant and get
                personalized help with your hotel queries.
              </Typography>
              <Button
                variant="contained"
                onClick={handleLoginClick}
                sx={{
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1d4ed8" },
                  px: 4,
                  py: 1,
                }}
              >
                Sign In
              </Button>
            </Box>
          ) : (
            <>
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
                      justifyContent:
                        m.from === "bot" ? "flex-start" : "flex-end",
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: "75%",
                        bgcolor: m.from === "bot" ? "white" : "#2563eb",
                        color: m.from === "bot" ? "text.primary" : "white",
                        boxShadow: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
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
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Paper sx={{ p: 2, bgcolor: "white", boxShadow: 1 }}>
                      <CircularProgress size={20} sx={{ color: "#2563eb" }} />
                    </Paper>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Box>

              <Box
                sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #e0e0e0" }}
              >
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
                          onClick={() => send()}
                          sx={{
                            color: "#2563eb",
                            "&:hover": { bgcolor: "rgba(37, 99, 235, 0.1)" },
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
            </>
          )}
        </Paper>
      )}
    </>
  );
}
