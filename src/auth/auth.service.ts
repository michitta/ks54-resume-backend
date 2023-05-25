import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "nestjs-prisma";
import { MailerService } from "@nest-modules/mailer";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!user) throw new BadRequestException("Неверный логин или пароль");
    if (user && (await argon2.verify(user.password, password))) {
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

  async register(fullName: string, email: string, password: string) {
    const userExists = await this.prisma.users.findFirst({
      where: {
        email,
        OR: [
          {
            fullName: fullName,
          },
        ],
      },
    });
    if (userExists)
      throw new BadRequestException("Такой пользователь уже существует");
    const user = await this.prisma.users.create({
      data: {
        fullName,
        email,
        password: await argon2.hash(password),
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

  public async recovery(email: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: { email },
    });
    if (user) {
      const tokenToRecovery = `http://localhost:3003/api/v1/auth/recoveryConfirm?token=${this.jwtService.sign(
        {
          sub: {
            uuid: user.uuid,
            password: await argon2.hash(password),
          },
          type: "recovery",
        },
        { expiresIn: "24h" }
      )}`;
      await this.mailerService
        .sendMail({
          to: email,
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

  public async recoveryConfirm(token: string) {
    const user = await this.prisma.users.findUnique({
      where: { uuid: this.jwtService.verify(token).sub.uuid },
    });
    if (user && this.jwtService.verify(token).type === "recovery") {
      await this.prisma.users.update({
        where: { uuid: user.uuid },
        data: { password: this.jwtService.verify(token).sub.password },
      });
      return {
        message: "Восстановление пароля прошло успешно",
      };
    }

    throw new BadRequestException("Произошла ошибка");
  }

  async getMe(uuid: string) {
    const db = await this.prisma.users.findFirst({
      where: {
        uuid,
      },
    });
    if (!db) throw new NotFoundException("Invalid credentials");
    return {
      uuid: db.uuid,
      email: db.email,
      fullName: db.fullName,
      admin: db.admin,
    };
  }
}
