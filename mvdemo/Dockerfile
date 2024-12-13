# Stage 1: Build the Angular application
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

COPY ./ /app/
# Install Angular dependencies
RUN npm install -g @angular/cli

RUN npm install --force

# Build the Angular application
RUN npm run build 

# Stage 2: Serve the Angular application with NGINX
FROM nginx:latest

# Copy the built Angular application from the previous stage
COPY --from=build /app/dist/ /usr/share/nginx/html

# Expose port 80 for the NGINX server
EXPOSE 80