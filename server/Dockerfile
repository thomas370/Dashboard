# Dockerfile in server folder
FROM node:14

WORKDIR /usr/src/app/server

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
