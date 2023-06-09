const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const Post = require("../models/posts.model");
const Comment = require("../models/comments.model");
const {
  postValidationSchema,
  commentValidationSchema,
} = require("../utils/validation");

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
      posts: posts,
      currentPage: pageno,
      totalPages: Math.ceil(totalPosts / itemsPerPage),
    });
  } catch (err) {
    next(err);
  }
};

const fetchPostById = async (req, res, next) => {
  try {
    const postId = req.params.id;
    Joi.assert(postId, Joi.string().hex().length(24));

    const pageno = parseInt(req.query.pageno) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const skip = (pageno - 1) * itemsPerPage;

    const post = await Post.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
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
              $facet: {
                comments: [
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
                    $skip: skip,
                  },
                  {
                    $limit: itemsPerPage,
                  },
                  {
                    $project: {
                      _id: 0,
                      body: 1,
                      commentBy: "$commentByUser.username",
                    },
                  },
                ],
                meta: [
                  { $count: "total" },
                  {
                    $project: {
                      totalPages: {
                        $ceil: { $divide: ["$total", itemsPerPage] },
                      },
                      currentPage: pageno.toString(),
                    },
                  },
                ],
              },
            },
            {
              $unwind: "$meta",
            },
          ],
        },
      },
      {
        $unwind: "$commentsOnPost",
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
    if (!post[0]) return res.status(404).json({ error: "post not found!" });

    res.status(200).json(post[0]);
  } catch (err) {
    if (err instanceof Joi.ValidationError)
      return res.status(400).json({ message: "please provide valid id" });
    next(err);
  }
};

const searchPost = async (req, res, next) => {
  try {
    const keyword = req.query.keyword;
    Joi.assert(keyword, Joi.string().required());

    const posts = await Post.aggregate([
      { $match: { $text: { $search: keyword } } },
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
    if (posts.length === 0)
      return res.status(404).json({ message: "post not found" });

    res.status(200).json(posts);
  } catch (err) {
    if (err instanceof Joi.ValidationError)
      return res
        .status(400)
        .json({ message: "keyword is required for serch post" });
    next(err);
  }
};
const addPost = async (req, res, next) => {
  try {
    const newPost = req.body;
    newPost.userId = req.user._id;

    Joi.assert({ ...newPost }, postValidationSchema);

    const post = await Post.create(newPost);
    res.status(201).json(post);
  } catch (err) {
    if (err instanceof Joi.ValidationError)
      res.status(400).json({ message: err.message });
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    Joi.assert(postId, Joi.string().hex().length(24));

    const post = await Post.findOne({
      userId: req.user._id,
      _id: new mongoose.Types.ObjectId(postId),
    });
    if (!post) return res.status(404).json({ error: "post not found!" });
    post.deleteOne();
    res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof Joi.ValidationError)
      return res.status(400).json({ message: "please provide valid id" });
    next(err);
  }
};

const addCommentToPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    Joi.assert(postId, Joi.string().hex().length(24));
    const post = await Post.findById(new mongoose.Types.ObjectId(postId));

    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    const newComment = req.body;
    newComment.userId = req.user._id;
    newComment.postId = post._id;
    Joi.assert({ ...newComment }, commentValidationSchema);

    const comment = await Comment.create(newComment);

    res.status(200).json(comment);
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
