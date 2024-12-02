FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3 \
    software-properties-common

# Install Solidity compiler and Slither
RUN pip3 install slither-analyzer

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Start command
CMD ["node", "backend.mjs"]