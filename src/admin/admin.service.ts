import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { InjectS3, S3 } from "nestjs-s3";
import { Md5 } from "ts-md5";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectS3() private readonly s3: S3
  ) {}

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

  async setIcon(adminUuid: string, uuid: string, file: Express.Multer.File) {
    const checkPermissions = await this.prisma.users.findUnique({
      where: { uuid: adminUuid },
    });
    if (!checkPermissions.admin)
      throw new BadRequestException("You are not admin");
    if (file?.mimetype != "image/png")
      throw new BadRequestException("Неверный формат файла. Загрузите .png");

    const lastModified = await this.prisma.students.findUnique({
      where: { uuid },
    });

    const hash = Md5.hashStr(file.buffer.toString()) + Date.now();

    if (!lastModified) throw new BadRequestException("Сначала создайте резюме");
    
    Promise.all([
      this.s3.putObject({
        Bucket: "images",
        Key: `${hash}.png`,
        ACL: "public-read",
        Body: file.buffer,
      }),
      this.prisma.students.update({
        where: { uuid },
        data: {
          lastModified: new Date(),
          imageHash: hash
        },
      }),
    ]);

    return {
      message: "Иконка обновлена",
    };
  }
}
