import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";
import { ShowloggedUserService } from "../services/ShowloggedUserService";

class AuthenticateUserController {
  async post(request: Request, response: Response) {
    const { usernameOrEmail, password } = request.body;

    const authenticateUserService = new AuthenticateUserService();

    const { token, user } = await authenticateUserService.execute({ usernameOrEmail, password })

    return response.json({ token, user })
  }

  async get(request: Request, response: Response) {
    const showloggedUserService = new ShowloggedUserService();

    const { user_id } = request;

    const user = await showloggedUserService.execute(user_id);

    return response.json({ user });
  }
}

export { AuthenticateUserController };