FROM node:22-alpine as base

RUN apk --no-cache add curl

# All deps stage
FROM base as deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM deps as production-deps
WORKDIR /app
RUN npm prune --production
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

# Build stage
FROM deps as build
WORKDIR /app
ADD . .
RUN node ace build

FROM base
WORKDIR /app
# Copy built application
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY --from=build /app/ecosystem.config.cjs /app
RUN npm i -g pm2

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENV CACHE_VIEWS="true" \
    HOST="0.0.0.0" \
    PORT="3000" \
    LOG_LEVEL="info" \
    SESSION_DRIVER="cookie" \
    DB_CONNECTION=pg \
    APP_NAME="matstack-dreamstart"
CMD [ "pm2-runtime", "start", "/app/ecosystem.config.cjs"]
