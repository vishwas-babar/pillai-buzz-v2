import { Body, Controller, Get, Post } from "@nestjs/common"

import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { CurrentUser } from "./decorators/current-user.decorator"
import { JwtPayload } from "./interfaces/jwt-payload.interface"

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() body: RegisterDto) {
    return this.authService.register(body)
  }

  @Get("test")
  test(@CurrentUser() user: JwtPayload) {
    console.log("got following user: ", user)
    return user
  }
}
