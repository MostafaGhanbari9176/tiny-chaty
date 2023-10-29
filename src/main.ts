import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipe/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle("Chat Application REST-API documentation")
  .setDescription("this is back-end of a simple chat application, was emitted events thorough the Socket.IO, and handle the rest of the functionality with REST-API")
  .setVersion("0.0.1")
  .addBearerAuth({type:'http', description:"insert the login token"})
  .build()

  const documentation = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api', app, documentation)

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();

//https://docs.nestjs.com/openapi/introduction
//https://learning.postman.com/docs/publishing-your-api/api-documentation-overview/
