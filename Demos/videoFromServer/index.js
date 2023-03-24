var express = require('express')
const bodyParser = require("body-parser");
const childProcess = require("child_process");
var multer  = require('multer')
const fs = require("fs");
var port = 3000;

var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let ffmpegExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe";
let ffProbeExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffProbe.exe";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use('/jsonFiles', express.static('jsonFiles'));
app.use('/OutputFiles', express.static('OutputFiles'));

app.get("/",function(req, res){
      //res.json(data);
      res.sendFile(__dirname + "/index.html");
      //res.send("<h1>index</h1>");

});

app.get("/profile-upload-single", function(req, res){
  console.log("app.get(/profile-upload-single=================");
  res.render("profile-upload-single");
});

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
console.log("=============app.post('/profile-upload-single'=================");
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  //console.log(req);

  console.log('====================== app.post(/profile-upload-single');
  try{
    let dataJSON = {inputVideoFile: req.file.originalname,
                   inputVideoFilePath: req.file.path}

    const data = JSON.stringify(dataJSON);
    console.log("post: profile-upload-single JSON data = ", dataJSON);
    let outputFileNameJSON = "./jsonFiles/" + "jsonVideoFiles.json";

    fs.writeFileSync(outputFileNameJSON, data, (err) =>{
      if (err) throw err;
      console.log('Data written to file');
    });

  }
  catch(err) {
        console.error("Error - profile-upload-single!");
          }

  res.redirect("/");
})



app.get("/video", function (req, res) {
console.log("=============app.get(/video=================");
  console.log('====================== app.get(/video');
try{
      let rawdata = fs.readFileSync('./jsonFiles/jsonVideoFiles.json', (err, jsonString) => {
    	if (err) {
    		console.log("File read failed: - No json file", err);
     return;
    }
    console.log("File data:", jsonString);
    });
    let data = JSON.parse(rawdata);
    console.log("get video JSON data = ",data);
    const videoPath = data.inputVideoFilePath;
    const videoFileName = data.inputVideoFile;
    console.log(videoPath)
    console.log(videoFileName)
    const videoSize = fs.statSync(videoPath).size;

    const rs = fs.createReadStream(videoPath);

    // get size of the video file
    const { size } = fs.statSync(videoPath);

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Length", size);

      rs.pipe(res);

}
catch(err) {
     console.error("Error!");
       }

});





app.listen(port,() => console.log(`Server running on port ${port}!`))
