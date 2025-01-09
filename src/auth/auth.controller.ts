import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
