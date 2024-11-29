import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { HoroscopeModule } from './horoscope/horoscope.module';
import { ZodiacModule } from './zodiac/zodiac.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AuthModule,
    ProfileModule,
    HoroscopeModule,
    ZodiacModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
