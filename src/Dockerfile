FROM node:lts-alpine

WORKDIR /server

RUN apk add curl

COPY package*.json ./

RUN npm install

COPY index.js ./

EXPOSE 3000

CMD ["npm", "run", "start"]