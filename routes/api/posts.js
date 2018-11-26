const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validatePostInput = require('../../validation/post');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//@route  POST /api/posts
//@desc   Create post
//@access Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {

  const {
    errors,
    isValid
  } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

//@route  GET /api/posts
//@desc   Get posts
//@access Public
router.get('/', (req, res) => {
  Post.find().sort({
      date: -1
    }).then(posts => res.json(posts))
    .catch(err => res.status(404).json({
      noPost: 'No posts found'
    }));
});

//@route  GET /api/posts/:id
//@desc   Get posts by id
//@access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({
      noPost: 'No post found'
    }));
});

//@route  DELETE /api/posts/:id
//@desc   Delete a post
//@access Private
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
    user: req.user.id
  }).then(profile => {

    Post.findById(req.params.id).then(post => {

      if (post.user.toString() !== req.user.id) {

        return res.status(401).json({
          unauthorized: 'You are unauthorized to delete this post'
        });
      }

      post.remove().then(() => res.json({
        success: true
      }));

    }).catch(err => res.status(404).json({
      noPost: 'No post was found by the id: ' + req.user.id
    }))

  }).catch(err => res.status(404).json({
    unauthorized: 'Could not find user'
  }))
});

//@route  POST /api/posts/like/:post_id
//@desc   Like post
//@access Private
router.post('/like/:post_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
    user: req.user.id
  }).then(profile => {

    Post.findById(req.params.post_id).then(post => {

      if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({
          duplicateLikeException: 'You already liked this post'
        });
      }

      post.likes.unshift({
        user: req.user.id
      });

      post.save().then(post => res.json(post));
    }).catch(err => res.status(404).json({
      notFound: 'Could not find post'
    }));

  }).catch(err => res.status(404).json({
    notFound: 'Could not find post'
  }));
});

//@route  POST /api/posts/unlike/:post_id
//@desc   Unlike post
//@access Private
router.post('/unlike/:post_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
    user: req.user.id
  }).then(profile => {

    Post.findById(req.params.post_id).then(post => {

      if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({
          noLikeException: 'You have not like this post'
        });
      }

      const removeIndex = post.likes.map(item => item.user.toString())
        .indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);

      post.save().then(post => res.json(post));

    }).catch(err => res.status(404).json({
      notFound: 'Could not find post'
    }));

  }).catch(err => res.status(404).json({
    notFound: 'Could not find post'
  }));
});

//@route  POST /api/posts/comment/:post_id
//@desc   Add comment to post
//@access Private
router.post('/comment/:post_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Post.findById(req.params.post_id).then(post => {

    const {
      errors,
      isValid
    } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    };

    post.comments.unshift(newComment);

    post.save().then(post => res.json(post));

  }).catch(err => res.status(404).json({
    notFound: 'No post found'
  }));
});

//@route  DELETE /api/posts/comment/:post_id/:comment_id
//@desc   Delete comment
//@access Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Post.findById(req.params.post_id).then(post => {

    if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
      return res.status(404).json({
        doesNotExist: 'Comment does not exist'
      });
    }

    const removeIndex = post.comments.map(item => item._id.toString())
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    post.save().then(post => res.json(post));

  }).catch(err => res.status(404).json({
    notFound: 'No post found'
  }));
});

module.exports = router;