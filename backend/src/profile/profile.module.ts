import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../app/schemas/profile.schemas';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerPhotosOptions } from '../app/config/multer-photo.config';
import { ZodiacModule } from '../zodiac/zodiac.module';
import { HoroscopeModule } from '../horoscope/horoscope.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MulterModule.register(multerPhotosOptions),
    ZodiacModule,
    HoroscopeModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
