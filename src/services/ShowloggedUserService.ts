import { User } from "@Models/User.model";

class ShowloggedUserService {
    async execute(user_id) {
        return await User.findById(user_id).select("_id username email profilePicture role").exec();
    }
}

export { ShowloggedUserService };