import { CreateUser } from "./create-user.ts"
import { UserRole } from "./user-role.ts"

export type UserInfo = CreateUser & {
    roles: [UserRole]
}