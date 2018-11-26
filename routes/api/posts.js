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
//@desc   Delet a post
//@access Private
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
    user: req.user.id
  }).then(profile => {

    Post.findById(req.params.id).then(post => {

      if(post.user.toString() !== req.user.id){

        return res.status(401).json({
          unauthorized: 'You are unauthorized to delete this post'
        });
      }

      post.remove().then(() => res.json({ success: true }));

    }).catch(err => res.status(404).json({
      noPost: 'No post was found by the id: ' + req.user.id
    }))

  }).catch(err => res.status(404).json({
    unauthorized: 'Could not find user'
  }))
});

module.exports = router;