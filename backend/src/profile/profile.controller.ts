import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Express } from 'express';

import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  multerPhotosConfig,
  multerPhotosOptions,
} from '../config/multer-photo.config';
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', multerPhotosOptions))
  @ApiOperation({
    summary: 'Create profile',
    description: 'Create a new profile for user',
    responses: {
      201: { description: 'Profile created' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized' },
    },
  })
  @ApiConsumes('multipart/form-data')
  async createProfile(
    @Request() request,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user.userId;

    if (file) {
      const dest = multerPhotosConfig.dest.replace('./', '');
      createProfileDto.photo = `${dest}/${file.filename}`;
    }

    return this.profileService.createProfile(userId, createProfileDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get profile by user ID',
    description: 'Get user profile by user ID',
    responses: {
      200: { description: 'Profile found' },
      404: { description: 'Profile not found. Try creating one' },
    },
  })
  async getProfileByUserId(@Request() request) {
    const userId = request.user.userId;

    return this.profileService.getProfileByUserId(userId);
  }

  @Put()
  @UseInterceptors(FileInterceptor('photo', multerPhotosOptions))
  @ApiOperation({
    summary: 'Update profile',
    description: 'Update user profile by ID',
    responses: {
      200: { description: 'Profile updated' },
      400: { description: 'Bad request' },
      401: { description: 'Unauthorized' },
      404: { description: 'Profile not found. Try creating one' },
    },
  })
  @ApiConsumes('multipart/form-data')
  async updateProfile(
    @Request() request,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user.userId;

    if (file) {
      const dest = multerPhotosConfig.dest.replace('./', '');
      updateProfileDto.photo = `${dest}/${file.filename}`;
    }

    return this.profileService.updateProfileByUserId(userId, updateProfileDto);
  }
}
