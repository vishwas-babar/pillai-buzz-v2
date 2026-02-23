import {
   pgTable,
   uuid,
   text,
   timestamp,
   pgEnum,
   varchar,
   primaryKey,
   pgSchema,
} from "drizzle-orm/pg-core"
import { authSchema } from "./schemas"
import { timestamps } from "./columns.helper"
import { uniqueIndex } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { refreshTokens } from "./refreshTokens.schema"

export const rolesEnum = pgEnum("roles", [
   "member",
   "contributor",
   "admin",
])

export const users = authSchema.table(
   "users",
   {
      id: uuid().defaultRandom().primaryKey(),
      userID: varchar({ length: 64 }).notNull().unique(),
      email: varchar({ length: 256 }).notNull().unique(),
      name: varchar({ length: 512 }),
      password: varchar({ length: 255 }).notNull(),
      avatarKey: varchar({ length: 512 }),
      bio: varchar({ length: 512 }),
      role: rolesEnum().default("member").notNull(),
      ...timestamps,
   },
   table => [
      uniqueIndex("user_id_idx").on(table.userID),
      uniqueIndex("email_idx").on(table.email),
   ],
)

export const usersRelations = relations(users, ({ many }) => ({
   refreshTokens: many(refreshTokens),
}))
