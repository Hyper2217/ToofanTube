const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({

    title:String,

    description:String,

    videoUrl:String,

    thumbnail:String,

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

},{timestamps:true});

module.exports = mongoose.model("Video", videoSchema);
