# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY    transcendence-front/package*.json ./

# Install dependencies
RUN     npm install

# Copy the rest of the application code
COPY ./transcendence-front .

# Expose the port that BrowserSync will run on
EXPOSE 5173

# Run BrowserSync
CMD ["npm", "run", "dev"]
