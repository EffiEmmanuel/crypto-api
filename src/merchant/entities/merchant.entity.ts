import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ timestamps: true, collection: 'Merchant' })
export class MerchantModel {
    @Prop({ type: String, required: true })
    fullName: string

    @Prop({ type: String, required: true })
    email: string

    @Prop({ type: String, required: true })
    password: string

    @Prop({ type: Number, default: 0 })
    accountBalance: number
}

export const MerchantSchema = SchemaFactory.createForClass(MerchantModel);
