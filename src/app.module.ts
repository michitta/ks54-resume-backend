require("dotenv").config();

import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "nestjs-prisma";
import { StudentsModule } from "./students/students.module";
import { HandlebarsAdapter, MailerModule } from "@nest-modules/mailer";

@Module({
  imports: [
    AuthModule,
    StudentsModule,
    PrismaModule.forRoot({
      isGlobal: true,
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
