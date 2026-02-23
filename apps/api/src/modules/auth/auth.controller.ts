import { Body, Controller, Get, Post } from "@nestjs/common"

import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { CurrentUser } from "./decorators/current-user.decorator"
import { JwtPayload } from "./interfaces/jwt-payload.interface"
import { LoginDto } from "./dto/login.dto"
import { refreshTokenDto } from "./dto/refreshToken.dto"

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

   @Post("login")
   login(@Body() body: LoginDto) {
      return this.authService.login(body)
   }

   @Post("refresh-token")
   refreshToken(
      @Body() body: refreshTokenDto,
      @CurrentUser() user: JwtPayload,
   ) {
      return this.authService.refreshToken(body, user.sub)
   }

   @Get("test")
   test(@CurrentUser() user: JwtPayload) {
      console.log("got following user: ", user)
      return user
   }
}
