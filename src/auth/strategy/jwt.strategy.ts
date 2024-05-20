import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { MerchantModel } from "src/merchant/entities/merchant.entity";


@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configSvc: ConfigService,
        @InjectModel(MerchantModel.name) private merchantModel: Model<MerchantModel>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configSvc.get<string>('JWT_SECRET'),
            ignoreExpiration: false
        })
    }

    async validate(payload: { sub: any, email: string, fullName: string }) {
        this.merchantModel.findById({ _id: payload.sub })

        return payload
    }
}