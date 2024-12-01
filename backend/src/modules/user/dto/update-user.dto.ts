import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
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
