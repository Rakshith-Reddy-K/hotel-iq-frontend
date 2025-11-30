# HotelIQ Boston 🏨

A modern hotel booking platform built with React and Material-UI, showcasing hotels in Boston with an AI-powered chatbot assistant.

![HotelIQ Preview](https://via.placeholder.com/800x400?text=HotelIQ+Boston)

## 🌟 Features

- **Hotel Listings**: Browse through curated hotels in Boston with detailed information
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Hotel Details**: View comprehensive hotel information including amenities, pricing, and check-in details
- **AI Chatbot**: Interactive chatbot assistant to help with booking inquiries
- **Modern UI**: Clean, professional design using Material-UI components
- **Smooth Navigation**: React Router for seamless page transitions

## 🚀 Tech Stack

- **React** - Frontend framework
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation and routing
- **JavaScript** - Programming language
- **CSS-in-JS** - Styling with MUI's styling solution

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🔧 Installation

1. **Clone the repository**
```bash
   git clone <your-repository-url>
   cd hoteliq-boston
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start the development server**
```bash
   npm start
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure
```
hoteliq-boston/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── HotelCard.jsx       # Hotel card component
│   │   ├── Chatbot.jsx         # AI chatbot assistant
│   │   └── Footer.jsx          # Footer component
│   ├── pages/
│   │   ├── Home.jsx            # Home page with hotel listings
│   │   └── HotelDetails.jsx   # Detailed hotel view
│   ├── data/
│   │   └── hotels.json         # Hotel data
│   ├── App.jsx                 # Main app component
│   ├── index.js                # Entry point
│   └── theme.js                # MUI theme configuration
├── package.json
└── README.md
```

## 🎨 Key Components

### Navbar
- Fixed top navigation with search and account icons
- Responsive menu for mobile devices

### HotelCard
- Displays hotel preview with image, name, location, rating, and price
- Clickable cards that navigate to detailed view
- Equal height cards with proper alignment

### HotelDetails
- Full-width hero image with overlay
- Hotel information including description and amenities
- Check-in/check-out information
- Booking button

### Chatbot
- Floating chatbot button in bottom-right corner
- Interactive messaging interface
- Expandable/collapsible chat window

### Footer
- 4-column layout with company info, links, support, and contact
- Social media icons
- Copyright information

## 🏨 Hotels Data

The application includes 5 Boston hotels:
1. **The Liberty, a Luxury Collection Hotel** - Beacon Hill
2. **Boston Harbor Hotel** - Rowes Wharf
3. **Omni Boston Hotel** - Seaport
4. **The Lenox Hotel** - Back Bay
5. **Seaport Suites Hotel** - Seaport

To add more hotels, edit `src/data/hotels.json`:
```json
{
  "id": 6,
  "name": "Hotel Name",
  "location": "Location, Boston",
  "price": 300,
  "rating": 4.5,
  "reviews": 500,
  "image": "https://your-image-url.com",
  "description": "Hotel description...",
  "amenities": ["Free Wifi", "Pool", "Gym"]
}
```

## 🎨 Customization

### Theme
Edit `src/theme.js` to customize colors, typography, and other theme settings:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" }, // Change primary color
    secondary: { main: "#f50057" }
  },
  // ... other theme options
});
```

### Styling
Components use MUI's `sx` prop for styling. Modify styles directly in component files.

## 📱 Responsive Breakpoints

The application uses MUI's breakpoint system:
- **xs**: 0px - 600px (mobile)
- **sm**: 600px - 960px (tablet)
- **md**: 960px - 1280px (desktop)
- **lg**: 1280px+ (large desktop)

## 🚀 Building for Production

Create an optimized production build:
```bash
npm run build
```

This creates a `build` folder with production-ready files that can be deployed to any static hosting service.

## 🌐 Deployment

You can deploy this app to:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)
- [AWS S3](https://aws.amazon.com/s3/)

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## 🐛 Troubleshooting

**Issue: Cards not aligned properly**
- Ensure you're using the latest version of the code with CSS Grid layout
- Check that `display: 'flex'` is applied to Grid items

**Issue: Chatbot not appearing**
- Check that `Chatbot` component is imported and rendered in `App.jsx`
- Verify that the z-index is not being overridden

**Issue: Images not loading**
- Ensure image URLs in `hotels.json` are valid
- Replace placeholder URLs with actual hotel images

## 📝 Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)
