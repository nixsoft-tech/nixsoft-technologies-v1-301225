# Stage 1: Build
FROM node:20.13.1-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set build arguments for Vite
ARG VITE_GEMINI_API_KEY
ARG VITE_WORDPRESS_API_URL
ARG VITE_API_BASE_URL

ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_WORDPRESS_API_URL=$VITE_WORDPRESS_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Serve
FROM nginx:1.26.1-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
