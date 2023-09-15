import { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import linkfy from "@utils/linkfy";
import { User } from "@Models/User.model";

let UserSchema = new Schema({
    username: {
        type: String, validate: {
            validator: (v) => v.length >= 3,
            message: () => "link/identifier-min-length-is-3"
        }, required: [true, "username/username-is-required"]
    },
    email: {
        type: String,
        validate: {
            validator: (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: () => `email/email-is-invalid`
        },
        required: [true, "email/email-is-required"], unique: true
    },
    about: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    ocupation: { type: String, default: "" },
    link: {
        type: String,
        required: [true, "link/identifier-is-required"],
        validate: {
            validator: (v) => v.length >= 6,
            message: () => "link/identifier-min-length-is-6"
        },
        unique: true
    },
    profilePicture: { type: String, default: "" },
    password: { type: String, default: "" },
    role: { type: String, default: "user" },
    active: { type: Boolean, default: true }
});

UserSchema.pre("validate", async function (next) {
    this.link = linkfy(this.link);
    let initLink = this.link; 
    const users = await User.find({ _id: { $ne: this._id }, link: { $regex: this.link, $options: 'i' } }).exec();

    while (users.some(user => user.link === this.link)) {
        this.link = initLink + Math.random().toString(36).slice(-5)
    }

    next();
});

UserSchema.post('validate', function (next) {
    this.password = bcryptjs.hashSync(this.password, 10);
});

UserSchema.post(['save', "updateOne"], function (next) {
    this.password = "";
});

export default UserSchema;