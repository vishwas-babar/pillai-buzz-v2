import { uuid, text, timestamp } from "drizzle-orm/pg-core"
import { authSchema } from "./schemas"
import { timestamps } from "./columns.helper"
import { users } from "./users.schema"
import { relations } from "drizzle-orm"

export const refreshTokens = authSchema.table("refresh_tokens", {
   id: uuid().primaryKey().defaultRandom(),
   token_hash: text().notNull(),
   expiresAt: timestamp().notNull(),
   userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
   ...timestamps,
})

export const refreshTokensRelations = relations(
   refreshTokens,
   ({ one }) => ({
      user: one(users, {
         fields: [refreshTokens.userId],
         references: [users.id],
      }),
   }),
)
