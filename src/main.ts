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
    origin: ["http://localhost:3000", "https://owocon.eu.org"],
  });
  await app.listen(3003);
}
bootstrap();
