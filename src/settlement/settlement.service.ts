import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios'
import { ConvertDto } from './dto/convert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MerchantModel } from 'src/merchant/entities/merchant.entity';
import { Model } from 'mongoose';

@Injectable()
export class SettlementService {
    private readonly logger = new Logger(SettlementService.name)

    constructor(
        @InjectModel(MerchantModel.name) private merchantModel: Model<MerchantModel>
    ) { }

    async convertCryptoToFiat(convertDto: ConvertDto) {
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${convertDto.cryptoCurrency}&vs_currencies=${convertDto.fiatCurrency}`);
            const rate = response.data[convertDto.cryptoCurrency][convertDto.fiatCurrency];
            return convertDto.cryptoAmount * rate;
        }
        catch (error) {
            this.logger.log(`Error converting to fiat: ${error.message}`)
        }
    }

    async convertToCryptoaAndCreditMerchant(merchantId: string, convertDto: ConvertDto) {
        try {
            const merchant = await this.merchantModel.findOne({ _id: merchantId }).exec()
            if (!merchant) {
                throw new NotFoundException('Merchant account not found')
            }
            const fiatAmount = await this.convertCryptoToFiat(convertDto)
            return await merchant.updateOne({ $inc: { accountBalance: fiatAmount } }, { new: true }).exec()
        }
        catch (error) {
            this.logger.log(error.message)
        }
    }
}
