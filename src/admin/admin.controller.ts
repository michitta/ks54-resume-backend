import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get(":fullName")
  @UseGuards(AuthGuard("jwt"))
  async searchStudent(@Param("fullName") fullName: string, @Req() req: any) {
    return this.adminService.searchStudent(fullName, req.user.uuid);
  }

  @Post(":uuid")
  @UseGuards(AuthGuard("jwt"))
  async setStudent(
    @Param("uuid") uuid: string,
    @Body() body: any,
    @Req() req: any
  ) {
    return this.adminService.setStudent(uuid, body.data, req.user.uuid);
  }

  @Delete(":uuid")
  @UseGuards(AuthGuard("jwt"))
  async deleteStudent(@Param("uuid") uuid: string, @Req() req: any) {
    return this.adminService.deleteStudent(uuid, req.user.uuid);
  }

  @Put("icon/:uuid")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file"))
  async skinUpload(
    @Req() req: any,
    @Param("uuid") uuid: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.adminService.setIcon(req.user.uuid, uuid, file);
  }
}
