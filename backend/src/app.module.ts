import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { HoroscopeModule } from './modules/horoscope/horoscope.module';
import { ZodiacModule } from './modules/zodiac/zodiac.module';
import { MessageModule } from './modules/message/message.module';
import { FriendshipModule } from './modules/friendship/friendship.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AuthModule,
    ProfileModule,
    HoroscopeModule,
    ZodiacModule,
    MessageModule,
    FriendshipModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
