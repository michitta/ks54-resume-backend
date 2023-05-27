require("dotenv").config();

import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "nestjs-prisma";
import { UsersModule } from "./users/users.module";
import { HandlebarsAdapter, MailerModule } from "@nest-modules/mailer";
import { AdminModule } from "./admin/admin.module";
import { S3Module } from "nestjs-s3";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AdminModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    S3Module.forRoot({
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESSKEYID,
          secretAccessKey: process.env.S3_SECRETACCESSKEY,
        },
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
        region: "de",
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: {
          user: "no-reply@yami.town",
          pass: process.env.SMTP_KEY,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@yami.town>',
      },
      template: {
        dir: __dirname + "/../templates",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
