import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FriendshipStatus } from '../../../app/enums/friendship-status';

export class CreateFriendshipDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    example: '',
    default: '',
    description: 'The user ID of the initiator. Auto-generated from the token',
    nullable: true,
  })
  initiator?: string;

  @IsMongoId()
  @ApiProperty({
    required: true,
    example: '',
    default: '',
    description: 'The user ID of the recipient',
  })
  recipient: string;

  @IsEnum(FriendshipStatus)
  @ApiProperty({
    required: true,
    example: FriendshipStatus.PENDING,
    default: FriendshipStatus.PENDING,
    description: 'The status of the friendship',
  })
  status: string;
}
