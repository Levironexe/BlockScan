FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-dev \
    git \
    software-properties-common

# Install Solc and Slither
RUN pip3 install --upgrade pip && \
    pip3 install solc-select && \
    solc-select install 0.8.19 && \
    solc-select use 0.8.19 && \
    pip3 install slither-analyzer

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 5000

# Start command
CMD ["node", "backend.mjs"]