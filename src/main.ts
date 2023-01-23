import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true, //by doing this it will strip out the values that are not determined in the dto.
    }
  )); //we have to write this to check for the empty strings and validations.
  await app.listen(1317); //giving the localhost port as 1317.
}
bootstrap();
