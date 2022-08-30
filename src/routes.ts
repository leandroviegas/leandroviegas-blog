import { Router } from "express";

import { AuthenticateUserController } from "./Controllers/AuthenticateUserController";
import { TopicController } from "./Controllers/TopicController";
import { PostController } from "./Controllers/PostController";
import { UserController } from "./Controllers/UserController";

import { ensureAuthenticated } from "./middlewares/ensureAutenticated";

const router = Router();

// Declaring the controllers
const userController = new UserController();
const topicController = new TopicController();
const postController = new PostController();

const authenticateUserController = new AuthenticateUserController();

// Auth routes
router.route("/login")
    .get(ensureAuthenticated, authenticateUserController.get)
    .post(authenticateUserController.post);

// topic routes
router.get("/topics/list", topicController.list);
router.route("/topics")
    .get(topicController.get)
    .post(ensureAuthenticated, topicController.post)
    .put(ensureAuthenticated, topicController.update)
    .delete(ensureAuthenticated, topicController.delete)

// User routes
router.get("/users/list", userController.list);
router.route("/users")
    .get(userController.get)
    .post(userController.post)
    .put(ensureAuthenticated, userController.update)
    .delete(ensureAuthenticated, userController.delete);

// Post routes
router.get("/posts/list", postController.list);
router.get("/posts/by-topic", postController.byTopic);
router.route("/posts")
    .get(postController.get)
    .post(ensureAuthenticated, postController.post)
    .put(ensureAuthenticated, postController.update)
    .delete(ensureAuthenticated, postController.delete)

export { router };