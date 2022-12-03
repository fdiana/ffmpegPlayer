const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
var ffmpegCommand = require('fluent-ffmpeg');
var ffprobe = require('ffprobe');
var ffprobeStatic = require('ffprobe-static');
const childProcess = require("child_process");

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

async function getMetaData(rfp) {
  let value = await
  ffprobe(rfp,
          { path: ffprobeStatic.path },
          function (err, metadata) {
            if (err) return done(err);
              //console.log(metadata);
              var width = metadata.streams[0].width;
              var height = metadata.streams[0].height;
              var aspect = metadata.streams[0].display_aspect_ratio;
              var fr = metadata.streams[0].r_frame_rate.split('/');
              value = metadata;
              var frame_rate = Math.round(fr[0]/fr[1]);
              var codec = metadata.streams[0].codec_name;
             }
          );


  console.log(value)
  }

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  //console.log(JSON.stringify(req.file))
  let response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  console.log(req.file.path);

  /*
  let metadata
  console.log("<<<<<<<<<<<<<<<<<<<<<<<");
  try {
      console.log("[[[[[[[[[[[[[[[[[[[[[[");
      getMetaData(req.file.path);
      console.log(metadata);
      console.log("]]]]]]]]]]]]]]]]]]]]]]");
   } catch(error) {
       console.error("ERROR:" + error);
   }

  //console.log(metadata);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>");
  */
  response += `<video src="${req.file.path}" width="420" controls><br>`;
  ffprobe(req.file.path,
          { path: ffprobeStatic.path },
            function (err, metadata) {
            if (err) return console.log(err);
            //console.log(metadata);
            var width = metadata.streams[0].width;
            var height = metadata.streams[0].height;
            var aspect = metadata.streams[0].display_aspect_ratio;
            var fr = metadata.streams[0].r_frame_rate.split('/');
            var frame_rate = Math.round(fr[0]/fr[1]);
            var codec = metadata.streams[0].codec_name;
            res.json({
              width : width,
              height : height,
              aspect : aspect,
              fr : fr,
              frame_rate : frame_rate,
              codec : codec,
              info: metadata,
              rest: '<video src="${req.file.path}" width="420" controls><br>'
            })
          }
        );

/*
  let exeCommand = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffprobe.exe" + " -i " +".\\"+ req.file.path + " ";
  console.log(exeCommand);
  childProcess.exec(exeCommand, function(err, data) {
                      console.log(err)
                      console.log(data.toString());
                  });*/
  /*childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffprobe.exe  -i C://Diana//2022_Diana//CreatingWebsites//media//2_GMinorScale_and_BachMinuetInGMinor.mp4 ', function(err, data) {
                      console.log(err)
                      console.log(data.toString());
                  }); */


  //return res.send(response)
})


app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    console.log(req.files.length)
    var widthFrame = 352;
    var lengthFrame = 640;
    for(var i=0;i<req.files.length;i++){
        //console.log(req.files[i].path)
        //response += `<img src="${req.files[i].path}" /><br>`
        /*
        const pathForExe =
          'C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe ' +
          ' -i C:\\Diana\\2022_Diana\\CreatingWebsites\\ffmpegPlayer\\uploads\\7_CMajorScale_and_SonatinaBiehl.mp4 ' +
          ' -c:a copy -s 352x640 ' +
          '.\\OutputFiles\\7_CMajorScale_and_SonatinaBiehlResized.mp4';
          */
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
