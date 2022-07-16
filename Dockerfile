FROM node:18-alpine
ARG ASSETS_SOURCE_DIR

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=true

COPY ./src ./src
COPY "$ASSETS_SOURCE_DIR" /assets

CMD [ "node", "src/index.js" ]