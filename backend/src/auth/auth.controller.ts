import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register',
    description: 'Register a new user',
    responses: {
      201: { description: 'User successfully registered' },
      400: { description: 'Bad Request' },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'Login a user',
    responses: {
      200: { description: 'User successfully logged in' },
      400: { description: 'Bad Request' },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Refresh the access token using the refresh token',
    responses: {
      200: { description: 'Token successfully refreshed' },
      400: { description: 'Bad Request' },
      401: { description: 'Invalid refresh token' },
    },
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout a user',
    responses: {
      201: { description: 'User successfully logged out' },
      400: { description: 'Bad Request' },
      401: { description: 'Unauthorized' },
    },
  })
  @ApiSecurity('bearer')
  async logout(@Request() request) {
    return this.authService.logout(request.user.userId);
  }
}
