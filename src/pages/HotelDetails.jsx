import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelAPI } from "../services/api";
import {
  Box,
  Container,
  IconButton,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import WifiIcon from "@mui/icons-material/Wifi";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import PoolIcon from "@mui/icons-material/Pool";
import SpaIcon from "@mui/icons-material/Spa";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import KitchenIcon from "@mui/icons-material/Kitchen";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import SmokeFreeIcon from "@mui/icons-material/SmokeFree";
import AccessibleIcon from "@mui/icons-material/Accessible";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const getAmenityIcon = (amenity) => {
  const lower = amenity.toLowerCase();
  
  // Internet/Wifi
  if (lower.includes("wifi") || lower.includes("internet") || lower.includes("wireless")) {
    return <WifiIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Parking
  if (lower.includes("parking") || lower.includes("valet")) {
    return <LocalParkingIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Fitness/Gym
  if (lower.includes("gym") || lower.includes("fitness") || lower.includes("workout") || lower.includes("exercise")) {
    return <FitnessCenterIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Restaurant/Dining
  if (lower.includes("restaurant") || lower.includes("dining")) {
    return <RestaurantIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Room Service
  if (lower.includes("room service")) {
    return <RoomServiceIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Pool
  if (lower.includes("pool") || lower.includes("swimming")) {
    return <PoolIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Spa
  if (lower.includes("spa") || lower.includes("massage") || lower.includes("sauna")) {
    return <SpaIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Air Conditioning
  if (lower.includes("air conditioning") || lower.includes("ac") || lower.includes("climate control")) {
    return <AcUnitIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Kitchen/Refrigerator
  if (lower.includes("refrigerator") || lower.includes("fridge") || lower.includes("kitchen") || lower.includes("kitchenette") || lower.includes("microwave")) {
    return <KitchenIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Business Center
  if (lower.includes("business") || lower.includes("meeting") || lower.includes("conference")) {
    return <BusinessCenterIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Laundry
  if (lower.includes("laundry") || lower.includes("washer") || lower.includes("dryer")) {
    return <LocalLaundryServiceIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Bar/Lounge
  if (lower.includes("bar") || lower.includes("lounge") || lower.includes("cocktail")) {
    return <LocalBarIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Breakfast
  if (lower.includes("breakfast") || lower.includes("coffee") || lower.includes("tea")) {
    return <FreeBreakfastIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Concierge/Front Desk
  if (lower.includes("concierge") || lower.includes("front desk") || lower.includes("24/7") || lower.includes("reception")) {
    return <MeetingRoomIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Pet Friendly
  if (lower.includes("pet") || lower.includes("dog") || lower.includes("cat")) {
    return <PetsIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Non-Smoking
  if (lower.includes("smoke free") || lower.includes("non-smoking") || lower.includes("no smoking")) {
    return <SmokeFreeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Accessible
  if (lower.includes("accessible") || lower.includes("wheelchair") || lower.includes("disability")) {
    return <AccessibleIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Beach/Waterfront
  if (lower.includes("beach") || lower.includes("waterfront") || lower.includes("ocean")) {
    return <BeachAccessIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Cafe
  if (lower.includes("cafe") || lower.includes("starbucks")) {
    return <LocalCafeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />;
  }
  
  // Default - generic checkmark for any other amenity
  return <CheckCircleIcon sx={{ fontSize: 20, color: 'primary.main' }} />;
};

export default function HotelDetails() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotel();
  }, [hotelId]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await hotelAPI.getHotelById(hotelId);
      setHotel(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching hotel:", err);
      setError("Hotel not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !hotel) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Hotel not found"}</Alert>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Image with Overlay - Full Width */}
      <Box
        sx={{
          position: "relative",
          height: 400,
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={hotel.image}
          alt={hotel.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            left: 24,
            top: 24,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "white",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Container maxWidth="lg">
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 32,
              width: "100%",
              maxWidth: "lg",
              px: 3,
              color: "white",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={1.5}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  flex: 1,
                }}
              >
                {hotel.name}
              </Typography>

              <Box sx={{ textAlign: "right", ml: 3 }}>
                {hotel.price > 0 ? (
                  <>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      ${hotel.price}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                      }}
                    >
                      per night
                    </Typography>
                  </>
                ) : (
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                      fontStyle: 'italic',
                    }}
                  >
                    Price at checkout
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnIcon sx={{ fontSize: 20 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 400,
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {hotel.location}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={0.5}>
                <StarIcon sx={{ fontSize: 20, color: "#FFA726" }} />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {hotel.rating.toFixed(1)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  ({hotel.reviews.toLocaleString()} rooms)
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md">
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

        <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 4, mb: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Amenities
          </Typography>

          <Grid container spacing={3}>
            {hotel.amenities.map((amenity, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {getAmenityIcon(amenity)}
                  <Typography variant="body1">{amenity}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ borderTop: "1px solid #e0e0e0", pt: 4, mb: 4 }} />

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

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 700,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Book Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}