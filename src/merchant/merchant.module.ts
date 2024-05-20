import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';
import { JwtGuard, JwtStrategy } from 'src/auth';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MerchantModel, MerchantSchema } from './entities/merchant.entity';
import { SettlementService } from 'src/settlement/settlement.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MerchantModel.name, schema: MerchantSchema }]),
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [MerchantController],
  providers: [MerchantService, JwtGuard, JwtStrategy, SettlementService],
})
export class MerchantModule { }
