import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function Navbar() {
  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton edge="start" color="inherit" sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          HotelIQ
        </Typography>

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
