FROM node:12

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./ /usr/src/app/

RUN npm install --save

EXPOSE 5000

CMD ["npm", "start"]
