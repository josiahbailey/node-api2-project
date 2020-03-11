const express = require('express')

const router = express.Router()

const Posts = require('../data/db')

router.post('/', (req, res) => {
  const post = req.body
  if (!post.title || !post.contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    Posts.insert(post)
      .then(id => {
        res.status(201).json(id)
      })
  }
})

router.post('/:id/comments', (req, res) => {
  const comment = req.body
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        if (!comment.text) {
          res.status(400).json({ errorMessage: "Please provide text & post_id for the comment." })
        } else {
          if (!comment.post_id) {
            comment.post_id = req.params.id
          }
          Posts.insertComment(comment)
            .then(id => {
              res.status(201).json(id)
            })
            .catch(err => {
              console.log(err)
              res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
        }
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get('/', (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get('/:id/comments', (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        Posts.findPostComments(req.params.id)
          .then(comments => {
            res.status(200).json(comments)
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The comments information could not be retrieved." })
          })
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.delete('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        Posts.remove(req.params.id)
          .then(res => {
            res.status(204).json({ message: "The post has been deleted" })
          })
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.put('/:id', (req, res) => {
  const newPost = req.body
  Posts.findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        Posts.update(req.params.id, newPost)
          .then(item => {
            res.status(203).json({ message: "The post has been updated", data: item })
          })
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

module.exports = router