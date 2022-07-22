import { User } from "../Model/UserModel";
import dbConnect from "../utils/dbConnect";

class ShowloggedUserService {
    async execute(user_id){
        // Connecting to the database
        await dbConnect()

        const users = await User.findById(user_id).select("_id username email profilePicture admin").exec();

        return users
    }
}

export { ShowloggedUserService };