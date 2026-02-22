import { Injectable } from "@nestjs/common"
import { testValidation } from "@pillaibuzz/validation"
import { db, users } from "@pillaibuzz/db"
@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    try {
      const isValid = testValidation("hello")
      const res = await db.select().from(users)

      console.log(res)
      return "users fetched"
    } catch (error) {
      console.log("failed to get users", error)
      return "failed to get users"
    }
  }
}
