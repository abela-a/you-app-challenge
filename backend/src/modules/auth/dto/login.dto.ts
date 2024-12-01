import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The identifier for login, can be username or email',
    example: 'user@example.com',
  })
  identifier: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The password for login',
    example: 'st0ng_P@ssw0rd',
  })
  password: string;
}
