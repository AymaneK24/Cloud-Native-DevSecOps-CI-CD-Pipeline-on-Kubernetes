# Build stage
FROM node:20.10-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build the app
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy built Angular app to nginx html directory
COPY --from=build /app/front/e-commerce /usr/share/nginx/html

# Configure Nginx to listen on port 8080
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
