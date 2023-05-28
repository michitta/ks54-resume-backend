import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { InjectS3, S3 } from "nestjs-s3";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectS3() private readonly s3: S3
  ) {}

  async getStudent(uuid: string) {
    const student = await this.prisma.students.findFirst({
      where: {
        uuid: uuid,
      },
    });

    if (!student) throw new BadRequestException("This student does not exist");

    return student;
  }

  async setStudent(uuid: string, data: any) {
    const student = await this.prisma.students.findFirst({
      where: {
        uuid: uuid,
      },
    });

    if (!student) {
      await this.prisma.students.create({
        data: {
          uuid: uuid,
          ...data,
        },
      });
      return {
        message: "Резюме создано",
      };
    }

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

  async deleteStudent(uuid: string) {
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

  async setIcon(uuid: string, file: Express.Multer.File) {
    if (file?.mimetype != "image/png")
      throw new BadRequestException("Неверный формат файла. Загрузите .png");
    Promise.all([
      this.s3.putObject({
        Bucket: "hackaton",
        Key: `${uuid}.png`,
        ACL: "public-read",
        Body: file.buffer,
      }),
      this.prisma.students.update({
        where: { uuid },
        data: {
          lastModified: new Date(),
        },
      }),
    ]);

    return {
      message: "Иконка обновлена",
    };
  }
}
