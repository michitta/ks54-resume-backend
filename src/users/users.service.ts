import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudent(uuid: string) {
    return this.prisma.students.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        Works: true,
        Practics: true,
      },
    });
  }

  async setStudent(uuid: string, data: any) {
    const student = await this.prisma.users.findFirst({
      where: {
        uuid: uuid,
      },
    });

    if (!student) {
      await this.prisma.students.create({ data });
      return {
        message: "Резюме создано",
      };
    }

    await this.prisma.users.update({
      where: {
        uuid: uuid,
      },
      data: data,
    });

    return {
      message: "Резюме обновлено",
    };
  }
}
