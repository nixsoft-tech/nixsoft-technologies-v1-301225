# Stage 1: Build
FROM node:20.13.1-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set build arguments for Vite
ARG VITE_WORDPRESS_API_URL
ARG VITE_API_BASE_URL

ENV VITE_WORDPRESS_API_URL=$VITE_WORDPRESS_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# The build prerenders the blog from WordPress (scripts/prerender.mjs), but
# Docker reuses the cached build step when the code hasn't changed, so edited
# or new posts would stay stale. ADD downloads the current posts on every
# build and invalidates the cache whenever their content differs, so the next
# step re-runs exactly when the blog has changed. (If WordPress can't be
# reached, the build stops here and the running site is left untouched.)
ADD ${VITE_WORDPRESS_API_URL}/posts?per_page=100 /tmp/wp-posts-snapshot.json

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
