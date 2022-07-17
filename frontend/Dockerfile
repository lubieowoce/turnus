FROM node:18-alpine

WORKDIR /app
COPY ./server/package.json ./server/yarn.lock ./

RUN yarn install --frozen-lockfile --production=true

COPY ./server/build ./build
COPY ./app/build /assets

CMD [ "yarn", "run", "start" ]
