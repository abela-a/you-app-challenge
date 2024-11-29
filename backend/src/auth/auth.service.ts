import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(registerDto: RegisterDto) {
    return this.userService.createUser(registerDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.getUserByUsernameOrEmail(
      loginDto.identifier,
    );

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password is incorrect');

    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(
      user._id.toString(),
      hashedRefreshToken,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.getUserById(payload.sub);

      if (!user) throw new NotFoundException('User not found');

      const tokenIsValid = await bcrypt.compare(
        refreshTokenDto.refresh_token,
        user.refresh_token,
      );

      if (!tokenIsValid)
        throw new UnauthorizedException('Invalid refresh token');

      const newPayload = { username: user.username, sub: user._id };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      });

      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.userService.updateRefreshToken(
        user._id.toString(),
        hashedNewRefreshToken,
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);

    return;
  }
}
