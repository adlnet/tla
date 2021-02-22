FROM node:10

# Create our NodeJS source directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the project in
COPY ./ /usr/src/app/

# Install the packages
RUN npm install --save

# Start the service
CMD ["npm", "start"]