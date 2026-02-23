import { Injectable } from "@nestjs/common"
import { db, refreshTokens } from "@pillaibuzz/db"
import { and, eq, SQL, lt } from "drizzle-orm"

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

   async findBy({
      token_hash,
      userID,
      expiresAt,
   }: {
      token_hash?: string
      userID?: string
      expiresAt?: Date
   }) {
      const filters: SQL[] = []
      if (token_hash)
         filters.push(eq(refreshTokens.token_hash, token_hash))
      if (expiresAt)
         filters.push(lt(refreshTokens.expiresAt, expiresAt))
      if (userID) filters.push(eq(refreshTokens.userId, userID))
      return db
         .select()
         .from(refreshTokens)
         .where(and(...filters))
   }

   async deleteAccessTokenByTokenHash(token_hash: string) {
      await db
         .delete(refreshTokens)
         .where(eq(refreshTokens.token_hash, token_hash))
   }
}
