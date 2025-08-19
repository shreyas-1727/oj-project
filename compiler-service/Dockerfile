# Use Debian-based Node image
FROM node:18-bullseye

# Install Docker CLI
RUN apt-get update && apt-get install -y docker.io

# Seting the working directory inside the container
WORKDIR /usr/src/app

# Copying package.json and package-lock.json to the working directory
COPY package*.json ./

# Installing the application's dependencies
RUN npm install

# Copying the rest of the application's source code
COPY . .

# The service runs on port 5000, so exopsing it
EXPOSE 5000

# Defining the command to run the application
CMD [ "npm", "start" ]