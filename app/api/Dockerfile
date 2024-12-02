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
RUN solc-select install 0.8.1
RUN solc-select use 0.8.1

# Set working directory
WORKDIR /app

# Copy only the necessary dependencies for backend
RUN npm install express cors multer @supabase/supabase-js dotenv

# Copy the current directory contents
COPY . .

# Start command
CMD ["node", "backend.mjs"]