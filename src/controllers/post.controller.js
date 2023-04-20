const Post = require("../models/posts.model");
const Comment = require("../models/comments.model");

const fetchAllPosts = async (req, res, next) => {
  try {
    const pageno = parseInt(req.query.pageno) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    const skip = (pageno - 1) * itemsPerPage;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find().skip(skip).limit(itemsPerPage);

    if (posts.length === 0)
      return res.status(404).json({ error: "posts not found!" });

    res.status(200).json({
      data: posts,
      currentPage: pageno,
      totalPages: Math.ceil(totalPosts / itemsPerPage),
    });
  } catch (err) {
    next(err);
  }
};

const fetchPostById = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const post = await Post.aggregate([
      {
        $match: {
          _id: Number(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "postedByUser",
        },
      },
      {
        $unwind: "$postedByUser",
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "commentsOnPost",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "commentByUser",
              },
            },
            {
              $unwind: "$commentByUser",
            },
            {
              $project: {
                _id: 0,
                body: 1,
                commentBy: "$commentByUser.username",
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          body: 1,
          commentsOnPost: 1,
          postedBy: "$postedByUser.username",
        },
      },
    ]);
    if (!post) return res.status(404).json({ error: "post not found!" });

    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
};

const searchPost = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([
      { $match: { $text: { $search: req.query.keyword } } },
      {
        $addFields: {
          score: { $meta: "textScore" },
        },
      },
      {
        $sort: { score: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "postedByUser",
        },
      },
      {
        $unwind: "$postedByUser",
      },
      {
        $project: {
          _id: 0,
          title: 1,
          body: 1,
          postedBy: "$postedByUser.username",
          score: 1,
        },
      },
    ]);
    res.status(200).json({ data: posts });
  } catch (err) {
    next(err);
  }
};

const addPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      userId: req.user._id,
      _id: req.params.id,
    });
    if (!post) return res.status(404).json({ error: "post not found!" });
    post.deleteOne();
    res.status(200).json({ message: "post deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const addCommentToPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }
    const comment = await Comment.create({
      ...req.body,
      userId: req.user._id,
      postId,
    });
    res.status(200).json({ data: comment });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addPost,
  fetchAllPosts,
  fetchPostById,
  deletePost,
  addCommentToPost,
  searchPost,
};
