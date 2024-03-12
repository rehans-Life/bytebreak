FROM node:18-alpine as builder

ENV NEXT_PUBLIC_AUTH_DOMAIN=${NEXT_PUBLIC_AUTH_DOMAIN}
ENV NEXT_PUBLIC_API_KEY=${NEXT_PUBLIC_API_KEY}

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]
