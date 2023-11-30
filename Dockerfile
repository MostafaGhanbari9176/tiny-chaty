#VERSION=1
FROM node:14.15.0-alpine AS build
WORKDIR /home/app/
COPY ./ ./
RUN npm run build
EXPOSE 8089
ENTRYPOINT /bin/sh -c 'node ./dist/main.js'

