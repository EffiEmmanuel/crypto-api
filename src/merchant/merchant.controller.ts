import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { LoginMerchantDto } from './dto/login-merchant.dto';
import { ConvertDto } from 'src/settlement/dto/convert.dto';
import { SettlementService } from 'src/settlement/settlement.service';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService, private readonly settleSvc: SettlementService) { }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMerchantDto: CreateMerchantDto) {
    return await this.merchantService.createMerchant(createMerchantDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() logInDto: LoginMerchantDto) {
    return await this.merchantService.logIn(logInDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.merchantService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.merchantService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto) {
    return this.merchantService.update(id, updateMerchantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.merchantService.remove(id);
  }

  @Post('exchange-rates')
  @HttpCode(HttpStatus.OK)
  async exchange(@Body() converDto: ConvertDto) {
    return await this.settleSvc.convertCryptoToFiat(converDto)
  }

  @Post('deposit-crypto-to-fiat/:merchantId')
  @HttpCode(HttpStatus.OK)
  async deposit(@Param('merchantId') merchantId: string, @Body() convertDto: ConvertDto) {
    return await this.settleSvc.convertToCryptoaAndCreditMerchant(merchantId, convertDto)
  }
}
