FROM node:8

# Create our NodeJS source directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the project in
COPY ./ ./

# Install the packages
RUN npm install --save

# Expose our port
EXPOSE 8085

# Start the service
CMD ["npm", "start"]
