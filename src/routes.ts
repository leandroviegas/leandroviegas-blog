import { Router } from "express";

import { AuthenticateUserController } from "./Controllers/AuthenticateUserController";
import { UserController } from "./Controllers/UserController";

import { ensureAuthenticated } from "./middlewares/ensureAutenticated";

const router = Router();

// Declaring the controllers
const userController = new UserController();
const authenticateUserController = new AuthenticateUserController();

// Auth routes
router.post("/login", authenticateUserController.post);
router.get("/login", ensureAuthenticated, authenticateUserController.get);

// User routes
router.get("/users/list", userController.list);
router.get("/users", userController.get);
router.post("/users", userController.post);
router.put("/users", ensureAuthenticated, userController.update);
router.delete("/users", ensureAuthenticated, userController.delete);

export { router };