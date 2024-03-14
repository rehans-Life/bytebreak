FROM node:18-alpine as builder

ARG NEXT_PUBLIC_AUTH_DOMAIN
ARG NEXT_PUBLIC_API_KEY

ENV NEXT_PUBLIC_AUTH_DOMAIN=${NEXT_PUBLIC_AUTH_DOMAIN}
ENV NEXT_PUBLIC_API_KEY=${NEXT_PUBLIC_API_KEY}

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /usr/app

COPY --from=builder /usr/app/.next/standalone ./
COPY --from=builder /usr/app/public ./public
COPY --from=builder /usr/app/.next/static ./.next/static

CMD [ "server.js" ]
