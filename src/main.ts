import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipe/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

const appPort = 3000

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
    .setDescription("back-end of a simple chat application, was emitted events thorough the Socket.IO, and handle the rest of the functionality with REST-API.\n"+
    "when a new message post to a specific chat, thats message will be publish trough `new` event.\n"+
    "under the hood when a user subscribe to `new` event thats user join automatically to all chat rooms was user is a member"+
    "then when a message posted published to rooms(chats)")
    .setVersion("0.0.1")
    .setDefaultContentType('application/json')
    .addSecurity('user-password', {type: 'userPassword'})
    .addServer('/notification', {
      protocol: 'socket.io',
      url: `ws://127.0.0.1:${appPort}`
    })
    .build()

  const documentation = AsyncApiModule.createDocument(app, config)
  await AsyncApiModule.setup("event-api", app, documentation)

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupAsyncApi(app)
  setupOpenApi(app)

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(appPort);
}
bootstrap();

//https://docs.nestjs.com/openapi/introduction
//https://learning.postman.com/docs/publishing-your-api/api-documentation-overview/
