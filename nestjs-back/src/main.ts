import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = 3333;
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
