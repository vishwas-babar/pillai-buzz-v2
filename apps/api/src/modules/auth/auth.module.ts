import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import type { JwtSignOptions } from "@nestjs/jwt"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { UsersModule } from "../users/users.module"
import { RefreshTokensRepository } from "./refreshTokens.repository"

type StringValue = Exclude<
   JwtSignOptions["expiresIn"],
   number | undefined
>

@Module({
   imports: [
      UsersModule,
      JwtModule.register({
         secret: process.env.JWT_SECRET,
         signOptions: {
            expiresIn: (process.env.JWT_ACCESS_EXPIRY ||
               "15m") as StringValue,
         },
      }),
   ],
   controllers: [AuthController],
   providers: [AuthService, JwtStrategy, RefreshTokensRepository],
   exports: [RefreshTokensRepository],
})
export class AuthModule {}
