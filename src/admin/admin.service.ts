import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async searchStudent(fullName: string) {
    return this.prisma.Admin.findMany({
      where: {
        fullName: {
          contains: fullName,
        },
      },
    });
  }

  async getStudent(uuid: string) {
    return this.prisma.Admin.findFirst({
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
    const student = await this.prisma.Admin.findFirst({
      where: {
        uuid: uuid,
      },
    });

    if (!student) throw new BadRequestException("This student does not exist");

    await this.prisma.Admin.update({
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
