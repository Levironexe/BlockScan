FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-dev \
    git \
    software-properties-common

# Set Python environment variables
ENV PATH="/root/.local/bin:${PATH}"
ENV PYTHONPATH="/root/.local/lib/python3/site-packages:${PYTHONPATH}"

# Install Python packages separately to better track errors
RUN python3 -m pip install --user --upgrade pip
RUN python3 -m pip install --user solc-select
RUN python3 -m pip install --user slither-analyzer

# Install and set Solidity version
RUN solc-select install 0.8.19
RUN solc-select use 0.8.19

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