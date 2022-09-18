import { httpErrors } from "https://deno.land/x/oak/mod.ts";
import { AuthUser, Context, UserRole } from "../types.ts";

/**
 * has user role middleware
 * checks authorization for context user, user roles
 */
const userGuard = (roles?: UserRole | UserRole[]) => {
    return async (ctx: Context, next: () => Promise<void>) => {
        const { user } = ctx;
        if (!user) {
            throw new httpErrors.Unauthorized("Unauthorized user");
        }

        if (roles) {
            const isRoleMatched = hasUserRole(user, roles);
            if (!isRoleMatched) {
                throw new httpErrors.Forbidden("Forbidden user role");
            }
        }

        await next();
    };
};

const hasUserRole = (user: AuthUser, roles: UserRole | UserRole[]) => {
    const userRoles = user.roles.split(",")
        .map((role) => role.trim());
    
    if (typeof (roles) == "string") {
        roles = [roles];
    }

    let isRoleMatched = false;
    roles.forEach((role) => {
        if (userRoles.includes(role)) {
            isRoleMatched = true;
        }
    });

    return isRoleMatched;
};

export { userGuard };