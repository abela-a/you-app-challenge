import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  @ApiOperation({
    summary: 'Send a message',
    description: 'Send a message to a user',
    responses: {
      201: { description: 'Message sent' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized' },
    },
  })
  async sendMessage(@Request() request, @Body() sendMessage: SendMessageDto) {
    const sender = request.user.userId;

    return this.messageService.sendMessage({ ...sendMessage, sender });
  }

  @Get()
  @ApiOperation({
    summary: 'Get messages',
    description: 'Get messages between two users',
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
        description: 'Number of messages per page',
      },
      {
        name: 'receiver',
        in: 'query',
        required: true,
        description: 'Receiver of the message',
      },
    ],
    responses: {
      200: { description: 'Messages found' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized' },
    },
  })
  async getMessages(
    @Request() request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('receiver') receiver: string,
  ) {
    const sender = request.user.userId;

    return this.messageService.getMessages({ page, limit, sender, receiver });
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Edit a message',
    description: 'Edit a message content',
    responses: {
      200: { description: 'Message updated' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized' },
    },
  })
  async updateMessage(
    @Param('id') id: string,
    @Body() editMessage: EditMessageDto,
  ) {
    return await this.messageService.editMessage(id, {
      content: editMessage.content,
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a message',
    description: 'Delete a message by its ID',
    responses: {
      200: { description: 'Message deleted' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized' },
    },
  })
  async deleteMessage(@Param('id') id: string) {
    await this.messageService.deleteMessage(id);
    return;
  }
}
