# TLA Portal

This is the TLA portal page, which serves as an entrypoint into the TLA 's services and projects; [README.md](./README.md) will be updated as the project progresses.

Frontend packages installed:
- "react-bootstrap"
- "react-router-dom"
- "vega"
- "vega-lite"
- "react-vega"

## How to run the application 
### Running the application (served through Express):
1. Copy the '.env.example' file contents into a new file '.env' in the portal root directory 

2. In the tla-portal directory, run:

    `cd frontend && npm install`

    in order to install all dependecies and packages

3. Create a build folder in the frontend directory

    `npm run build`

    and copy+paste the ***/build*** folder into the **backend** directory
    **if one already exists in the backend, you can replace it with the new build folder**

4. Switch directories into the backend and npm install the Express server dependencies

    `cd ../backend && npm install`

5. While in the backend folder, you can now run the server

    `npm start`

This will start the React frontend and Express server simultaenously on http://localhost:5000



### Opening the application on Docker:
**1. Make sure [Docker](https://docs.docker.com/get-docker/) is installed**

**2. Build the Docker image**

    `sudo docker build -t portal:dev .`


**3. Run the Docker image**
#### With Docker:

    sudo docker run \
        -it \
        <!-- -p 5000:5000 \
        -e CHOKIDAR_USEPOLLING=true \ -->
        portal/dev

#### With Docker Compose:
    docker-compose up -d


**4. The website will now run on <http://localhost:5000>**

To stop the container on Docker Compose, run:
    `docker-compose stop {portal container id}`
