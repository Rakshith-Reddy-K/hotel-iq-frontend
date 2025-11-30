import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import hotels from "../data/hotels.json";
import {
  Box,
  Container,
  IconButton,
  Typography,
  Grid,
  Button
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StarIcon from "@mui/icons-material/Star";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SpaIcon from "@mui/icons-material/Spa";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const getAmenityIcon = (amenity) => {
  const lower = amenity.toLowerCase();
  if (lower.includes('wifi')) return <WifiIcon color="primary" />;
  if (lower.includes('parking')) return <DirectionsCarIcon color="primary" />;
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('24/7')) return <FitnessCenterIcon color="primary" />;
  if (lower.includes('spa')) return <SpaIcon color="primary" />;
  if (lower.includes('dining') || lower.includes('restaurant')) return <RestaurantIcon color="primary" />;
  if (lower.includes('bedding') || lower.includes('luxury bedding')) return <BedroomParentIcon color="primary" />;
  if (lower.includes('view')) return <RestaurantIcon color="primary" />;
  return <WifiIcon color="primary" />;
};

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = hotels.find((h) => h.id === Number(id));
  
  if (!hotel) return <Typography>Hotel not found</Typography>;

  return (
    <Box>
      {/* Hero Image with Overlay - Full Width */}
      <Box 
        sx={{ 
          position: "relative", 
          height: 400,
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          mb: 4
        }}
      >
        <Box
          component="img"
          src={hotel.image}
          alt={hotel.name}
          sx={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover"
          }}
        />
        
        {/* Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
          }}
        />

        {/* Back Button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            left: 24,
            top: 24,
            bgcolor: "rgba(0,0,0,0.5)",
            color: 'white',
            '&:hover': {
              bgcolor: "rgba(0,0,0,0.7)"
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Hotel Info Overlay */}
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              position: "absolute", 
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: 32,
              width: '100%',
              maxWidth: 'lg',
              px: 3,
              color: "white"
            }}
          >
            {/* Title and Price Row */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  flex: 1
                }}
              >
                {hotel.name}
              </Typography>
              
              <Box sx={{ textAlign: 'right', ml: 3 }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                  }}
                >
                  ${hotel.price}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)"
                  }}
                >
                  per night
                </Typography>
              </Box>
            </Box>
            
            {/* Location and Rating Row */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnIcon sx={{ fontSize: 20 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 400,
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)"
                  }}
                >
                  {hotel.location}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={0.5}>
                <StarIcon sx={{ fontSize: 20, color: '#FFA726' }} />
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ 
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)"
                  }}
                >
                  {hotel.rating.toFixed(1)}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)"
                  }}
                >
                  ({hotel.reviews.toLocaleString()} rooms)
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content - Single Column Layout */}
      <Container maxWidth="md">
        {/* About Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            About This Hotel
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ lineHeight: 1.8 }}
          >
            {hotel.description}
          </Typography>
        </Box>

        <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 4, mb: 4 }} />

        {/* Amenities Section - 2 Column Grid */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Amenities
          </Typography>
          
          <Grid container spacing={3}>
            {hotel.amenities.map((amenity, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2
                  }}
                >
                  {getAmenityIcon(amenity)}
                  <Typography variant="body1">
                    {amenity}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 4, mb: 4 }} />

        {/* Check-in Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Check-in Information
          </Typography>
          
          <Grid container spacing={4} mb={3}>
            <Grid item xs={12} sm={6}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Check-in
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                3:00 PM
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Check-out
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                12:00 PM
              </Typography>
            </Grid>
          </Grid>

          {/* Book Now Button - Full Width */}
          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            sx={{ 
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Book Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}