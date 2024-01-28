FROM node:20-alpine

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

RUN npx tsc

CMD [ "npm", "run", "start:prod" ]