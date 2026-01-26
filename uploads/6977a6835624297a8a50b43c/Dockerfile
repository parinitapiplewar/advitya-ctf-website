FROM node:20-alpine

WORKDIR /app

# deps needed for node-pty
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  bash

COPY package.json .
RUN npm install --production

COPY server.js .
COPY challenge.sh .
COPY public ./public

RUN chmod +x challenge.sh

EXPOSE 3030
CMD ["node", "server.js"]
