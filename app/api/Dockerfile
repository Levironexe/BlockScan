FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-setuptools \
    python3-dev \
    git \
    software-properties-common && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install pip using get-pip.py to bypass the PEP 668 restriction
RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python3

# Confirm Python and pip installation
RUN python3 --version && pip3 --version

# Install Python packages globally
RUN pip3 install --no-cache-dir solc-select slither-analyzer

# Install and set Solidity version
RUN solc-select install 0.8.19 && solc-select use 0.8.19

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Start command
CMD ["node", "backend.mjs"]
