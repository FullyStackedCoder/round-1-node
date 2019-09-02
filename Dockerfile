# Dockerize the node app

FROM node:10-slim as base
LABEL org.opencontainers.image.authors=me@findpraveen.com
LABEL org.opencontainers.image.title="Round 1 Node.js"
LABEL org.opencontainers.image.licenses=MIT
LABEL com.findpraveen.nodeversion=$NODE_VERSION
ENV NODE_ENV=production
EXPOSE 8080
ENV PORT 8080
WORKDIR /app
COPY package*.json ./
RUN npm config list
RUN npm ci \
  && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
CMD ["node", "app.js"]

FROM base as dev
ENV NODE_ENV=development
RUN apt-get update -qq && apt-get install -qy \
  ca-certificates \
  bzip2 \
  curl \
  libfontconfig \
  --no-install-recommends
RUN npm config list
RUN npm install --only=development \
  && npm cache clean --force
USER node
CMD ["nodemon", "app.js"]


FROM dev as test
COPY . .
RUN npm audit

FROM test as pre-prod
USER root
RUN rm -rf ./test && rm -rf ./node_modules

FROM base as prod
COPY --from=pre-prod /app /app
HEALTHCHECK CMD curl http://127.0.0.1:4000/ || exit 1
USER node
