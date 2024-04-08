# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package*.json ./

# Install application dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port on which the app runs (if needed)
# Adjust the port number as per your Express.js app configuration
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
