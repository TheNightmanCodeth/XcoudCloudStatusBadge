class PasswordError extends Error {
    message = ''

    constructor(msg: string) {
        super();
        this.message = msg;
    }
}

export class PasswordVerificationError extends PasswordError {}