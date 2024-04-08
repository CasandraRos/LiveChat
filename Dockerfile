# Use the official Node.js image with specified version (18)
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port on which the app runs (if needed)
# EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

