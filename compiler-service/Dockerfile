# Using an official Node.js runtime as a parent image.
FROM node:18-alpine

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