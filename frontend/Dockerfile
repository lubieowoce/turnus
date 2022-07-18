FROM node:18-alpine

WORKDIR /skadinad

COPY ./package.json ./yarn.lock ./
COPY ./server/package.json ./server/

WORKDIR /skadinad/server
RUN yarn install \
      --frozen-lockfile --production=true --focus

WORKDIR /skadinad/
COPY ./server/build ./server/build/
COPY ./app/build /assets/

# RUN sh -c 'du -h -d 1 node_modules' && exit 1;

WORKDIR /skadinad/server

CMD [ "yarn", "run", "start" ]
