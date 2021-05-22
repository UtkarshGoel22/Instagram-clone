const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys")
const User = mongoose.model("User");

const router = express.Router();

// sign up route
router.post("/signup", function(req, res) {
    // destructuring
    const {name, email, password, pic} = req.body;
    if(!name || !email || !password) {
        return res.status(422).json({error:"please add all the fields"});
    }
    // if all fields are present,
    // search if the email is already saved in database.
    User.findOne({email:email})
    .then(function(savedUser) {
        // user already exists
        if(savedUser) {
            return res.status(422).json({error:"user already exists with the email"});
        }
        // user doesn't exist,
        // hash the password
        bcrypt.hash(password,12)
        .then(function(hashedPassword) {
            // create new user
            const user = new User({
                // email : email is reduced to email
                // as both key and value are equal
                email,
                password : hashedPassword,
                name,
                pic:pic
            });
            // save the user
            user.save()
            .then(function() {
                res.json({message:"saved successfully"})
            })
            .catch(function(err) {
                console.log(err);
            })
        })
    })
    .catch(function(err) {
        console.log(err);
    })
});

// sign in route
router.post("/signin", function(req, res) {
    // destructuring
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(422).json({error:"Please add email or password"});
    }
    // if all the fields are present, 
    // search if the email is already saved in database. 
    User.findOne({email:email})
    .then(function(savedUser) {
        // email is not present in database
        if(!savedUser) {
            return res.status(422).json({error:"Invalid email or password"});
        }
        // compaere the saved hashed password with entered password.
        bcrypt.compare(password, savedUser.password)
        .then(function(doMatch) {
            // passwords match with each other
            if(doMatch) {
                // res.json({message:"successfully signed in"})
                // generate json web token on the basis of userid 
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET);
                const {_id, name, email, followers, following, pic} = savedUser;
                res.json({token, user: {_id, name, email, followers, following, pic}});
            }
            // passwords don't match with each other 
            else {
                return res.status(422).json({error:"Invalid email or password"});
            }
        })
        .catch(function(err) {
            console.log(err);
        })
    })
});

module.exports = router;