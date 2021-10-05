FROM node:12.17-alpine

WORKDIR /portal

# copy package.json from frontend and install dependencies
COPY ./frontend ./frontend
COPY ./backend ./backend

WORKDIR /portal/frontend

RUN npm install && npm run build && cp -r ./build ../backend/build

WORKDIR /portal/backend

# copy package.json from backend and install dependencies
RUN npm install

CMD ["npm", "start"]