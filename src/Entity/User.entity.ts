import { Types } from "mongoose";
import validator from "validator";
import { User } from "../Model/User.model";
import dbConnect from "../utils/dbConnect";

export default class UserEntity {
    // Validation function
    async validate?() {
        // Connect to the database
        await dbConnect()

        if (!validator.isEmail(this.email)) throw new Error("user/email/invalid-email")

        if (!validator.isStrongPassword(this.password)) throw new Error("user/password/weak-password")

        if (!this._id) {
            // Verify if the username is already in use
            if ((await User.find({ _id: { $ne: this._id }, username: this.username }).exec()).length > 0)
                throw new Error("user/username-already-exist")

            // Verify if the email is already in use
            if ((await User.find({ _id: { $ne: this._id }, email: this.email }).exec()).length > 0)
                throw new Error("user/email-already-exist")
        }
    }

    constructor(
        readonly _id: Types.ObjectId,
        readonly username: string,
        readonly email: string,
        public password: string,
        readonly profilePicture: string,
        readonly about: string,
        readonly link: string,
        readonly active: boolean,
        readonly role: string,
    ) { };
}