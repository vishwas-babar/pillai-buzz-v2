import { randomBytes } from "crypto"

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common"
import bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"

import { UsersRepository } from "../users/users.repository"
import { RegisterDto } from "./dto/register.dto"
import { JwtPayload, Role } from "./interfaces/jwt-payload.interface"
import { RefreshTokensRepository } from "../users/refreshTokens.repository"

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokensRepository: RefreshTokensRepository,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const { email, password, userID, name, avatar } = data

    const existingWithEmail = await this.usersRepository.findBy({ email })

    if (existingWithEmail.length)
      throw new BadRequestException("Email already registered")

    const existingWithUserId = await this.usersRepository.findBy({ userID })

    if (existingWithUserId.length)
      throw new BadRequestException("UserID already registered")

    const hashedPassword = await bcrypt.hash(password, 10)

    const [createdUser] = await this.usersRepository.createNewUser({
      ...data,
      password: hashedPassword,
    })

    if (!createdUser) throw new InternalServerErrorException("Failed to create user")

    const { accessToken, refreshToken } = await this.getRefreshAccessTokens({
      id: createdUser.id,
      role: createdUser.role,
    })

    return { user: createdUser, accessToken, refreshToken }
  }

  private async getRefreshAccessTokens({ id, role }: { id: string; role: Role }) {
    return {
      refreshToken: this.generateRefreshToken(id),
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
  }
}
