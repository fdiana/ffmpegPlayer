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
let arrayOfVideoFileNames = [];
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

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use('/jsonFiles', express.static('jsonFiles'));
app.use('/OutputFiles', express.static('OutputFiles'));

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
    /*  response += `<div>
    <video src="${req.files[i].path}" width ="420" type="video/mp4" controls>
    </div> ${req.files[i].filename} <br> <br> <br>`
    '<vr>'*/
    }
    console.log("post: profile-upload-multiple JSON data = ",dataJSON);
    const data = JSON.stringify(dataJSON);
    console.log(data);

    let outputFileNameJSON = "./jsonFiles/" + "jsonVideoMultipleFiles.json";

    fs.writeFileSync(outputFileNameJSON, data, (err) =>{
       if (err) throw err;
       console.log('Data written to file');
    });
 }
     catch(err) {
           console.error("Error - /profile-upload-multiple!");
    }

  console.log(arrayOfVideoFileNames)
  res.redirect("/");
})


app.get("/results", function (req, res) {
    console.log(req.param("bar"));

    res.send(req.param("bar"));
});


app.get('/listOfVideoFileNames', function (req, res) {
console.log("app.get(/listOfVideoFileNames=================");

  numberOfVideoFilesUpdated = req.files.length;
  //console.log("numberOfVideoFilesUpdated = ", numberOfVideoFilesUpdated);

  for(var i=0;i<numberOfVideoFilesUpdated;i++){
        //var lengthFile = req.files[i].filename.length;
        //console.log(lengthFile);
        arrayOfVideoFileNames[i] = req.files[i].filename;
        console.log(arrayOfVideoFileNames[i]);
      /*const pathForExe = ffmpegExePath +
          ' -i C:\\Diana\\2022_Diana\\CreatingWebsites\\ffmpegPlayer\\' + req.files[i].path +
          ' -c:a copy -s ' + widthFrame + 'x' + lengthFrame +
          ' .\\OutputFiles\\' + fileName.substr(0, lengthFile-4)+ 'Resized.mp4';*/
      //ffmpegCommand(req.files[i]).size('50%');
      /*response += `<div>
      ${req.files[i].filename.info}
      <video src="${req.files[i].path}" width ="420" type="video/mp4" controls>
      </div> <br> <br> <br>`
      //console.log(req.files[i].filename)
      //console.log(req.files[i].path)
      //console.log(pathForExe)
      '<vr>'*/

  /*  childProcess.exec(pathForExe, function(err, data) {
      console.log(err)
      console.log(data.toString());
  });*/
}

/*  var arrFilesUploaded = "";
  for (var i = 0; i < filesUploaded.length ; i++)
  {
    arrFilesUploaded += '<option value=' + filesUploaded[i].name + '>' + filesUploaded[i].name + '</option>';

    let option = document.createElement("option");
    option.setAttribute('value', filesUploaded[i].name);

    let optionText = document.createTextNode(filesUploaded[i].name);
    option.appendChild(optionText);

    iP.appendChild(option);

  }
*/
res.send(arrayOfVideoFileNames)


})

app.get("/video", function (req, res) {

  console.log('====================== app.get(/video');
  //console.log(arrayOfVideoFileNames[0])
  //console.log(numberOfVideoFilesUpdated)

/*try{
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
*/

let index = 1;
//let videoName = arrayOfVideoFileNames[1];
let videoPath = "./uploads/" + arrayOfVideoFileNames[1];
//console.log(videoPath)

const videoSize = fs.statSync(videoPath).size;

const rs = fs.createReadStream(videoPath);

// get size of the video file
const { size } = fs.statSync(videoPath);

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Length", size);

  rs.pipe(res);


});





app.listen(port,() => console.log(`Server running on port ${port}!`))
