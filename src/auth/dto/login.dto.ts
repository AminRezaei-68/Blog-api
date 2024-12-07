import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or username cannot be empty.' })
  usernameOrEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;
}
