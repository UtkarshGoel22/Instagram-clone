const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");
const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports = function(req, res, next) {
    // destructuring
    // authorization === "Bearer dfjasdfhjaksdh"
    const {authorization} = req.headers;
    if(!authorization) {
        // 401 means unauthorized
        return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","");
    // verify the token 
    jwt.verify(token, JWT_SECRET, function(err, payload) {
        if(err) {
            return res.status(401).json({error:"you must be logged in"});
        }
        const {_id} = payload; 
        User.findById(_id).then(function(userData) {
            req.user = userData;
            // the function may take some time to execute and we want next()
            // to run after that. So place next() here.
            // Otherwise req.user will be unavailable
            next();
        })  
    })
}