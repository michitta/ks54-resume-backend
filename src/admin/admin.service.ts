import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async searchStudent(fullName: string, adminUuid: string) {
    const checkPermissions = await this.prisma.users.findFirst({
      where: {
        uuid: adminUuid,
      },
    });

    if (!checkPermissions.admin)
      throw new BadRequestException("You are not admin");

    return this.prisma.students.findMany({
      where: {
        fullName: {
          contains: fullName,
        },
      },
    });
  }

  async setStudent(uuid: string, data: any, adminUuid: string) {
    const checkPermissions = await this.prisma.users.findFirst({
      where: {
        uuid: adminUuid,
      },
    });

    if (!checkPermissions.admin)
      throw new BadRequestException("You are not admin");

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

  async deleteStudent(uuid: string, adminUuid: string) {
    const checkPermissions = await this.prisma.users.findFirst({
      where: {
        uuid: adminUuid,
      },
    });

    if (!checkPermissions.admin)
      throw new BadRequestException("You are not admin");

    const student = await this.prisma.students.findFirst({
      where: {
        uuid: uuid,
      },
    });

    if (!student) throw new BadRequestException("This student does not exist");

    await this.prisma.students.delete({
      where: {
        uuid: uuid,
      },
    });

    return {
      message: "Резюме удалено",
    };
  }
}
