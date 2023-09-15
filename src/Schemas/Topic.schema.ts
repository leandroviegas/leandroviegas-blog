import linkfy from "@utils/linkfy";
import { Schema } from "mongoose";

let TopicSchema = new Schema({
    name: {
        type: String,
        validate: {
            validator: (v) => { console.log(v); return v.length > 3 },
            message: props => "name/name-min-length-is-3"
        },
        required: [true, "name/name-is-required"],
    },
    link: { type: String, unique: true },
    description: { type: String },
    image: { type: String }
});

TopicSchema.pre("validate", function (next) {
    this.link = linkfy(this.link);
    next();
});

export default TopicSchema