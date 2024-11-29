import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The refresh token to generate new access token',
    required: true,
  })
  refresh_token: string;
}
