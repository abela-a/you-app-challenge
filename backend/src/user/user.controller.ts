import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create User',
    description: 'Create a new user with the data provided',
    responses: {
      201: { description: 'The user has been successfully created' },
      401: { description: 'Unauthorized' },
    },
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Users',
    description: 'Get all users',
    responses: {
      200: { description: 'The users have been successfully found' },
      401: { description: 'Unauthorized' },
    },
  })
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get User by ID',
    description: 'Get a user by their ID',
    responses: {
      200: { description: 'The user has been successfully found' },
      400: { description: 'Invalid ID' },
      401: { description: 'Unauthorized' },
      404: { description: 'User not found' },
    },
  })
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update User',
    description: 'Update a user by their ID',
    responses: {
      200: { description: 'The user has been successfully updated' },
      400: { description: 'Invalid ID' },
      401: { description: 'Unauthorized' },
      404: { description: 'User not found' },
    },
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.getUserById(id);

    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete User',
    description: 'Delete a user by their ID',
    responses: {
      200: { description: 'The user has been successfully deleted' },
      400: { description: 'Invalid ID' },
      401: { description: 'Unauthorized' },
      404: { description: 'User not found' },
    },
  })
  async deleteUser(@Param('id') id: string) {
    await this.userService.getUserById(id);
    await this.userService.deleteUser(id);

    return;
  }
}
