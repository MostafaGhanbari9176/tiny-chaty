import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipe/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { ConfigService } from '@nestjs/config';

let appPort = 1997

/**
 * generating documentation for REST-API.
 * documentation is available on ~/rest-api
 * @param app 
 */
function setupOpenApi(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Chat Application `REST-API` documentation")
    .setDescription("back-end of a simple chat application, was emitted events thorough the Socket.IO, and handle the rest of the functionality with REST-API")
    .setVersion("0.0.1")
    .addBearerAuth({ type: 'http', description: "insert the login token" })
    .build()

  const documentation = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('rest-api', app, documentation)
}

async function setupAsyncApi(app: INestApplication) {
  const config = new AsyncApiDocumentBuilder()
    .setTitle("Chat Application `Socket Events` documentation")
    .setDescription(`
    - handshake path is : /notification
    - for receiving new messages, use 'new' event with this payload {token:Bearer 'login token'}
    - after registering on 'new' event, the user automatically was registered to all chat rooms that user is a member
    - then when a new message post to a chat, that message sended to 'chatId' event
    - so for receiving new messages for each chat, should subscribe on  'chatId' events
    - summary : for receiving new messages -> first subscribe on 'new', then subscribe to all 'chatId' events`)
    .setVersion("0.0.1")
    .setDefaultContentType('application/json')
    .addSecurity('user-password', { type: 'userPassword' })
    .addServer('/notification', {
      protocol: 'socket.io',
      url: `ws://127.0.0.1:${appPort}`
    })
    .build()

  const documentation = AsyncApiModule.createDocument(app, config)
  await AsyncApiModule.setup("event-api", app, documentation)

}

async function bootstrap() {
  const config = new ConfigService()
  appPort = config.get<number>("APP_PORT") || 1997
  const docsIsOnline:string = config.get<string>("CREATE_DOCS") || "false"

  const app = await NestFactory.create(AppModule);

  if (docsIsOnline == "true") {
    await setupAsyncApi(app)
    setupOpenApi(app)
  }

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(appPort, () => {
    console.log(`server listen on ${appPort} ${docsIsOnline == "true" ? ", REST-DOCS:/rest-api, SOCKET-DOCS:/event-api" : ""}`)
  });
}
bootstrap();

//https://docs.nestjs.com/openapi/introduction
//https://learning.postman.com/docs/publishing-your-api/api-documentation-overview/
