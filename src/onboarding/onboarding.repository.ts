import { EntityRepository, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { CustomException } from "./exceptions/custom.exception";

@EntityRepository(User)
export class UserRespository extends Repository<User>{

    constructor(private jwtService: JwtService) {
        super()
    }
    async  resetPassword(email: string, password: string): Promise<User> {
        const user = await this.findUserByEmail(email);
        user.salt = await bcrypt.genSaltSync();
        user.password = await bcrypt.hashSync(password, user.salt);
        user.save();
        return user;
    }

    async registerUser(user: User, password: string): Promise<void> {
        user.salt = await bcrypt.genSaltSync();
        user.password = await bcrypt.hashSync(password, user.salt);
        user.save();
    }

    async signInUser(email: string, password: string): Promise<User> {
        var user = await this.findOne({ email: email });
        if (!user || ! await this.PasswordIdValid(user, password))
            throw new CustomException("email or password incorrect.")

        return user;
    }

    private async PasswordIdValid(user: User, password: string) {
        var hash = await bcrypt.hashSync(password, user.salt);
        return hash == user.password;
    }

    async findUserByEmail(email: string) {
        return await this.findOne({ email: email });
    }

}