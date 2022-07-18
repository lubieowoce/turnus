FROM node:18-alpine

WORKDIR /skadinad

COPY ./server/build ./server/build/
COPY ./app/build /assets/

CMD [ "node", "./server/build/server.js" ]
