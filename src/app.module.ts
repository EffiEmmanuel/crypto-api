import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MerchantModule } from './merchant/merchant.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configSvc: ConfigService) => {
        const uri = configSvc.get<string>('MONGODB_URI')
        return { uri: uri }
      },
      inject: [ConfigService],
      imports: [ConfigModule]
    }),
    JwtModule.register({ global: true }),
    MerchantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
