# Keeping amd64 to match EC2 .
FROM --platform=linux/amd64 node:24-alpine

WORKDIR /usr/src/app

# Installing compilers/tools inside the SAME container (no docker-cli)
# - g++ for C++
# - python3 for Python
# - openjdk17-jdk for Java (javac + java)
# - bash optional but useful
RUN apk update && apk add --no-cache \
    g++ \
    python3 \
    openjdk17-jdk \
    bash

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
