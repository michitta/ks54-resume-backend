import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller("Admin")
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

  @UseGuards()
  @Get("/:fullName")
  async searchStudent(@Param("fullName") fullName: string, @Req() req: any) {
    return this.AdminService.searchStudent(fullName);
  }

  @UseGuards()
  @Post("/:uuid")
  async setStudent(@Param("uuid") uuid: string, @Body() body: any) {
    return this.AdminService.setStudent(uuid, body.data);
  }
}
