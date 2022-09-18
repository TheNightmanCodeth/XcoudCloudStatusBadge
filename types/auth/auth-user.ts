import { UserRole } from "../user/user-role.ts";

export type AuthUser = {
    id: number;
    email: string;
    username: string;
    roles: string;
}