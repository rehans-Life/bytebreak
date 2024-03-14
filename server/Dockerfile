FROM node:20-alpine as builder

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

RUN npx tsc

FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /usr/app

ENV NODE_ENV=Production

COPY  --from=builder /usr/app/dist ./dist
COPY  --from=builder /usr/app/node_modules ./node_modules

CMD [ "./dist/src/server.js" ]