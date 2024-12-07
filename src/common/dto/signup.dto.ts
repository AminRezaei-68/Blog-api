import { IsEmail, IsString, Matches, MinLength } from '@nestjs/class-validator';

export class SignupDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters.' })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsString()
  @MinLength(6, { message: 'Confirm Password must be at least 6 characters.' })
  confirmPassword: string;
}
