const Post = require("../models/posts.model");
const fetchAllPosts = async (req, res, next) => {
  try {
    const pageno = parseInt(req.query.pageno) || 1;
    const noOfPostsPerPage = parseInt(req.query.noOfPostsPerPage) || 10;

    const skip = (pageno - 1) * noOfPostsPerPage;

    const totalPosts = await Post.countDocuments({ postedBy: req.user._id });
    const posts = await Post.find().skip(skip).limit(noOfPostsPerPage);

    if (posts.length === 0)
      return res.status(404).json({ error: "posts not found!" });

    res.status(200).json({
      data: posts,
      currentPage: pageno,
      totalPages: Math.ceil(totalPosts / noOfPostsPerPage),
    });
  } catch (err) {
    next(err);
  }
};

const fetchPostById = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
    });

    if (!post) return res.status(404).json({ error: "post not found!" });

    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
};

const addPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      postedBy: req.user._id,
    });
    res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "post not found!" });
    }
    await post.updateOne(
      {
        ...req.body,
      },
      { runValidators: true }
    );
    res.status(200).json({ message: "post updated successfully!" });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      postedBy: req.user._id,
      _id: req.params.id,
    });
    if (!post) return res.status(404).json({ error: "post not found!" });
    post.deleteOne();
    res.status(200).json({ message: "post deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    post.comments.push({ comment: req.body.comment, commentBy: req.user._id });
    await post.save();
    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
};

const fetchAllCommentsOnPost = async (req, res, next) => {
  try {
    const comments = await Post.findById(req.params.id, {
      _id: 0,
      comments: 1,
    });
    if (comments.length === 0) {
      return res
        .status(404)
        .json({ error: "There is no comment on post currently!" });
    }
    res.status(200).json({ data: comments });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addPost,
  updatePost,
  fetchAllPosts,
  fetchPostById,
  deletePost,
  addComment,
  fetchAllCommentsOnPost,
};
