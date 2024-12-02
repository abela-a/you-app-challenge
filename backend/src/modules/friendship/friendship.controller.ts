import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { FriendshipStatus } from '../../app/enums/friendship-status';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Friendship',
    description: 'Create a new friendship',
    responses: {
      201: { description: 'Friendship created' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized' },
    },
  })
  async createFriendship(
    @Request() request,
    @Body() createFriendshipDto: CreateFriendshipDto,
  ) {
    const userId = request.user.userId;

    return await this.friendshipService.createFriendship(
      userId,
      createFriendshipDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get Friendships',
    description: 'Get all friendships',
    parameters: [
      {
        name: 'page',
        in: 'query',
        required: false,
        description: 'Page number',
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Number of friendships per page',
      },
    ],
    responses: {
      200: { description: 'Friendships found' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized' },
    },
  })
  async getFriendships(
    @Request() request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const userId = request.user.userId;

    return await this.friendshipService.getFriendshipByUserId(userId, {
      page,
      limit,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Friendship',
    description: 'Update a friendship by its ID',
    parameters: [
      {
        name: 'id',
        description: 'The ID of the friendship',
        in: 'path',
        required: true,
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: Object.values(FriendshipStatus),
              },
            },
          },
        },
      },
    },
    responses: {
      200: { description: 'The friendship has been successfully updated' },
      400: { description: 'Invalid ID' },
      401: { description: 'Unauthorized' },
      404: { description: 'Friendship not found' },
    },
  })
  async updateFriendship(
    @Param('id') id: string,
    @Body() updateFriendship: { status: FriendshipStatus },
  ) {
    await this.friendshipService.getFriendshipById(id);

    return await this.friendshipService.updateFriendshipStatus(
      id,
      updateFriendship.status,
    );
  }
}
