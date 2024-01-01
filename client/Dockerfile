
FROM node:18-alpine as builder

WORKDIR /myapp1

COPY package*.json ./


RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]