import { Injectable } from "@nestjs/common"
import { db, refreshTokens } from "@pillaibuzz/db"


@Injectable()
export class RefreshTokensRepository {
  async storeRefreshToken({
    id,
    token_hash,
    expiresAt,
  }: {
    id: string
    token_hash: string
    expiresAt: Date
  }) {
    db.insert(refreshTokens).values({
      userId: id,
      token_hash,
      expiresAt,
    })
  }
}
