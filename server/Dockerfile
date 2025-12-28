FROM node:20 as builder

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

RUN npx tsc

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /usr/app

ENV NODE_ENV=Production

COPY  --from=builder /usr/app/dist ./dist

COPY --from=builder /usr/app/src/drivers/cpp ./dist/src/drivers/cpp
COPY --from=builder /usr/app/src/drivers/java ./dist/src/drivers/java
COPY --from=builder /usr/app/src/drivers/javascript ./dist/src/drivers/javascript
COPY --from=builder /usr/app/src/drivers/python ./dist/src/drivers/python

COPY  --from=builder /usr/app/node_modules ./node_modules

CMD [ "./dist/src/server.js" ]