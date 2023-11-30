<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

back-end of a simple app chat, all functionality like Authentication,PostingMessages and etc are handle by REST-API and just sending new messages to chat members was handled by WebSocket.

## Techs

- [NestJS](https://github.com/nestjs/nest)
- [Socket.IO](https://socket.io/docs/v4/server-api/)
- [RXJS](https://rxjs.dev/guide/overview)
- [JWT](https://www.npmjs.com/package/@nestjs/jwt)
- [MongoDB, Mongoose](https://docs.nestjs.com/techniques/mongodb)
- [AsyncAPI](https://www.npmjs.com/package/nestjs-asyncapi)
- [OpenAPI](https://docs.nestjs.com/openapi/introduction)

## Features

- Private chat
- Group
- Channel
- MessageReplay

## Installation

```bash
# install the dependencies
$ npm install

# initialize mongodb container and run it
$ docker run --name 'chatDB' -e MONGO_INITDB_ROOT_USERNAME='root' -e MONGO_INITDB_ROOT_PASSWORD='1234' -e MONGO_INITDB_DATABASE='chat' -dp 8081:27017 mongo:latest
```

## Running the app

```bash

# running the database container
$ docker start chatDB

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Environments
 
- DATABASE_NAME -> application database name
- MONGO_URI -> mongodb connection URI
- APP_PORT -> application http and socket port
- DOCS_IS_ONLINE -> if true the Docs are available otherwise not available



## Documentations

- REST-API : ~/rest-api
- WebSocket : ~/event-api

## WebSocket

- handshake path is : /notification
- for receiving new messages, use 'new' event with this payload {token:Bearer 'login token'}
- after registering on 'new' event, the user automatically was registered to all chat rooms that user is a member
- then when a new message post to a chat, that message was sended to 'chatId' event
- so for receiving new messages for each chat, should subscribe on  'chatId' events
- summary : for receiving new messages -> first subscribe on 'new', then subscribe to all 'chatId' events

