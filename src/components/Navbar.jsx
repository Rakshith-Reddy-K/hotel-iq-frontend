import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Place as MapPinIcon } from "@mui/icons-material";

export default function Navbar() {
  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>

        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#2563eb',  // Light blue instead of white
              borderRadius: 1.5,
            }}
          >
            <MapPinIcon sx={{ color: 'white' }} />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            HotelIQ
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}