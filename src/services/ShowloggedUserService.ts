import { User } from "@Models/User.model";
import ConnectDB from "@utils/ConnectDB";

class ShowloggedUserService {
    async execute(user_id){
        // Connecting to the database
        await ConnectDB()

        const users = await User.findById(user_id).select("_id username email profilePicture role").exec();

        return users
    }
}

export { ShowloggedUserService };