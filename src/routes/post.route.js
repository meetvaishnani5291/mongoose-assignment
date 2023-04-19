const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const auth = require("../middlewares/auth");

router.get("/", auth, postController.fetchAllPosts);

router.get("/:id", auth, postController.fetchPostById);

router.post("/", auth, postController.addPost);

router.patch("/:id", auth, postController.updatePost);

router.delete("/:id", auth, postController.deletePost);

//routes related to comments
router.patch("/:id/comment", auth, postController.addComment);

router.get("/:id/comments", auth, postController.fetchAllCommentsOnPost);

module.exports = router;
