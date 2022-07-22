import { Types } from "mongoose";
import validator from "validator";
import { User } from "../Model/UserModel";
import dbConnect from "../utils/dbConnect";

export type UserModelT = {
    _id?: Types.ObjectId;
    username: string;
    email: string;
    profilePicture?: string;
    password: string;
    link: string;
    admin?: boolean;
    active: boolean;
};

class UserEntity {
    readonly _id?: Types.ObjectId;

    readonly username: string;

    readonly email: string;

    readonly profilePicture?: string;

    readonly link: string;

    password: string;

    readonly admin?: boolean;

    readonly active: boolean;

    // Validation function
    async validate() {
        // Connect to the database
        await dbConnect()

        if (!validator.isEmail(this.email)) throw new Error("user/email/invalid-email")

        if (!validator.isStrongPassword(this.password)) throw new Error("user/password/password-not-strong")

        if (!this._id) {
            // Verify if the username is already in use
            if ((await User.find({ _id: { $ne: this._id }, username: this.username }).exec()).length > 0)
                throw new Error("users/username-already-exist")

            // Verify if the email is already in use
            if ((await User.find({ _id: { $ne: this._id }, email: this.email }).exec()).length > 0)
                throw new Error("users/email-already-exist")
        }
    }

    constructor({ _id, username, email, profilePicture, password, link, admin, active }: Omit<UserModelT, "active"> & { _id?: string, active?: boolean }) {
        if (_id)
            this._id = new Types.ObjectId(_id);
        this.link = link;
        this.email = email;
        this.admin = admin;
        this.active = active ?? false;
        this.username = username;
        this.password = password;
        this.profilePicture = profilePicture;
    }
}

export default UserEntity;