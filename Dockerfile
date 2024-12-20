# Use a Node.js base image
FROM node:16-alpine

# Set the working directory within the container
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your React app runs on
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
