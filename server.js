const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
var ffmpegCommand = require('fluent-ffmpeg');
var ffprobe = require('ffprobe');
var ffprobeStatic = require('ffprobe-static');
const childProcess = require("child_process");
const fsProcess = require("fs");

// #########################


const app = express();
const port = 3000;
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



//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use('/OutputFiles', express.static('OutputFiles'));

//  Read information about the video sent

app.get("/",function(req, res){
      res.sendFile(__dirname + "/index.html");
      //res.send("<h1>index</h1>");
});



app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  //console.log(JSON.stringify(req.file))
  let response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"

  console.log(req.file.path);


  console.log(__dirname);
  //let ffmpegExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe";
  //let ffProbeExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffProbe.exe";



  //let exeCommand = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffprobe.exe" + " -show_streams " +".\\"+ req.file.path;
  //let exeCommand = ffProbeExePath + " -i " + ".\\" + req.file.path + " -v quiet -print_format json -show_entries stream="+ widthFrameSize + "," + hightFrameSize + " -hide_banner > output.json"

  /*let exeCommandFrameSize = ffProbeExePath + " -i " + ".\\" + req.file.path + " -v quiet -print_format json -show_entries stream=width,height -hide_banner > output.txt > output.json"
  console.log(exeCommandFrameSize);
  childProcess.exec(exeCommandFrameSize, function(err, data) {
                      console.log(err);
                      console.log('data.toString = ',  data.toString());*/

 let exeCommandInfoFile = ffProbeExePath + " -v quiet -print_format json -show_format -show_streams " + ".\\" + req.file.path + " > outputFileInfo.txt > outputFileInfo.json";
 //var fileName = fsProcess.filename(req.file);
 //let exeCommandInfoFile = ffProbeExePath + " -show_streams " + ".\\" + req.file.path + " > " + req.file.substr[0, req.file.length - 4] + "outputFileInfo.txt";
 console.log(exeCommandInfoFile);
 childProcess.execSync(
 //childProcess.exec(
              exeCommandInfoFile, function(err, data) {
              console.log(err);
              console.log('data.toString = ',  data.toString());
                  });

  //var obj = JSON.parse(fsProcess.readFileSync('outputFileInfo.json', 'utf8'));
  //console.log(obj);

  var obj = JSON.parse(fsProcess.readFileSync('outputFileInfo.json', 'utf8'));


  console.log("obj.streams.length = ");
  console.log(obj.streams.length);

  let frameWidth = obj.streams[0].width;
  let frameHeight = obj.streams[0].height;
  console.log(frameWidth);
  console.log(frameHeight);

  response += "Relevant information related to the movie.<br>"
  var table = "<table>";
  let key =0;
  table = `<tr><td>${"index"}</td>
          <td>${"width"}</td>
          <td>${"height"}</td></tr>  <br>`;
  for (let key=0; key<obj.streams.length; key++) {
      table += `<tr><td>${obj.streams[key].index}</td>
                    <td>${obj.streams[key].width}</td>
                    <td>${obj.streams[key].height}</td>  <br>`;
  }
  table += "</table>";
  response += `<div> ${table}   </div> <br> <br> <br>`

// addCueButton

var buttonAddCue = "<div id=${'main-right-options'}>"
buttonAddCue +=  `<button type=${'button'} id=${'#addCue'} title=${'Add cue'}>${"Add"}</button> `
response +=`${buttonAddCue}   </div> <br> <br> <br>`



 // Create table for time elements

 var table1 = "<div id=${'cue-table-wrap'}> <table id=${'cue-table'}> <thead>";
 table1 =  ` <tr><th>${"#"}</th>
                <th> ${"1"} </th><th>${"Start"}</th>
                <th>${"End"}</th>
                <th class="text">${"Text"}</th>
                <th>${"2"}</th>
             </tr>`;
 table1 += "</thead> <tbody id=${'cues'}></tbody></table> </div>";

 response += `${table1} <br> <br> <br>`





  response += `<video src="${req.file.path}" width="420" controls><br>`;



//  response += `<div> ${"outputFileInfo"}  </div> <br> <br> <br>`;
  /*childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffprobe.exe  -i C://Diana//2022_Diana//CreatingWebsites//media//cat.mp4 ', function(err, data) {
                      console.log(err)
                      console.log(data.toString());
                  });
childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i C://Diana//2022_Diana//CreatingWebsites//media//Bow1.mp4 -c:a copy -s 352x640 .\\OutputFiles\\Bow1Resized.mp4', function(err, data) {
                          console.log(err)
                          console.log(data.toString());
                      });
childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i C://Diana//2022_Diana//CreatingWebsites//media//Bow1.mp4 -c:a copy -s 352x640 .\\OutputFiles\\Bow1Resized.mp4', function(err, data) {
                              console.log(err)
                              console.log(data.toString());
                          });*/

  return res.send(response)
})


app.post('/resize', upload.single('profile-file'), function (req, res, next){


})

app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    console.log(req.files.length)

/*
    for(var i=0;i<req.files.length;i++){
          var lengthFile = req.files[i].filename.length;
          console.log(lengthFile);
          var fileName = req.files[i].filename;
          console.log(fileName);
        const pathForExe =
            'C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe ' +
            ' -i C:\\Diana\\2022_Diana\\CreatingWebsites\\ffmpegPlayer\\' + req.files[i].path +
            ' -c:a copy -s ' + widthFrame + 'x' + lengthFrame +
            ' .\\OutputFiles\\' + fileName.substr(0, lengthFile-4)+ 'Resized.mp4';
        ffmpegCommand(req.files[i]).size('50%');
        response += `<div>
        ${req.files[i].filename.info}
        <video src="${req.files[i].path}" width ="420" type="video/mp4" controls>
        </div> <br> <br> <br>`
        //console.log(req.files[i].filename)
        //console.log(req.files[i].path)
        //console.log(pathForExe)
        '<vr>'

      childProcess.exec(pathForExe, function(err, data) {
        console.log(err)
        console.log(data.toString());
    });
  }*/

  return res.send(response)
})




