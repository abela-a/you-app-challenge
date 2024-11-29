import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    example: 'username',
    description: 'The username of the user',
    maxLength: 50,
    minLength: 3,
    required: true,
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: 'st0ng_P@ssw0rd',
    description: 'The password of the user',
    minLength: 8,
    required: true,
  })
  password: string;
}
