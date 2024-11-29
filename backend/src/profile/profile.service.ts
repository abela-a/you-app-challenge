import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../app/schemas/profile.schemas';
import * as fs from 'fs';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async getProfileByUserId(userId: string): Promise<Profile> {
    const isValidId = mongoose.Types.ObjectId.isValid(userId);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const profile = await this.profileModel.findOne({ user_id: userId });
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

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const profile = await this.profileModel.findOne({ user_id: userId });

    if (profile)
      throw new BadRequestException('Profile already exists for this user');

    createProfileDto.user_id = userId;

    const createdProfile = new this.profileModel(createProfileDto);

    return createdProfile.save();
  }

  async updateProfileByUserId(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);

    if (updateProfileDto.photo && profile.photo) {
      try {
        fs.unlinkSync(profile.photo);
      } catch {}
    }

    updateProfileDto.user_id = userId;

    const updatedProfile = await this.profileModel.findOneAndUpdate(
      { user_id: userId },
      updateProfileDto,
      { new: true },
    );

    return updatedProfile;
  }
}
