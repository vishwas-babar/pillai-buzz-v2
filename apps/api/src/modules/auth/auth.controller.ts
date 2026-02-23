import {
   Body,
   Controller,
   Get,
   Post,
   UseGuards,
} from "@nestjs/common"

import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { CurrentUser } from "./decorators/current-user.decorator"
import { JwtPayload } from "./interfaces/jwt-payload.interface"
import { LoginDto } from "./dto/login.dto"
import { refreshTokenDto } from "./dto/refreshToken.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

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
   refreshToken(@Body() body: refreshTokenDto) {
      return this.authService.refreshToken(body)
   }

   @Get("test")
   @UseGuards(JwtAuthGuard)
   test(@CurrentUser() user: JwtPayload) {
      return user
   }
}
