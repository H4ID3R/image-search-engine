# Use an official Node.js runtime as a parent image
FROM node:18.16.1

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the application
# RUN npm run build

# Install 'serve' globally
# RUN npm install -g vite

# Expose port 8080
EXPOSE 8080

# Command to run the app
# CMD ["serve", "-s", "dist", "-l", "5000"]
CMD ["npm", "run", "dev"]
