import { NestFactory } from "@nestjs/core"
import { ValidationPipe, VersioningType } from "@nestjs/common"

import { AppModule } from "./app.module"

async function bootstrap() {
   const app = await NestFactory.create(AppModule)
   app.enableVersioning({
      type: VersioningType.URI,
   })
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         forbidNonWhitelisted: true,
         transform: true,
         transformOptions: {
            enableImplicitConversion: true,
         },
      }),
   )
   await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
