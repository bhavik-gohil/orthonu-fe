#!/bin/bash

echo "Starting deployment for Frontend..."

# Build the Docker image with BuildKit enabled for cache mounts
echo "Building image 'fe'..."
docker build -t fe .

# Stop and remove the existing container if it exists
echo "Stopping and removing existing container..."
docker stop fe || true
docker rm fe || true

# Run the new container
echo "Starting new container 'fe' on port 3000..."
docker run -d \
  --name fe \
  -p 3000:3000 \
  fe

echo "Frontend deployed successfully!"
