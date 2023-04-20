const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const auth = require("../middlewares/auth");

router.get("/", auth, postController.fetchAllPosts);

router.get("/search", auth, postController.searchPost);

router.get("/:id", auth, postController.fetchPostById);

router.post("/", auth, postController.addPost);

router.delete("/:id", auth, postController.deletePost);

router.post("/:id/comment", auth, postController.addCommentToPost);

module.exports = router;
