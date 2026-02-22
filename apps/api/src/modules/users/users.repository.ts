import { Injectable } from "@nestjs/common"
import { db, users } from "@pillaibuzz/db"
import { and, eq, getTableColumns, SQL } from "drizzle-orm"

import { RegisterDto } from "../auth/dto/register.dto"

@Injectable()
export class UsersRepository {
  async findBy({ id, email, userID }: { id?: string; email?: string; userID?: string }) {
    const filters: SQL[] = []
    if (id) filters.push(eq(users.id, id))
    if (email) filters.push(eq(users.email, email))
    if (userID) filters.push(eq(users.userID, userID))

    return await db
      .select()
      .from(users)
      .where(and(...filters))
  }

  async createNewUser({ email, name, password, avatar, userID }: RegisterDto) {
    const { password: _password, ...safeUserColumns } = getTableColumns(users)

    return await db
      .insert(users)
      .values({
        email,
        name,
        password,
        avatarKey: avatar,
        userID,
      })
      .returning(safeUserColumns)
  }
}
