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
RUN solc-select install 0.8.0 && \
solc-select install 0.8.1 && \
solc-select install 0.8.2 && \
solc-select install 0.8.3 && \
solc-select install 0.8.4 && \
solc-select install 0.8.5 && \
solc-select install 0.8.6 && \
solc-select install 0.8.7 && \
solc-select install 0.8.8 && \
solc-select install 0.8.9 && \
solc-select install 0.8.10 && \
solc-select install 0.8.11 && \
solc-select install 0.8.12 && \
solc-select install 0.8.13 && \
solc-select install 0.8.14 && \
solc-select install 0.8.15 && \
solc-select install 0.8.16 && \
solc-select install 0.8.17 && \
solc-select install 0.8.18 && \
solc-select install 0.8.19 && \
solc-select install 0.8.20 && \
solc-select install 0.8.21 && \
solc-select install 0.8.22 && \
solc-select install 0.8.23 && \
solc-select install 0.8.24 && \
solc-select install 0.8.25

# Set working directory
WORKDIR /app

# Copy only the necessary dependencies for backend
RUN npm install express cors multer @supabase/supabase-js dotenv

# Copy the current directory contents
COPY . .

# Start command
CMD ["node", "backend.mjs"]