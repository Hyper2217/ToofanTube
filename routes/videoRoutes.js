const router = require("express").Router();

const multer = require("multer");

const streamifier = require("streamifier");

const Video = require("../models/Video");

const auth = require("../middleware/authMiddleware");

const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const upload = multer({storage});

router.post(
"/upload",
auth,
upload.fields([
{name:"video"},
{name:"thumbnail"}
]),
async(req,res)=>{

try{

const videoFile = req.files.video[0];
const thumbFile = req.files.thumbnail[0];

const uploadVideo = () => {

return new Promise((resolve,reject)=>{

const stream = cloudinary.uploader.upload_stream(
{
resource_type:"video"
},
(err,result)=>{

if(result) resolve(result);
else reject(err);

}
);

streamifier.createReadStream(videoFile.buffer).pipe(stream);

});

};

const uploadThumb = () => {

return new Promise((resolve,reject)=>{

const stream = cloudinary.uploader.upload_stream(
{
resource_type:"image"
},
(err,result)=>{

if(result) resolve(result);
else reject(err);

}
);

streamifier.createReadStream(thumbFile.buffer).pipe(stream);

});

};

const videoResult = await uploadVideo();
const thumbResult = await uploadThumb();

const newVideo = await Video.create({

title:req.body.title,

description:req.body.description,

videoUrl:videoResult.secure_url,

thumbnail:thumbResult.secure_url,

user:req.user.id

});

res.json(newVideo);

}catch(err){

res.status(500).json(err);

}

});

router.get("/", async(req,res)=>{

const videos = await Video.find()
.populate("user","username")
.sort({createdAt:-1});

res.json(videos);

});

router.put("/like/:id", auth, async(req,res)=>{

const video = await Video.findById(req.params.id);

if(!video.likes.includes(req.user.id)){

video.likes.push(req.user.id);

}else{

video.likes = video.likes.filter(
id => id.toString() !== req.user.id
);

}

await video.save();

res.json(video);

});

module.exports = router;
