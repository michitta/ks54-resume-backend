import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("Users")
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Get()
  async getStudent(@Req() req: any) {
    return this.UsersService.getStudent(req.user.uuid);
  }

  @UseGuards()
  @Post()
  async setStudent(@Req() req: any, @Body() body: any) {
    return this.UsersService.setStudent(req.user.uuid, body.data);
  }
}
