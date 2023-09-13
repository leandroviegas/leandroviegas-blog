import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "@Models/User.model";
import ConnectDB from "@utils/ConnectDB";
import UserEntity from "@Entity/User.entity";

interface IAuthenticateRequest {
    usernameOrEmail: string;
    password: string;
}

class AuthenticateUserService {
    async execute({ usernameOrEmail, password }: IAuthenticateRequest) {
        if (!usernameOrEmail || !password) throw new Error("authentication/email-password-incorrect");

        // Connecting to the database
        await ConnectDB()

        let user = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] }).select("_id username email profilePicture password role").exec();

        if (!user) throw new Error("authentication/email-password-incorrect");

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) throw new Error("authentication/email-password-incorrect");

        const token = sign(
            { email: user.email, role: user.role },
            `${process.env.JSONWEBTOKEN_DECODE_KEY}`,
            { subject: user.id, expiresIn: "30d" }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role
            }
        };
    }

    async GoogleAuth({ email, displayName, picture }: { email: string, displayName: string, picture: string }) {
        if (!email) throw new Error("authentication/email-password-incorrect");

        // Connecting to the database
        await ConnectDB()

        let user = await User.findOne({ email }).select("_id username email profilePicture password role").exec();

        if (!user) {
            const { username, password, profilePicture, about, link, github, linkedin, active, role } =
            {
                about: "",
                github: "",
                linkedin: "",
                username: displayName,
                password: "",
                profilePicture: picture,
                link: encodeURIComponent(displayName),
                active: true,
                role: "user"
            };

            const userEntity = new UserEntity(undefined, username, email, password, profilePicture, about, link, github , linkedin, active, role);

            user = await User.create(userEntity);
        };

        const token = sign(
            { email: user.email, role: user.role },
            `${process.env.JSONWEBTOKEN_DECODE_KEY}`,
            { subject: user.id, expiresIn: "30d" }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role
            }
        };
    }
}

export { AuthenticateUserService };