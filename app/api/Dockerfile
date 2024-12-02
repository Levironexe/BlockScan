FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-dev \
    software-properties-common

# Install Python packages with the break-system-packages flag
RUN python3 -m pip install --break-system-packages solc-select slither-analyzer

# Create app directory
WORKDIR /app/api

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Start command
CMD ["node", "backend.mjs"]