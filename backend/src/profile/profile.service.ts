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
import { ZodiacService } from '../zodiac/zodiac.service';
import { HoroscopeService } from '../horoscope/horoscope.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private readonly zodiacService: ZodiacService,
    private readonly horoscopeService: HoroscopeService,
  ) {}

  async getProfileByUserId(userId: string): Promise<Profile> {
    const isValidId = mongoose.Types.ObjectId.isValid(userId);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const profile = await this.profileModel.findOne({ user: userId });
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

  private async setZodiacAndHoroscope(
    profileDto: CreateProfileDto | UpdateProfileDto,
  ): Promise<void> {
    if (!profileDto.zodiac) {
      const zodiac = await this.zodiacService.getZodiacByDate(
        profileDto.birthday.toISOString(),
      );
      profileDto.zodiac = zodiac.name;
    }

    if (!profileDto.horoscope) {
      const horoscope = this.horoscopeService.getHoroscopeByDate(
        profileDto.birthday.toISOString(),
      );
      profileDto.horoscope = horoscope.name;
    }
  }

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const profile = await this.profileModel.findOne({ user: userId });

    if (profile)
      throw new BadRequestException('Profile already exists for this user');

    createProfileDto.user = userId;
    await this.setZodiacAndHoroscope(createProfileDto);

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

    updateProfileDto.user = userId;
    await this.setZodiacAndHoroscope(updateProfileDto);

    const updatedProfile = await this.profileModel.findOneAndUpdate(
      { user: userId },
      updateProfileDto,
      { new: true },
    );

    return updatedProfile;
  }
}
