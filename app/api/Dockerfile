FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-dev \
    git \
    software-properties-common

# Upgrade pip using apt instead
RUN apt-get install -y python3-pip

# Install Python packages
RUN pip3 install --no-cache-dir solc-select
RUN pip3 install --no-cache-dir slither-analyzer

# Install and set Solidity version
RUN solc-select install 0.8.19 && solc-select use 0.8.19

# Create app directory
WORKDIR /app

# Install the latest npm version
RUN npm install -g npm@latest

# Install app dependencies
COPY package*.json ./
RUN npm install --verbose

# Bundle app source
COPY . .

# Start command
CMD ["node", "backend.mjs"]
