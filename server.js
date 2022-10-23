const express = require("express");
const bodyParser = require("body-parser");
var ffmpegCommand = require('fluent-ffmpeg');

var command = ffmpegCommand();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req, res){
      res.sendFile(__dirname + "/index.html");
      //res.send("<h1>index</h1>");
});


app.post("/", function(req, res){

  var nameFirstVideo = req.body.videoFile;
  //var nameSecondVideo = req.body.SecondVideo;
  res.write("The name of the first video is  " + nameFirstVideo);
  //res.write("The name of the second video is  " + nameSecondVideo);

  //var videoPath = __dirname + "/media/" +  req.body.videoFile;
  //var videoPath = __dirname + "/" + req.body.videoFile;
  //res.write(" and the video path is  " + videoPath);
  res.send();
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
});

//////////////////////////////////////////////////////////
