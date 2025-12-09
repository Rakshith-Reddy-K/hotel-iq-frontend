import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Button,
  Box,
} from "@mui/material";
import { Person, Logout } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

/**
 * UserMenu - Add this to your Navbar
 * Shows "Sign In" button when logged out, user avatar + menu when logged in
 */
const UserMenu = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  if (loading) return null;

  // Not logged in - show Sign In button
  if (!isAuthenticated) {
    return (
      <Button
        variant="contained"
        onClick={() => navigate("/login")}
        sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
      >
        Sign In
      </Button>
    );
  }

  // Logged in - show avatar with dropdown
  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`
      : user?.username?.[0]?.toUpperCase() || "U";

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate("/");
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            fontWeight: 600,
          }}
        >
          {initials}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { minWidth: 200, mt: 1, borderRadius: 2 } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={600}>
            {user?.first_name
              ? `${user.first_name} ${user.last_name || ""}`
              : user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate("/profile");
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
