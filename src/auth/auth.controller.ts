import {
  BadRequestException,
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
import { userDto, userRegisterDto } from "./dto/user.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() body: userDto, @Res() res: Response) {
    const answer = await this.authService.login(body.email, body.password);
    res.cookie("token", answer.token);
    res.cookie("uuid", answer.uuid);
    return res.status(200).end();
  }

  @Post("register")
  async register(@Body() body: userRegisterDto, @Res() res: Response) {
    const answer = await this.authService.register(
      body.fullName,
      body.email,
      body.password
    );
    res.cookie("token", answer.token);
    return res.status(201).end();
  }

  @Post("/recovery")
  async recovery(@Body() body: any) {
    if (!body) throw new BadRequestException("Wrong data");
    return await this.authService.recovery(body.email, body.password);
  }

  @Get("/recoveryConfirm")
  @Redirect("http://localhost:3000/auth/login", 301)
  async recoveryConfirm(@Query("token") token: string) {
    if (!token) throw new BadRequestException("Wrong data");
    return await this.authService.recoveryConfirm(token);
  }

  @Get("/@me")
  @UseGuards(AuthGuard("jwt"))
  async getUser(@Req() req: any) {
    return this.authService.getMe(req.user.uuid);
  }
}
