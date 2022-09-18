import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const encrypt = async (password: string) => {
    return await bcrypt.hash(password);
};

const compare = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export { encrypt, compare };