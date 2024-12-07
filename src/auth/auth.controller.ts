import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from 'src/common/dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/common/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('auth')
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
