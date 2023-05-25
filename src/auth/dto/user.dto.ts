import { IsEmail, IsString } from "class-validator";

export class userDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class userRegisterDto extends userDto {
  @IsString()
  fullName: string;
}
