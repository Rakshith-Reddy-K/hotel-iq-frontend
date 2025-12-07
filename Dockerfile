# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

ARG REACT_APP_BACKEND_BASE_URL

# Make them available as env vars during build
ENV REACT_APP_BACKEND_BASE_URL=$REACT_APP_BACKEND_BASE_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:2-alpine

# Copy the built React app to Caddy's serve directory
COPY --from=builder /app/build /srv

# Copy Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Cloud Run uses PORT environment variable (default 8080)
EXPOSE 8080

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
