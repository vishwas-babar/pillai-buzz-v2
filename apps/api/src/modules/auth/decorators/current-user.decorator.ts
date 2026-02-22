import { createParamDecorator } from "@nestjs/common"

export const CurrentUser = createParamDecorator(
   (_, ctx) => ctx.switchToHttp().getRequest().user,
)
