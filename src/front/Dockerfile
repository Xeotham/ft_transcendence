# Use an official Node.js runtime as a parent image
FROM node:18-alpine

ARG FRONT_PORT
ARG ADDR

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY    transcendence-front/package*.json ./

# Install dependencies
RUN     npm install

# Copy the rest of the application code
COPY ./transcendence-front .

#RUN npm run build

RUN sed -i "s/DUMMY_FRONT_PORT/${FRONT_PORT}/g" /app/vite.config.js
RUN sed -i "s/DUMMY_ADDRESS/${ADDR}/g" /app/src/ts/main.ts

# Expose the port that BrowserSync will run on
EXPOSE 5000

# Run BrowserSync
CMD ["npm", "run", "dev"]
