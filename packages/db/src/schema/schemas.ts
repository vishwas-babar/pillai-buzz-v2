import { pgSchema } from "drizzle-orm/pg-core"

export const authSchema = pgSchema("auth")
export const socialSchema = pgSchema("social")
export const activitySchema = pgSchema("activity")
