import { rolesEnum } from "@pillaibuzz/db"

export type Role = (typeof rolesEnum.enumValues)[number]

export interface JwtPayload {
  sub: string
  role: Role
}
