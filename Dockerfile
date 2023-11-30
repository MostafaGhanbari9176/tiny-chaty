#VERSION=2
FROM node:21.2.0-alpine3.18 AS build
ENV NODE_ENV production
WORKDIR /home/app/
COPY ./ ./
RUN npm install --production && npm run build

FROM node:21.2.0-alpine3.18
ENV NODE_ENV production
WORKDIR /home/app/
COPY --from=build /home/app/dist ./
EXPOSE 1997
ENTRYPOINT ["node", "./dist/main.js"]

