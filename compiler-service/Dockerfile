# Use an official, lightweight Node.js runtime as a parent image.
FROM node:18-alpine

# This is the crucial step that installs the Docker command-line tool
RUN apk add --no-cache docker-cli

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application's source code
COPY . .

# Expose the port the service runs on
EXPOSE 5000

# Define the command to run the application
CMD [ "npm", "start" ]