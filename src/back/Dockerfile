# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app
RUN     apk add curl

#COPY    ./transcendenceBack/package.json .
#COPY    ./transcendenceBack/package-lock.json .
#COPY    ./transcendenceBack/node_modules .
COPY    ./transcendenceBack/ .

RUN     rm -rf node_modules
# Install dependencies
RUN     npm install


EXPOSE 3000

# Run BrowserSync
CMD ["npm", "run", "dev"]
