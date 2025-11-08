# Use full Node (not slim) for dev tools
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies like ts-node, nodemon)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (in case it's not in git)
RUN npx prisma generate

# Expose port (matches .env)
EXPOSE 3000

# Start in dev mode (hot reload)
CMD ["npm", "run", "dev"]
