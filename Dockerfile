# Use a Node.js base image
FROM node:18

# Set the working directory within the container
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install react-router-dom

RUN npm install react-icons

RUN npm install -D tailwindcss@v3 postcss autoprefixer

# Copy the rest of the application code
COPY . .

# Expose the port your React app runs on
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
