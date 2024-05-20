import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class ConvertDto {
    @ApiProperty({ type: Number, required: true })
    @IsNumber()
    @IsNotEmpty()
    cryptoAmount: number

    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    cryptoCurrency: string

    @ApiProperty({ type: String, required: true })
    @IsString()
    @IsNotEmpty()
    fiatCurrency: string


}