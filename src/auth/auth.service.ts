import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "nestjs-prisma";
import { MailerService } from "@nest-modules/mailer";
import * as argon2 from "argon2";
import { login, recovery, register } from "./dto/user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async login(data: login) {
    if (!data) throw new BadRequestException();
    const user = await this.prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) throw new BadRequestException("Неверный логин или пароль");
    if (user && (await argon2.verify(user.password, data.password))) {
      const payload = {
        uuid: user.uuid,
        email: user.email,
      };
      return {
        uuid: user.uuid,
        email: user.email,
        token: this.jwtService.sign(payload),
      };
    } else {
      throw new BadRequestException("Неверный логин или пароль");
    }
  }

  async register(data: register) {
    if (!data) throw new BadRequestException();
    const userExists = await this.prisma.users.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            fullName: data.fullName,
          },
        ],
      },
    });
    if (userExists)
      throw new BadRequestException("Такой пользователь уже существует");
    const user = await this.prisma.users.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: await argon2.hash(data.password),
      },
    });
    const payload = {
      uuid: user.uuid,
      email: user.email,
    };
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: "🎉 Добро пожаловать в редактор резюме!",
        template: __dirname + "/../../templates/welcome",
        context: {
          fullName: user.fullName,
        },
      })
      .catch((err) => {
        console.log(err);
      });
    return {
      token: this.jwtService.sign(payload),
    };
  }

  public async recovery(data: recovery) {
    if (!data) throw new BadRequestException();
    const user = await this.prisma.users.findFirst({
      where: { email: data.email },
    });
    if (user) {
      const tokenToRecovery = `https://owocon.eu.org/api/v1/auth/recoveryConfirm?token=${this.jwtService.sign(
        {
          sub: {
            uuid: user.uuid,
            password: await argon2.hash(data.password),
          },
          type: "recovery",
        },
        { expiresIn: "24h" }
      )}`;
      await this.mailerService
        .sendMail({
          to: data.email,
          subject: "😊 Восстановление доступа к редактору резюме!",
          template: __dirname + "/../../templates/recovery",
          context: {
            fullName: user.fullName,
            token: tokenToRecovery,
          },
        })
        .catch((err) => {
          console.log(err);
        });
      return {
        message: "Письмо отправлено",
      };
    } else {
      throw new BadRequestException("Такого пользователя не существует");
    }
  }

  public async recoveryConfirm(data: string) {
    if (!data) throw new BadRequestException();
    const user = await this.prisma.users.findUnique({
      where: { uuid: this.jwtService.verify(data).sub.uuid },
    });
    if (user && this.jwtService.verify(data).type === "recovery") {
      await this.prisma.users.update({
        where: { uuid: user.uuid },
        data: { password: this.jwtService.verify(data).sub.password },
      });
      return {
        message: "Восстановление пароля прошло успешно",
      };
    }

    throw new BadRequestException("Произошла ошибка");
  }

  async getMe(data: string) {
    if (!data) throw new UnauthorizedException();
    const db = await this.prisma.users.findFirst({
      where: {
        uuid: data,
      },
    });
    if (!db) throw new UnauthorizedException();
    return db;
  }
}
