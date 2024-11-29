import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../schemas/profile.schemas';
import * as fs from 'fs';
import * as path from 'path';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  getProfileByUserId(userId: string): Promise<Profile> {
    const isValidId = mongoose.Types.ObjectId.isValid(userId);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const profile = this.profileModel.findOne({ user_id: userId });
    if (!profile)
      throw new NotFoundException('Profile not found. Try creating one.');

    return profile;
  }

  async getProfileById(id: string): Promise<Profile> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const profile = await this.profileModel.findById(id);
    if (!profile)
      throw new NotFoundException('Profile not found. Try creating one.');

    return profile;
  }

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    const profileExists = this.getProfileByUserId(createProfileDto.user_id);
    if (profileExists)
      throw new BadRequestException('Profile already exists for this user');

    const createdProfile = new this.profileModel(createProfileDto);
    return createdProfile.save();
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.getProfileById(id);

    if (updateProfileDto.photo && profile.photo) {
      const oldPhotoPath = path.join(__dirname, '../../uploads', profile.photo);
      fs.unlinkSync(oldPhotoPath);
    }

    const updatedProfile = await this.profileModel.findByIdAndUpdate(
      id,
      updateProfileDto,
      { new: true },
    );

    return updatedProfile;
  }
}
