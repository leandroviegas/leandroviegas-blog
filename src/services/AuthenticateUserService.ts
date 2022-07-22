import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "../Model/UserModel";
import dbConnect from "../utils/dbConnect";

interface IAuthenticateRequest {
    usernameOrEmail: string;
    password: string;
}

class AuthenticateUserService {
    async execute({ usernameOrEmail, password }: IAuthenticateRequest) {
        if (!usernameOrEmail || !password) throw new Error("authentication/email-password-incorrect");

        // Connecting to the database
        await dbConnect()

        let user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] }).select("_id username email profilePicture password admin").exec();

        if (!user) throw new Error("authentication/email-password-incorrect");

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) throw new Error("authentication/email-password-incorrect");

        const token = sign(
            { email: user.email, admin: user.admin },
            process.env.JSONWEBTOKEN_DECODE_KEY,
            { subject: user.id, expiresIn: "30d" }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                admin: user.admin
            }
        };
    }
}

export { AuthenticateUserService };