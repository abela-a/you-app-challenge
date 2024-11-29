import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Register a new user',
    responses: {
      201: { description: 'User successfully registered' },
      400: { description: 'Bad Request' },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Login a user',
    responses: {
      200: { description: 'User successfully logged in' },
      400: { description: 'Bad Request' },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: 'Refresh access token',
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
    summary: 'Logout a user',
    responses: {
      200: { description: 'User successfully logged out' },
      400: { description: 'Bad Request' },
      401: { description: 'Unauthorized' },
    },
    security: [{ bearerAuth: [] }],
  })
  async logout(@Request() request) {
    return this.authService.logout(request.user.userId);
  }
}
