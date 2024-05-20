import { ExecutionContext, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const user = request.user
        return data ? user?.[data] : user
    }
)