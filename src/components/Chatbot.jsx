import React, { useState } from "react";
import {
  IconButton,
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Avatar
} from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

export default function Chatbot() {
  const [open, setOpen] = useState(false); // open by default like screenshot
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi there! Welcome to HotelIQ Boston. How can I help you today?" }
  ]);

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text }]);
    setText("");
    // fake bot reply
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: "bot", text: "Thanks — I can help with availability, pricing, and amenities." }]);
    }, 800);
  };

  return (
    <>
      {/* Floating open/close button (lower-right small circular) */}
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            bgcolor: "primary.main",
            color: "white",
            width: 64,
            height: 64,
            boxShadow: 4,
            "&:hover": { bgcolor: "primary.dark" }
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
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", bgcolor: "primary.main", color: "white", px: 3, py: 2 }}>
            <Avatar sx={{ bgcolor: "white", color: "primary.main", width: 40, height: 40, mr: 1.5, fontWeight: 700 }}>
              IQ
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
              HotelIQ Assistant
            </Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Message area */}
          <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto", bgcolor: "#fafafa" }}>
            {messages.map((m) => (
              <Box key={m.id} sx={{ mb: 2, display: "flex", justifyContent: m.from === "bot" ? "flex-start" : "flex-end" }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    maxWidth: "75%",
                    bgcolor: m.from === "bot" ? "white" : "primary.main",
                    color: m.from === "bot" ? "text.primary" : "white"
                  }}
                >
                  <Typography variant="body1">{m.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, bgcolor: "white", borderTop: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              size="medium"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={send} color="primary">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
}