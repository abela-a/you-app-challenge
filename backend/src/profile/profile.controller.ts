import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Express } from 'express';

import { FileUploadInterceptor } from '../interceptors/file-upload.interceptor';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get profile by user ID' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileByUserId(@Param('user_id') userId: string) {
    return this.profileService.getProfileByUserId(userId);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfileById(@Param('id') id: string) {
    return this.profileService.getProfileById(id);
  }

  @Post()
  @UseInterceptors(FileUploadInterceptor)
  @ApiOperation({ summary: 'Create profile' })
  @ApiResponse({ status: 201, description: 'Profile created' })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createProfileDto.photo = file.filename;
    }
    return this.profileService.createProfile(createProfileDto);
  }

  @Put(':id')
  @UseInterceptors(FileUploadInterceptor)
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateProfileDto.photo = file.filename;
    }
    return this.profileService.updateProfile(id, updateProfileDto);
  }
}
