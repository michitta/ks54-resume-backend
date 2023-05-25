import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { StudentsService } from "./students.service";

@Controller("students")
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get("/search/:fullName")
  async searchStudent(@Param("fullName") fullName: string) {
    return this.studentsService.searchStudent(fullName);
  }

  @Get("/:uuid")
  async getStudent(@Param("uuid") uuid: string) {
    return this.studentsService.getStudent(uuid);
  }

  @Post("/:uuid")
  async setStudent(@Param("uuid") uuid: string, @Body() body: any) {
    return this.studentsService.setStudent(uuid, body.data);
  }
}
