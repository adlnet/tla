# Simple NodeJS HTTP Server

A simple NodeJS Express application for standing up an HTTP server.  The goal of this project is to easily run a local server for developing static content, while allowing for integration with NPM libraries for security and convenience.

## Setup
There are a few different ways to run the server.  If running locally, you will need to **[install NodeJS](https://nodejs.org/en/download/)**.  

Each of the below will begin with opening your favorite shell.  **The instructions for Docker have not been tested on Windows.**

### w/ Node
If you are looking to start this on Windows, then this is the preferred method.  
- `git clone https://github.com/vbhayden/simple-node-http`
- `cd simple-node-http`
- `node app.js`

### w/ plain Docker
If you enjoy typing out long Docker commands, then this is the method for you.
- `git clone https://github.com/vbhayden/simple-node-http`
- `cd simple-node-http`
- `sudo ./install-reqs.sh`
- `sudo docker build -t simple-http-image .`
- `sudo docker run -d -it -p 80:80 -e PORT=80 --name=simple-http simple-http-image`

### w/ Docker-Compose
If you enjoy Docker but are also civilized, this is the preferred method for you.
- `git clone https://github.com/vbhayden/simple-node-http`
- `cd simple-node-http`
- `sudo ./install-reqs.sh`
- `sudo docker-compose up -d --build`

### Installation Testing Instructions
When the server starts, the console will print the following:
```
[Server] listening on port 3000 ...
```
If you used one of the Docker configurations, then you can access the server's console output with:
```
sudo docker logs -f simple-http
```

To view the service, browse to `localhost:3000` (or `localhost` for Docker) for the default landing page:
![alt text](https://i.imgur.com/2P3mAl9.png "Default landing page")

Navigating to something not found in your `/files` folder will produce the following:
![alt text](https://i.imgur.com/GvPEwDa.png "404")

### Troubleshooting Tips
This project isn't intended to be a robust HTTP server out of the box, opting instead to be either a simple static hosting service or an extensible baseline for a more elegant HTTP solution.  With that said, there are still a few potential issues.

#### Non-Relative `href` and `src` attributes
When a resource is requested on a page, it will be processed as one of 3 types.  Suppose we have a folder with a page accessed at `/mypage/`:
- **absolute**: specifies the protocol and full path (`https://www.google.com/images/...`)
- **domain-relative**: a path from the hosting service itself (`/my-page/public/css/...`)
- **page-relative**: a path on the server relative to that page itself (`public/css`)

If you notice that some of your static files aren't being found, check that your path declaration is navigable.  Depending on your situation, you may need to change them.

#### HTTPS / SSL
By default, this project doesn't include an HTTPS configuration.  This can be achieved either through the `https` NPM module or perhaps more easily through an Nginx proxy (straightforward with the Docker configuration).  

More information on using SSL with Node **[can be found here](https://www.sitepoint.com/how-to-use-ssltls-with-node-js/)**.  
