# Dockerfile in client folder
FROM node:14

WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
