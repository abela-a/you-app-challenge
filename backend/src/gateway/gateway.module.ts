import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { UserModule } from '../modules/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  providers: [GatewayService, JwtService],
  exports: [GatewayService],
})
export class GatewayModule {}
