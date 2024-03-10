FROM node:21-bookworm

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]
