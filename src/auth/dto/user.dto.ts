import { IsEmail, IsString, IsStrongPassword, IsUUID } from "class-validator";

export class login {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  password: string;
}

export class register {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  password: string;
}

export class recovery {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  password: string;
}
