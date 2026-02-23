import { randomBytes } from "crypto"

import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from "@nestjs/common"
import bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"

import { UsersRepository } from "../users/users.repository"
import { RegisterDto } from "./dto/register.dto"
import { JwtPayload, Role } from "./interfaces/jwt-payload.interface"
import { RefreshTokensRepository } from "./refreshTokens.repository"
import { LoginDto } from "./dto/login.dto"
import { refreshTokenDto } from "./dto/refreshToken.dto"

@Injectable()
export class AuthService {
   constructor(
      private usersRepository: UsersRepository,
      private refreshTokensRepository: RefreshTokensRepository,
      private jwtService: JwtService,
   ) {}

   async register(data: RegisterDto) {
      const { email, password, userID } = data

      const existingWithEmail = await this.usersRepository.findBy({
         email,
      })

      if (existingWithEmail)
         throw new BadRequestException("Email already registered")

      const existingWithUserId = await this.usersRepository.findBy({
         userID,
      })

      if (existingWithUserId)
         throw new BadRequestException("UserID already registered")

      const hashedPassword = await bcrypt.hash(password, 10)

      const [createdUser] = await this.usersRepository.createNewUser({
         ...data,
         password: hashedPassword,
      })

      if (!createdUser)
         throw new InternalServerErrorException(
            "Failed to create user",
         )

      const { accessToken, refreshToken } =
         await this.getRefreshAccessTokens({
            id: createdUser.id,
            role: createdUser.role,
         })

      return { user: createdUser, accessToken, refreshToken }
   }

   async login(data: LoginDto) {
      const { email, password } = data

      const user = await this.usersRepository.findByWithPassword({
         email,
      })

      if (!user)
         throw new NotFoundException(
            "No user found with provide email",
         )

      const { password: passwordHash, ...userWithoutPwd } = user
      const passwordMatch = await bcrypt.compare(
         password,
         passwordHash,
      )

      if (!passwordMatch)
         throw new BadRequestException("Wrong password!")

      const { accessToken, refreshToken } =
         await this.getRefreshAccessTokens({
            id: user.id,
            role: user.role,
         })

      return {
         accessToken,
         refreshToken,
         user: userWithoutPwd,
      }
   }

   async refreshToken(data: refreshTokenDto) {
      const [refreshTokenRecordIndb] =
         await this.refreshTokensRepository.findBy({
            token_hash: data.refreshToken,
            expiresAt: new Date(),
         })

      if (!refreshTokenRecordIndb)
         throw new NotFoundException(
            "Refreshtoken not found or expired",
         )

      const user = await this.usersRepository.findBy({
         id: refreshTokenRecordIndb.userId,
      })
      if (!user) throw new NotFoundException("Current User not found")
      const { refreshToken, accessToken } =
         await this.rotateAccessRefreshToken(data.refreshToken, {
            id: user.id,
            role: user.role,
         })
      return { refreshToken, accessToken, user }
   }

   private async rotateAccessRefreshToken(
      oldRefreshToken: string,
      { id, role }: { id: string; role: Role },
   ) {
      const { accessToken, refreshToken } =
         await this.getRefreshAccessTokens({ id, role })

      await this.refreshTokensRepository.deleteAccessTokenByTokenHash(
         oldRefreshToken,
      )
      return { accessToken, refreshToken }
   }

   private async getRefreshAccessTokens({
      id,
      role,
   }: {
      id: string
      role: Role
   }) {
      return {
         refreshToken: await this.generateRefreshToken(id),
         accessToken: this.generateAccessToken({ sub: id, role }),
      }
   }

   private generateAccessToken(payload: JwtPayload) {
      return this.jwtService.sign(payload)
   }

   private getExpiresAtForRefreshToken(): Date {
      const expiryInDays = Number(process.env.JWT_REFRESH_EXPIRY)
      const expiredAt = new Date()
      expiredAt.setDate(expiredAt.getDate() + expiryInDays)
      return expiredAt
   }

   private async generateRefreshToken(id: string) {
      const refreshToken = randomBytes(64).toString("hex")
      await this.refreshTokensRepository.storeRefreshToken({
         id,
         token_hash: refreshToken,
         expiresAt: this.getExpiresAtForRefreshToken(),
      })
      return refreshToken
   }
}
