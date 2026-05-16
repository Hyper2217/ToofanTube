const router = require("express").Router();

const Comment = require("../models/Comment");

const auth = require("../middleware/authMiddleware");

router.post("/:videoId", auth, async(req,res)=>{

try{

const comment = await Comment.create({

text:req.body.text,

user:req.user.id,

video:req.params.videoId

});

res.json(comment);

}catch(err){

res.status(500).json(err);

}

});

router.get("/:videoId", async(req,res)=>{

const comments = await Comment.find({

video:req.params.videoId

}).populate("user","username");

res.json(comments);

});

module.exports = router;
