const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/twitter-clone', {
  useNewUrlParser: true
});

// // Configure multer so that it will upload to '/public/images'
// const multer = require('multer')
// const upload = multer({
//   dest: './public/images/',
//   limits: {
//     fileSize: 10000000
//   }
// });

// Create a scheme for items in the museum: a title and a path to an image.
const postSchema = new mongoose.Schema({
  username: String,
  message: String,
  like_count: Number,
});

// Create a model for items in the museum.
const Post = mongoose.model('Post', postSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
// app.post('/api/photos', upload.single('photo'), async (req, res) => {
//   // Just a safety check
//   if (!req.file) {
//     return res.sendStatus(400);
//   }
//   res.send({
//     path: "/images/" + req.file.filename
//   });
// });

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/posts', async (req, res) => {
  const post = new Post({
    username: req.body.username,
    message: req.body.message,
    like_count: req.body.like_count,
  });
  try {
    await post.save();
    console.log("in post()");
    console.log(req.body.message);
    res.send(post);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/posts', async (req, res) => {
  try {
    let posts = await Post.find();
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);

  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    var post = await Post.findOne({
      _id: req.params.id
    });
    console.log("in put");
    
    post.username = req.body.username;
    post.message = req.body.message;
    post.like_count = req.body.like_count;
    post.save();
    res.sendStatus(200);

  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3030, () => console.log('Server listening on port 3000!'));