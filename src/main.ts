import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as parser from "cookie-parser";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(parser());
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.enableCors({
    credentials: true,
    origin: ["http://127.0.0.1:3000", "http://172.20.0.5:3000"],
  });
  await app.listen(3003);
}
bootstrap();
