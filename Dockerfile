ARG PREBUILT_JS=1

# strap in, it's time to do control flow in a Dockerfile!
# see https://stackoverflow.com/a/60820156

# if PREBUILT_JS=0 :
FROM node:18-alpine AS frontend_builder_0

WORKDIR /working
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/tsconfig.json ./
RUN yarn run build

# if PREBUILT_JS=1 :
FROM scratch as frontend_builder_1
WORKDIR /working
COPY frontend/build ./build

# do the branch (via interpolation) and make the result available under a single name,
# because we can't interpolate in a COPY --from="..."
FROM "frontend_builder_${PREBUILT_JS}" as frontend_builder


FROM node:18-alpine

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=true

COPY ./src ./src
COPY --from=frontend_builder /working/build /assets

CMD [ "node", "src/index.js" ]
