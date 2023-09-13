import { Types } from "mongoose";
import validator from "validator";
import { User } from "@Models/User.model";
import ConnectDB from "@utils/ConnectDB";

export default class UserEntity {
    // Validation function
    async validate?({ignorePassword: ignorePassword = false} = {}) {
        // Connect to the database
        await ConnectDB()

        if (!validator.isEmail(this.email)) throw new Error("user/email/invalid-email")

        if (!validator.isStrongPassword(this.password) && !ignorePassword) throw new Error("user/password/weak-password")

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
        readonly github: string,
        readonly linkedin: string,
        readonly active: boolean,
        readonly role: string,
    ) { };
}