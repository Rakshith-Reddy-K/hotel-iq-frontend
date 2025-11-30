import React from "react";
import { Box, Container, Typography, Grid, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a1a",
        color: "white",
        mt: 8,
        pt: 6,
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              HotelIQ
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)" mb={2}>
              Your trusted partner for finding the perfect hotel stays in Boston and beyond.
            </Typography>
            <Box>
              <IconButton sx={{ color: "white", mr: 1 }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: "white", mr: 1 }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ color: "white", mr: 1 }}>
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/" color="rgba(255,255,255,0.7)" underline="hover">
                Home
              </Link>
              <Link href="#" color="rgba(255,255,255,0.7)" underline="hover">
                About Us
              </Link>
              <Link href="#" color="rgba(255,255,255,0.7)" underline="hover">
                Destinations
              </Link>
              <Link href="#" color="rgba(255,255,255,0.7)" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Support
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="#" color="rgba(255,255,255,0.7)" underline="hover">
                Help Center
              </Link>
              <Link href="#" color="rgba(255,255,255,0.7)" underline="hover">
                Privacy Policy
              </Link>
              <Link href="#" color="rgba(255,255,255,0.7)" underline="hover">
                Terms of Service
              </Link>
              <Link href="#" color="rgba(255,255,255,0.7)" underline="hover">
                FAQs
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Contact
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Boston, MA
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                support@hoteliq.com
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                +1 (617) 555-0123
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            mt: 4,
            pt: 3,
            textAlign: "center"
          }}
        >
          <Typography variant="body2" color="rgba(255,255,255,0.5)">
            © {new Date().getFullYear()} HotelIQ. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}