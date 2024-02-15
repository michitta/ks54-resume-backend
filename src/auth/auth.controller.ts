import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { login, recovery, register } from "./dto/user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() data: login, @Res() res: Response) {
    const answer = await this.authService.login(data);
    res.cookie("token", answer.token);
    return res.status(200).send();
  }

  @Post("register")
  async register(@Body() data: register, @Res() res: Response) {
    const answer = await this.authService.register(data);
    res.cookie("token", answer.token);
    return res.status(200).send();
  }

  @Post("recovery")
  async recovery(@Body() data: recovery) {
    return this.authService.recovery(data);
  }

  @Get("recoveryConfirm")
  @Redirect("http://localhost:3003/auth/login", 301)
  async recoveryConfirm(@Query("token") data: string) {
    return this.authService.recoveryConfirm(data);
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("token");
    res.end();
    return res.status(200).send();
  }

  @Get("@me")
  @UseGuards(AuthGuard("jwt"))
  async getMe(@Req() data: any) {
    return this.authService.getMe(data.user.uuid);
  }
}
