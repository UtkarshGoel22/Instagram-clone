const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get('/allpost', requireLogin, function(req, res) {
    // to find all the posts
    Post.find()
    // to expand postedBy object
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then(function(posts) {
        res.json({posts});
    })
    .catch(function(err) {
        console.log(err);
    })
})

router.get('/getsubpost', requireLogin, function(req, res) {
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then(function(posts) {
        res.json({posts});
    })
    .catch(function(err) {
        console.log(err);
    })
})

router.post('/createpost', requireLogin, function(req, res) {
    // destructuring
    const {title, body, pic} = req.body;
    if(!title || !body || !pic) {
        return res.status(422).json({error:"Please add all the fields"})
    }
    // if all fields are present,
    // create new post 
    // hide the password.
    req.user.password = undefined;
    const post = new Post ({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(function(result) {
        res.json({post:result})
    })
    .catch(function(err) {
        console.log(err);
    })
})

router.get('/mypost', requireLogin, function(req, res) {
    // find the posts of the logged in user
    Post.find({postedBy: req.user._id})
    // PostedBy -> postedBy
    .populate("postedBy", "_id name")
    .then(function(mypost) {
        res.json({mypost});
    })
    .catch(function(err) {
        console.log(err);
    })
})

router.put('/like', requireLogin, function(req, res) {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec(function(error, result) {
        if(error) {
            return res.status(422).json({error: error})
        }else {
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, function(req, res) {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec(function(error, result) {
        if(error) {
            return res.status(422).json({error: error})
        }else {
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, function(req, res) {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec(function(error, result) {
        if(error) {
            return res.status(422).json({error: error})
        }else {
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId', requireLogin, function(req, res) {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec(function(err, post) {
        if(err || !post) {
            return res.status(422).json({error: err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(function(result) {
                res.json(result)
            }).catch(function(err) {
                console.log(err)
            })
        } 
    })
})

module.exports = router;