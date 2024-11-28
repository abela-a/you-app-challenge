import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ApiResponse, ApiSecurity } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The list of all users',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const findUser = this.userService.getUserById(id);
    if (!findUser) throw new NotFoundException('User not found');

    return findUser;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const findUser = this.userService.getUserById(id);
    if (!findUser) throw new NotFoundException('User not found');

    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id') id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const findUser = this.userService.getUserById(id);
    if (!findUser) throw new NotFoundException('User not found');

    this.userService.deleteUser(id);
    return;
  }
}
