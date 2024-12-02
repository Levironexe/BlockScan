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

# Set working directory
WORKDIR /app

# Copy package files from root first
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Copy the api directory content
COPY . ./api/

# Start command from the api directory
CMD ["node", "api/backend.mjs"]