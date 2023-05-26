import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async searchStudent(fullName: string) {
    return this.prisma.students.findMany({
      where: {
        fullName: {
          contains: fullName,
        },
      },
    });
  }

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
    const student = await this.prisma.students.findFirst({
      where: {
        uuid: uuid,
      },
    });

    if (!student) throw new BadRequestException("This student does not exist");

    await this.prisma.students.update({
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
