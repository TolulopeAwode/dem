export class GetTokenCommand {
    constructor(
        public email: string,
        public password: string) { }
}

export class RegisterCommand {

    constructor(public firstName: string,
        public lastName: string, public email: string,
        public verificationCode: string, public password: string) { }
}

export class SendVerifyEmailCodeCommand {
    constructor(public email: string) { }
}

export class ForgotPasswordCommand {
    constructor(public email: string) { }
}

export class ResetPasswordCommand {
    constructor(public email: string,
        public verificationCode: string,
        public password: string) { }
}