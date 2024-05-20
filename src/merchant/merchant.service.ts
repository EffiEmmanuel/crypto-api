import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MerchantModel } from './entities/merchant.entity';
import { Model } from 'mongoose';
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginMerchantDto } from './dto/login-merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(MerchantModel.name) private merchantModel: Model<MerchantModel>,
    private jwtSvc: JwtService,
    private configSvc: ConfigService
  ) { }


  async createMerchant(createMerchantDto: CreateMerchantDto): Promise<MerchantModel> {
    try {
      const { email, fullName, password } = createMerchantDto
      if (!fullName || !email || !password) {
        throw new BadRequestException('Please fill all fields')
      }
      const merchant = await this.merchantModel.findOne({ email: createMerchantDto.email }).exec()
      if (merchant) {
        throw new ConflictException('Merchant with this email already exists, please sign in')
      }
      const hash = await argon.hash(password)
      const newMerchant = new this.merchantModel({
        fullName,
        email,
        password: hash
      })
      await newMerchant.save()
      return newMerchant
    }
    catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      else if (error instanceof ConflictException) {
        throw error
      }
      else {
        throw error.message
      }
    }

  }

  async logIn(logInDto: LoginMerchantDto) {
    try {
      const merchant = await this.merchantModel.findOne({ email: logInDto.email })
      if (!merchant) {
        throw new NotFoundException("Email incorrect or does not exist")
      }
      const pwMatches = await argon.verify(merchant.password, logInDto.password)
      if (!pwMatches) {
        throw new ForbiddenException("Password incorrect")
      }
      delete merchant.password
      return await this.signToken(merchant._id, merchant.email, merchant.fullName)
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      if (error instanceof ForbiddenException) {
        throw error
      }
      else {
        throw error.message
      }
    }
  }

  async findAll(): Promise<MerchantModel[]> {
    try {
      return await this.merchantModel.find();
    }
    catch (error) {
      throw error.message
    }
  }

  async findOne(id: string): Promise<MerchantModel> {
    try {
      const merchant = await this.merchantModel.findOne({ _id: id }).exec()
      if (!merchant) {
        throw new NotFoundException('Merchant does not exist')
      }
      return merchant
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      else {
        throw error.message
      }
    }
  }

  async update(id: string, updateMerchantDto: UpdateMerchantDto): Promise<MerchantModel> {
    try {
      const merchant = await this.merchantModel.findOne({ _id: id }).exec()
      if (!merchant) {
        throw new NotFoundException('Merchant does not exist')
      }
      const updatedMerchant = await merchant.updateOne(updateMerchantDto, { new: true }).exec()
      return updatedMerchant
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      else {
        throw error.message
      }
    }

  }

  async remove(id: string) {
    try {
      const merchant = await this.merchantModel.findOne({ _id: id }).exec()
      if (!merchant) {
        throw new NotFoundException('Merchant does not exist')
      }
      return merchant.deleteOne().exec()
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      else {
        throw error.message
      }
    }

  }

  private async signToken(userId: any, email: string, fullName: string): Promise<{ access_token: string }> {
    const payload = {
      userId, email, fullName
    }
    const secret = this.configSvc.get<string>('JWT_SECRET')

    const token = await this.jwtSvc.signAsync(payload, { expiresIn: '30m', secret: secret })

    return {
      access_token: token
    }
  }
}
