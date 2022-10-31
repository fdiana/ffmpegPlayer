const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
var ffmpegCommand = require('fluent-ffmpeg');

// #########################


const app = express();
const port = 3000;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

//  Read information about the video sent

app.get("/",function(req, res){
      res.sendFile(__dirname + "/index.html");
      //res.send("<h1>index</h1>");
});

/*
app.post("/", function(req, res){

  var nameFirstVideo = req.body.videoFile;
  //var nameSecondVideo = req.body.SecondVideo;
  res.write("The name of the first video is  " + nameFirstVideo);
  //res.write("The name of the second video is  " + nameSecondVideo);

  //var videoPath = __dirname + "/media/" +  req.body.videoFile;
  //var videoPath = __dirname + "/" + req.body.videoFile;
  //res.write(" and the video path is  " + videoPath);
  ffmpegCommand(nameFirstVideo).size('50%');
  res.send();

});
*/



/*
app.use('/a',express.static('/b'));
Above line would serve all files/folders inside of the 'b' directory
And make them accessible through http://localhost:3000/a.
*/


app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  console.log(JSON.stringify(req.file))
  var response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  //response += `<img src="${req.file.path}" /><br>`
  response += `<video src="${req.file.path}" width="420" controls><br>`
  return res.send(response)
})


app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    console.log(req.files.length)
    for(var i=0;i<req.files.length;i++){
        //console.log(req.files[i].path)
        //response += `<img src="${req.files[i].path}" /><br>`
        ffmpegCommand(req.files[i]).size('50%');
        response += `<video src="${req.files[i].path}" width="420"  type="video/mp4" controls><br>`
        console.log(response)
        '<vr>'
    }

  return res.send(response)
})




//Concatenate two videos

app.get("/concatenated-video", (req, res) => {
  res.render("compress-video");
});

app.post("/concatenated-video", (req, res) => {
  console.log(req.files.video);
  res.send("Success");
});



//app.listen(port, () => {
//    console.log(`[info] ffmpeg-api listening at http://localhost:${port}`)
//});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000");
});

//////////////////////////////////////////////////////////
