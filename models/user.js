const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/itachi2000/image/upload/v1591955183/no-image_y6trgj.png"
    },
    followers: [{
        type: ObjectId,
        // refer to User model
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        // refer to User model
        ref: "User"
    }]
});

mongoose.model("User", userSchema);