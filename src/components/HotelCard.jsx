import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";

export default function HotelCard({ hotel, onClick }) {
  return (
    <Card 
      sx={{ 
        borderRadius: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
        }
      }}
    >
      <CardActionArea 
        onClick={onClick} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch' 
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia 
            component="img" 
            height="220" 
            image={hotel.image} 
            alt={hotel.name}
            sx={{ 
              objectFit: 'cover',
              borderRadius: '12px 12px 0 0'
            }}
          />
          <Chip
            icon={<StarIcon sx={{ fontSize: 14, color: '#FFA726' }} />}
            label={hotel.rating.toFixed(1)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "white",
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              fontWeight: 700,
              fontSize: '0.875rem',
              height: 32,
              '& .MuiChip-icon': {
                color: '#FFA726'  // Keep yellow/orange
              }
            }}
          />
        </Box>
        
        <CardContent 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: 2.5,
            '&:last-child': {
              pb: 2.5
            }
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight={700} 
            sx={{ 
              mb: 1.5,
              fontSize: '1.125rem',
              lineHeight: 1.3
            }}
          >
            {hotel.name}
          </Typography>

          <Box display="flex" alignItems="flex-start" gap={0.75} mb={1.5}>
            <LocationOnOutlined 
              sx={{ 
                fontSize: 18, 
                color: 'text.secondary',
                mt: 0.25
              }} 
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}
            >
              {hotel.location}
            </Typography>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mb: 'auto',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {hotel.description}
          </Typography>

          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mt={2}
            pt={2}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: '0.8125rem' }}
            >
              {hotel.reviews.toLocaleString()} reviews
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h6" 
                color="secondary"  // Changed from primary to secondary (light blue)
                fontWeight={700}
                component="span"
                sx={{ fontSize: '1.25rem' }}
              >
                ${hotel.price}
              </Typography>
              <Typography 
                component="span" 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.875rem', ml: 0.5 }}
              >
                / night
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}