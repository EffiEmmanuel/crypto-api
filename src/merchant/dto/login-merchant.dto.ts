import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"


export class LoginMerchantDto {
    @ApiProperty({ type: String, required: true })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ type: String, required: true, minLength: 5 })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({ minLength: 5, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string
}