FROM node:18-alpine AS frontend_builder

WORKDIR /working
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/tsconfig.json ./
RUN yarn run build


FROM node:18-alpine

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=true

COPY ./src ./src
COPY --from=frontend_builder /working/build /assets

CMD [ "node", "src/index.js" ]