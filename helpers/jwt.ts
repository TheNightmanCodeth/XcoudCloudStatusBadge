import { create, Payload, getNumericDate, Header, verify } from "https://deno.land/x/djwt/mod.ts";

const header: Header = {
    alg: "HS512",
    typ: "JWT",
}

const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
);

const getAuthToken = (user: any) => {
    const payload = {
        iss: "xcc-badger",
        name: user.name,
        email: user.email,
        roles: user.roles,
        exp: getNumericDate(60*10),
    };

    return create(header, payload, key);
};

const getRefreshToken = (user: any) => {
    const payload: Payload = {
        iss: "xcc-badger",
        email: user.email,
        exp: getNumericDate(60*60),
    };

    return create(header, payload, key);
}

const getJwtPayload = async (token: string): Promise<any | null> => {
    try {
        const jwtObject = await verify(token, key);
        if (jwtObject) {
            return jwtObject;
        }
    } catch (error) {
        console.log("Err: "+error);
    }
    return null;
};

export { getAuthToken, getRefreshToken, getJwtPayload };