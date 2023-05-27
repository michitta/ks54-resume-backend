import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":uuid")
  async getStudent(@Param("uuid") uuid: string) {
    return this.usersService.getStudent(uuid);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async setStudent(@Req() req: any, @Body() body: any) {
    return this.usersService.setStudent(req.user.uuid, body.data);
  }

  @Delete()
  @UseGuards(AuthGuard("jwt"))
  async removeStudent(@Req() req: any) {
    return this.usersService.deleteStudent(req.user.uuid);
  }

  @Put("icon")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file"))
  async skinUpload(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.setIcon(req.user.uuid, file);
  }
}