//Concatenate two videos

app.get("/profile-concatenate-multiple-videos", (req, res,next) => {
  res.sendFile(__dirname + "/index.html");
  //res.render("compress-video");
});


// Concatenate multiple files

app.post("/profile-concatenate-multiple-videos",  upload.array('profile-files', 12), (req, res,next) => {
  var response = '<a href="/">Home</a><br>'
  response += "Videos concatenated successfully.<br>"
  console.log(req.files.length);

  for(var i=0;i<req.files.length;i++){
    let outputNameFileResized = " .\\OutputFiles\\"  + req.files[i].filename + "Resized.mp4";
    let outputNameTSFileResized = " .\\OutputFiles\\"  + outputNameFileResized + ".ts";
    console.log(outputNameFileResized);
    let exeCommandResizeFile = ffmpegExePath + " -i " + ".\\" + req.files[i].path + " -c:a copy -s 352x640 " + outputNameFileResized;
    console.log(exeCommandResizeFile);
    childProcess.execSync(exeCommandResizeFile, function(err, data) {
            console.log(err)
            console.log(data.toString());
});
}
/*
for(var i=0;i<req.files.length;i++){
    let outputNameTSFileResized = " .\\OutputFiles\\"  + req.files[i].filename + "Resized.mp4" + ".ts";
    let exeCommandCreateTSFile = ffmpegExePath + " -i " + ".\\" + outputNameTSFileResized + " -c copy" + outputNameTSFileResized;
    childProcess.execSync(exeCommandCreateTSFile, function(err, data) {
            console.log(err)
            console.log(data.toString());
});
}*/
/*
  for(var i=0;i<req.files.length;i++){
      let inputNameTSFileResized = " .\\OutputFiles\\"  + req.files[i].filename + "Resized.mp4" + ".ts";
      let outputNameTextFile = " .\\OutputFiles\\"  + req.files[i].filename + "Resized.mp4" + ".txt";
      let exeCommandCreateTextFile = ffmpegExePath + " -i " + ".\\" + inputNameTSFileResized + " -c copy" + outputNameTextFile;
      /*let exeCommandWriteTSFileToTextFile = "echo file  + "${'.\\OutputFiles\\'}" + outputNameTSFileResized + " > .\\resultfile.txt";
      childProcess.execSync(exeCommandWriteTSFileToTextFile, function(err, data) {
                      console.log(err)
                      console.log(data.toString());
                    });
    }*/

  //let exeCommandResizeFile = ffmpegExePath + " -i " + ".\\" + req.file.path + " -c:a copy -s 352x640 " + " .\\OutputFiles\\Bow1Resized.mp4";

  /*childProcess.execSync('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i C://Diana//2022_Diana//CreatingWebsites//media//Bow1.mp4 -c:a copy -s 352x640 .\\OutputFiles\\Bow1Resized.mp4', function(err, data) {
          console.log(err)
          console.log(data.toString());
      });*/
  /*childProcess.execSync('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i .//OutputFiles//Bow1Resized.mp4 -c copy .\\OutputFiles\\Bow1Resized.ts', function(err, data) {
              console.log(err)
              console.log(data.toString());
          });

  childProcess.execSync('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i C://Diana//2022_Diana//CreatingWebsites//media//2_GMinorScale_and_BachMinuetInGMinor.mp4 -c:a copy -s 352x640 .\\OutputFiles\\2_GMinorScale_and_BachMinuetInGMinorResized.mp4', function(err, data) {
                      console.log(err)
                      console.log(data.toString());
                  });

  childProcess.execSync('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i .//OutputFiles//2_GMinorScale_and_BachMinuetInGMinorResized.mp4  -c copy .\\OutputFiles\\2_GMinorScale_and_BachMinuetInGMinorResized.ts', function(err, data) {
                 console.log(err)
                 console.log(data.toString());
                });

  childProcess.execSync("echo file '.\\OutputFiles\\Bow1Resized.ts' > .\\resultfile.txt", function(err, data) {
                  console.log(err)
                  console.log(data.toString());
                 });

  childProcess.execSync("echo file '.\\OutputFiles\\2_GMinorScale_and_BachMinuetInGMinorResized.ts' >> .\\resultfile.txt", function(err, data) {
                      console.log(err)
                      console.log(data.toString());
    });

  childProcess.execSync('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe -f concat -safe 0 -i .\\resultfile.txt -c copy .\\OutputFiles\\output.mp4', function(err, data) {
                      console.log(err)
                      console.log(data.toString());
    });*/

    let outputFilePath  = '.\\OutputFiles\\output.mp4';
    console.log(outputFilePath);
    response += `<div>
    <video src= ${outputFilePath} width ="420" type="video/mp4" controls>
    </div> <br> <br> <br>`

for(var i=0;i<req.files.length;i++){
      var lengthFile = req.files[i].filename.length;
      console.log(lengthFile);
      var fileName = req.files[i].filename;
      console.log(fileName);
      console.log(req.files[i].path)
    response += `<div>
    ${req.files[i].filename.info}
    <video src="${req.files[i].path}" width ="420" type="video/mp4" controls>
    </div> <br> <br> <br>`
    //console.log(req.files[i].filename)
    //console.log(req.files[i].path)
    //console.log(pathForExe)
    '<vr>'
}
  return res.send(response);
});



//app.listen(port, () => {
//    console.log(`[info] ffmpeg-api listening at http://localhost:${port}`)
//});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000");
});

//////////////////////////////////////////////////////////
