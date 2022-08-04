import { Types } from "mongoose";
import validator from "validator";
import { User } from "../Model/User.model";
import dbConnect from "../utils/dbConnect";

export default class UserEntity {
    readonly _id?: Types.ObjectId;

    readonly username: string;

    readonly role?: string;

    readonly email: string;

    readonly profilePicture?: string;

    readonly link: string;

    password: string;

    readonly active: boolean;

    // Validation function
    async validate?() {
        // Connect to the database
        await dbConnect()

        if (!validator.isEmail(this.email)) throw new Error("user/email/invalid-email")

        if (!validator.isStrongPassword(this.password)) throw new Error("user/password/weak-password")

        if (!this._id) {
            // Verify if the username is already in use
            if ((await User.find({ _id: { $ne: this._id }, username: this.username }).exec()).length > 0)
                throw new Error("users/username-already-exist")

            // Verify if the email is already in use
            if ((await User.find({ _id: { $ne: this._id }, email: this.email }).exec()).length > 0)
                throw new Error("users/email-already-exist")
        }
    }

    constructor({ _id, username, email, profilePicture, password, link, active, role }: UserEntity) {
        this._id = _id;
        this.link = link;
        this.role = role;
        this.email = email;
        this.active = active ?? false;
        this.username = username;
        this.password = password;
        this.profilePicture = profilePicture;
    }
}