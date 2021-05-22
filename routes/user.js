const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:id', requireLogin, function(req, res) {
    User.findOne({_id: req.params.id})
    .select("-password")
    .then(function(user) {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name")
        .exec(function(error, post) {
            if(error) {
                return res.status(422).json({error: error})
            }
            res.json({user, post})
        })
    }).catch(function(err) {
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow', requireLogin, function(req, res) {
    User.findByIdAndUpdate(req.body.followId, {
        $push:{followers: req.user._id}   
    }, {
        new: true
    }, function(err, result) {
        if(err) {
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $push:{following: req.body.followId}
        }, {
            new: true
        }).select("-password").then(function(result) {
            res.json(result)
        }).catch(function(err) {
            return res.status(422).json({error: err})
        })
    })
})

router.put('/unfollow', requireLogin, function(req, res) {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull:{followers: req.user._id}   
    }, {
        new: true
    }, function(err, result) {
        if(err) {
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull:{following: req.body.unfollowId}
        }, {
            new: true
        }).select("-password").then(function(result) {
            res.json(result)
        }).catch(function(err) {
            return res.status(422).json({error: err})
        })
    })
})

router.put('/updatepic', requireLogin, function(req, res) {
    User.findByIdAndUpdate(req.user._id, {$set:{pic:req.body.pic}}, {new: true} , function(err, result) {
        if(err) {
            return res.status(422).json({error: "Pic not Found"})
        }
        res.json(result)
    })
})

router.post('/search-users', function(req, res) {
    let userPattern = new RegExp("^"+req.body.query);
    User.find({email: {$regex:userPattern}})
    .select("_id email")
    .then(function(user) {
        res.json({user})
    }).catch(function(err) {
        console.log(err)
    })
})

module.exports = router;