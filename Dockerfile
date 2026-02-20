# ── Dockerfile (Frontend) ─────────────────────────────────────────────────────
# Multi-stage build:
# Stage 1: Build the React app using Node
# Stage 2: Serve the built files using Nginx
#
# Why multi-stage?
# - Stage 1 (Node) is heavy ~1GB — we only need it to BUILD
# - Stage 2 (Nginx) is tiny ~25MB — this is what actually runs in production
# - Final image is small, fast, and secure
#
# Build:  docker build -t shopzone-frontend .
# Run:    docker run -p 80:80 shopzone-frontend
# Visit:  http://localhost

# ── Stage 1: Build React App ──────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (Docker cache optimization)
# If package.json didn't change, npm install layer is reused = faster builds
COPY package.json package-lock.json ./
RUN npm install

# Copy all source code and build
COPY . .
RUN npm run build
# Output goes to /app/build folder

# ── Stage 2: Serve with Nginx ─────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files from Stage 1 into nginx's serving directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check — ECS/EKS uses this to know container is alive
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]