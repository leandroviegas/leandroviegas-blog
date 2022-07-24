import { Router } from "express";

import { AuthenticateUserController } from "./Controllers/AuthenticateUserController";
import { CategoryController } from "./Controllers/CategoryController";
import { PostController } from "./Controllers/PostController";
import { UserController } from "./Controllers/UserController";

import { ensureAuthenticated } from "./middlewares/ensureAutenticated";

const router = Router();

// Declaring the controllers
const userController = new UserController();
const categoryController = new CategoryController();
const postController = new PostController();

const authenticateUserController = new AuthenticateUserController();

// Auth routes
router.post("/login", authenticateUserController.post);
router.get("/login", ensureAuthenticated, authenticateUserController.get);

// category routes
router.get("/categories/list", categoryController.list);
router.get("/categories", categoryController.get);
router.post("/categories", ensureAuthenticated, categoryController.post);
router.put("/categories", ensureAuthenticated, categoryController.update);
router.delete("/categories", ensureAuthenticated, categoryController.delete);

// User routes
router.get("/users/list", userController.list);
router.get("/users", userController.get);
router.post("/users", userController.post);
router.put("/users", ensureAuthenticated, userController.update);
router.delete("/users", ensureAuthenticated, userController.delete);

// Post routes
router.get("/posts/list", postController.list);
router.get("/posts", postController.get);
router.post("/posts", ensureAuthenticated, postController.post);
router.put("/posts", ensureAuthenticated, postController.update);
router.delete("/posts", ensureAuthenticated, postController.delete);

export { router };