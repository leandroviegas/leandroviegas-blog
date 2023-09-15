import { Router } from "express";

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

import { AuthenticationController } from "@Controllers/AuthenticationController";
import { TopicController } from "@Controllers/TopicController";
import { PostController } from "@Controllers/PostController";
import { UserController } from "@Controllers/UserController";
import { CommentController } from "@Controllers/CommentController";

import { ensureAuthenticated } from "@middlewares/ensureAutenticated";
import { accessManagement } from "@middlewares/accessManagement";

const router = Router();

// Declaring the controllers
const userController = new UserController();
const topicController = new TopicController();
const postController = new PostController();
const commentController = new CommentController();

const authenticationController = new AuthenticationController();

export const routesAccess = {
    "/topics": {
        post: ["admin", "writer"],
        put: ["admin", "writer"],
        delete: ["admin", "writer"]
    },
    "/posts": {
        post: ["admin", "writer"],
        put: ["admin", "writer"],
        delete: ["admin", "writer"]
    },
}

// Auth routes
router.route("/login")
    .get([ensureAuthenticated, accessManagement], authenticationController.get)
    .post(authenticationController.post);

// topic routes
router.get("/topics/list", topicController.list);
router.route("/topics")
    .get(topicController.get)
    .post([ensureAuthenticated, accessManagement], topicController.post)
    .put([ensureAuthenticated, accessManagement], topicController.update)
    .delete([ensureAuthenticated, accessManagement], topicController.delete)

// User routes
router.get("/users/list", [ensureAuthenticated, accessManagement], userController.list);

router.get("/users/active", [ensureAuthenticated, accessManagement], userController.active);
router.get("/users/deactive", [ensureAuthenticated, accessManagement], userController.deactive);

router.route("/users")
    .get(userController.get)
    .post(userController.post)
    .put([ensureAuthenticated, accessManagement, upload.single('profilePictureFile')], userController.update);

// Post routes
router.get("/posts/list", postController.list);
router.get("/posts/by-topic", postController.byTopic);
router.get("/posts/by-topics", postController.byTopics);
router.get("/posts/search", postController.search);
router.route("/posts")
    .get(postController.get)
    .post([ensureAuthenticated, accessManagement, upload.single('imageFile')], postController.post)
    .put([ensureAuthenticated, accessManagement, upload.single('imageFile')], postController.update)
    .delete([ensureAuthenticated, accessManagement], postController.delete)
router.route("/posts/:_id/comments")
    .get(commentController.list)
    .post([ensureAuthenticated], commentController.post)
    .put([ensureAuthenticated], commentController.put)
    .delete([ensureAuthenticated], commentController.delete)

export { router };