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

# We need to be able to access package.json from the root
COPY ../../package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Start command
CMD ["node", "backend.mjs"]