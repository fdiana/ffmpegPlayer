var express = require('express')
const bodyParser = require("body-parser");
const childProcess = require("child_process");
var multer  = require('multer')
const fs = require("fs");
var port = 3000;

var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

////////////////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
////////////////////


app.use('/uploads', express.static('uploads'));
app.use('/jsonFiles', express.static('jsonFiles'));
app.use('/OutputFiles', express.static('OutputFiles'));

let ffmpegExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe";
let ffProbeExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffProbe.exe";
let arrayOfVideoFileNames = [];
let videoToShow = 0;
let numberOfVideoFilesUpdated = 0;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })



app.get("/",function(req, res){
      //res.json(data);
      res.sendFile(__dirname + "/index.html");
      //res.send("<h1>index</h1>");

});

app.get('/profile-upload-multiple', function(req, res){
  res.render("profile-upload-multiple");
});

app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
  console.log("app.post('/profile-upload-multiple'=================");
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    let widthFrame =  352;
    let lengthFrame = 640;
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    numberOfVideoFilesUpdated = req.files.length;
    let dataJSON = []//{index: "", inputVideoFile: "", inputVideoFilePath: ""};
try{
    for(var i=0;i<numberOfVideoFilesUpdated;i++){
      /*console.log(i);
      console.log(req.files[i].originalname)
      console.log(req.files[i].path)*/
      dataJSON[i] = {index: i,
                   inputVideoFile: req.files[i].originalname,
                   inputVideoFilePath: req.files[i].path}
      arrayOfVideoFileNames[i] = req.files[i].filename;

    }
    //console.log("post: profile-upload-multiple JSON data = ",dataJSON);
    const data = JSON.stringify(dataJSON);
    //console.log(data);

    let outputFileNameJSON = "./jsonFiles/" + "jsonVideoMultipleFiles.json";

    fs.writeFileSync(outputFileNameJSON, data, (err) =>{
       if (err) throw err;
       console.log('Data written to file');
    });
 }
     catch(err) {
           console.error("Error - /profile-upload-multiple!");
    }

  //console.log("arrayOfVideoFileNames = ", arrayOfVideoFileNames)
  res.redirect("/");
})



app.get('/selectVideoFile', function (req, res) {
console.log("app.get(/selectVideoFile=================");

//try{
/*
    let rawdata = fs.readFileSync('./jsonFiles/selectedVideoFileForProcessing.json', (err, jsonString) => {
    if (err) {
      console.log("File read failed: - No json file", err);
   return;
  }
  console.log("File data:", jsonString);
  });
    let data = JSON.parse(rawdata);
    console.log("get video JSON data = ", data);

    const videoFileName = data.inputVideoFile;

    const videoPath = "uploads/" + data.inputVideoFile;

    console.log(videoPath)
    console.log(videoFileName)
    //const videoSize = fs.statSync(videoPath).size;

    const rs = fs.createReadStream(videoPath);

    // get size of the video file
    const { size } = fs.statSync(videoPath);

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Length", size);

    rs.pipe(res);
*/

//}
//catch(err) {
//   console.error("Error!");
//     }

})


app.post('/selectVideoFile', function (req, res) {
console.log("app.post(/selectVideoFile=================");

console.log("req = ", req.body)
//console.log("indexVideoToShow = ", indexVideoToShow)
//console.log("arrayOfVideoFileNames = ", arrayOfVideoFileNames);


const newuser= {
        file_name:req.body,
    }
//try{
      console.log(newuser)
      let videoToShow = newuser.file_name;
      console.log("videoToShow = ", videoToShow);
      console.log(typeof videoToShow);
      const keys = Object.keys(videoToShow);
      console.log(keys[0]);
      videoToShow = keys[0];
      let videoPath = "uploads/" + videoToShow;
      console.log("videoToShow = ", videoToShow)
      let dataJSON = {inputVideoFile: videoToShow, inputVideoFilePath: videoPath}
      console.log(dataJSON)


/*
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
    console.log(videoFileName)*/


      const data = JSON.stringify(dataJSON);

      //var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
      //console.log(dirUser)
      //var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
      //console.log(dirJsonFiles)

      let outputFileNameJSON = "./jsonFiles/" + "selectedVideoFileForProcessing.json";
      let outputFileNameJSONLink = "./jsonFiles/" + "selectedVideoFileForProcessingLink.json";

      //console.log("outputFileNameJSON = ", outputFileNameJSON)

      //let outputFileNameJSON = './myjsonfile.json';
      fs.writeFileSync(outputFileNameJSON, data, (err) =>{
      if (err) throw err;
        console.log('Data written to file');
      });
      console.log("app.post(/selectVideoFile=================+++++++++++");
      //res.redirect("/");
      fs.writeFileSync(outputFileNameJSONLink, data, (err) =>{
      if (err) throw err;
        console.log('Data written to file');
      });

//}
//catch(err) {
//      console.error("Error - /video!");
//}

})



app.get('/sendLinkSelectVideoFile', function (req, res) {
console.log("app.get(/sendLinkSelectVideoFile=================");


//console.log(req.user)
  //if(req.isAuthenticated()){

    //var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
    //console.log(dirUser)
    //var dirUploads =   dirUser  + "\\" + 'uploads';
    //console.log(dirUploads)
    //var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
    //console.log(dirJsonFiles)

    //let videoFileToShowJson = dirJsonFiles + "\\" + "selectedVideoFileForProcessing.json";
    let videoFileToShowJson = "./jsonFiles/" + "selectedVideoFileForProcessingLink.json";

      //try{
          let rawdata = fs.readFileSync(videoFileToShowJson, (err, jsonString) => {
          if (err) {
            console.log("File read failed: - No json file", err);
         return;
        }
        //console.log("File data:", jsonString);
        });
          let data = JSON.parse(rawdata);
          //console.log("get video JSON data = ", data);

          const videoFileName = data.inputVideoFile;

          const videoPath = data.inputVideoFilePath;

          var size = Object.keys(data).length;
          console.log(size)
          console.log(data)

          //res.send(videoPath);
          if(size==2){
            res.send(rawdata);
          }



          /*console.log(videoPath)
          //console.log(videoFileName)
          //const videoSize = fs.statSync(videoPath).size;

          const rs = fs.createReadStream(videoPath);

          // get size of the video file
          const { size } = fs.statSync(videoPath);

          res.setHeader("Content-Type", "video/mp4");
          res.setHeader("Content-Length", size);

          rs.pipe(res);
          //res.render("video_processing");*/


      //}
    //  catch(err) {
    //     console.error("Error!- - The json file is empty");
    //   }
     //}
     //else {
    //   res.render("video_processing");
   //}


})

/*
app.get("/video", function (req, res) {

  console.log('=== app.get(/video');

indexVideoToShow = 0;
try{
console.log(arrayOfVideoFileNames)
let index = indexVideoToShow;
console.log("index = ", index)
//let videoName = arrayOfVideoFileNames[1];
let videoPath = "uploads\\\\" + arrayOfVideoFileNames[index];
console.log("videoPath = ", videoPath)

const videoSize = fs.statSync(videoPath).size;

const rs = fs.createReadStream(videoPath);

// get size of the video file
const { size } = fs.statSync(videoPath);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Length", size);
  rs.pipe(res);
}
catch(err) {
    console.error("Error - /video!");
}

});
*/




app.listen(port,() => console.log(`Server running on port ${port}!`))
