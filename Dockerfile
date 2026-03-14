# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Install exact versions from lockfile
RUN npm ci --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Expose port 2000
EXPOSE 2000

# Run start.sh
CMD ["sh", "./bin/start.sh"]
