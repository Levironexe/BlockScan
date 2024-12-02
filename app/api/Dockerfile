# Base image: Use the official Python image
FROM python:3.9-slim

# Install Node.js and other dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    git \
    curl \
    && apt-get clean

# Install Solidity compiler and solc-select
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository ppa:ethereum/ethereum \
    && apt-get update && apt-get install -y solc

RUN pip install --no-cache-dir solc-select && solc-select install 0.8.19 && solc-select use 0.8.19

# Install Slither via pip
RUN pip install --no-cache-dir slither-analyzer

# Set the working directory
WORKDIR /app/api

# Copy package.json and package-lock.json to install Node.js dependencies
COPY app/api/package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application
COPY app/api ./

# Expose the backend port (adjust if necessary)
EXPOSE 3000

# Default command to start the app
CMD ["node", "backend.mjs"]
