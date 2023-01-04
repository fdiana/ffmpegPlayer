const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
var ffmpegCommand = require('fluent-ffmpeg');
var ffprobe = require('ffprobe');
var ffprobeStatic = require('ffprobe-static');
const childProcess = require("child_process");
const fsProcess = require("fs");

const noUiSlider = require('noUiSlider');
const wNumb = require("wnumb");
const jsdom = require("jsdom");
const {JSDOM} =  jsdom;

// #########################


const app = express();
app.use(express.json());
const port = 3000;
let ffmpegExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe";
let ffProbeExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffProbe.exe";

//########################
/*
var htmlSource = fsProcess.readFileSync("./index.html", "utf8")
//var jsdom = require('jsdom');
//const {JSDOM} = jsdom;
const dom = new JSDOM(htmlSource);
htmlSource = dom.window.document.querySelector("html").outerHTML;
console.log(htmlSource);

var myVideo =  dom.window.document.getElementById('myVideo').outerHTML;
console.log('myVideo = ', myVideo);

var stepSlider =  dom.window.document.getElementById('sliderID').outerHTML;
console.log(typeof(stepSlider));
console.log('stepSlider = ', stepSlider);
let id_div = dom.window.document.getElementsByTagName('div')[0].id;
console.log(typeof(id_div));
console.log('id_div = ', id_div);
var querySliderHTML = dom.window.document.querySelector('#sliderID');
console.log('querySliderHTML = ', querySliderHTML);
var querySlider = dom.window.document.querySelector('#sliderID').outerHTML;
//var querySlider = dom.window.document.querySelector('#sliderID');
console.log('querySlider = ', querySlider);
*/

app.post("/jsondata", function (req, res) {

 //const jsonContent = JSON.parse(req);
	res.json({ msg:
						 `Input video file is ${req.body.inputVideoFile},
						 Width frame is ${req.body.widthFrame}, Height frame is ${req.body.heightFrame},
             Cutting File: Start Time is ${req.body.cuttingFileStartTime}, Cutting File: End Time is ${req.body.cuttingFileEndTime},
             First annotated line is ${req.body.firstAnnotatedLine},
						 Start Time - First Annotated Line ${req.body.startTimeFirstAnnotatedLine},
						 End Time - First Annotated Line is ${req.body.endTimeFirstAnnotatedLine},
             Second annotated line is ${req.body.secondAnnotatedLine},
						 Start Time - Second Annotated Line ${req.body.startTimeSecondAnnotatedLine},
						 End Time - Second Annotated Line is ${req.body.endTimeSecondAnnotatedLine},
						 Third annotated line is ${req.body.thirdAnnotatedLine},
						 Start Time - Third Annotated Line ${req.body.startTimeThirdAnnotatedLine},
						 End Time - Third Annotated Line is ${req.body.endTimeThirdAnnotatedLine}`});

const data = JSON.stringify(req.body);
console.log(req.body);

let outputFileName = req.body.inputVideoFile;
console.log("outputFile =", outputFileName)
let outputFileLength = outputFileName.length;
console.log("outputFileLength = ", outputFileLength)
let lengthName = outputFileLength - 4;
outputFileNameJSON = './' + outputFileName.substr(0,lengthName) + "WorkingParameters.json";
console.log("outputFileNameJSON = ", outputFileNameJSON)

 //let outputFileNameJSON = './myjsonfile.json';
 fsProcess.writeFileSync(outputFileNameJSON, data, (err) =>{
   if (err) throw err;
  console.log('Data written to file');
 });


});





/*
const data = {
    "streams": [
      {
        "index": 0,
        "start_time": "0.000000",
        "duration": "7.534056"
      }
      {
        "index":1,
      }
      {
        "index":2,
        "width": 1920,
        "height": 1080
      }
    ],
    "format":{
      "filename": "C:\\Diana\\2022_Diana\\CreatingWebsites\\media\\BowAndPresentation.mp4",
      "start_time": "0.000000",
      "duration": "7.534000"
    }

}
*/

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
//app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use('/OutputFiles', express.static('OutputFiles'));

//  Read information about the video sent

app.get("/",function(req, res){
      //res.json(data);
      res.sendFile(__dirname + "/index.html");
      //res.send("<h1>index</h1>");
});

////////////////////
//
//  Read the information related to one single video and save it on a JSON file
//   Display the relveant information - width and height for frame
//
////////////////////////


app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  //console.log(JSON.stringify(req.file))
  let response = '<a href="/">Home</a><br>'
  response += "Single file uploaded successfully.<br>"

	let outputFilePathLength = (req.file.path).length;
	console.log(req.file.path)
	console.log("outputFilePathLength =", outputFilePathLength)
	let outputFileName = req.file.originalname;
	console.log(outputFileName)
	let outputFileLength = outputFileName.length;
	console.log("outputFileLength = ", outputFileLength)
	let lengthName = outputFileLength - 4;
	outputFileNameJSON = outputFileName.substr(0,lengthName) + ".json";
	console.log("outputFileNameJSON = ", outputFileNameJSON)
  let outputFileInfo = outputFileNameJSON;
 //let outputFileInfo = req.file.path + "outputFileInfo.json";
 console.log(outputFileInfo);
 let exeCommandInfoFile = ffProbeExePath + " -v quiet -print_format json -show_format -show_streams " + ".\\" + req.file.path + " > " + outputFileNameJSON;
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

  var obj = JSON.parse(fsProcess.readFileSync(outputFileNameJSON, 'utf8'));


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
/*
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
*/




  response += `<video src="${req.file.path}" width="420" controls><br>`;
//  response += `<div> ${"outputFileInfo"}  </div> <br> <br> <br>`;


  return res.send(response)
})


app.post('/resize', upload.single('profile-file'), function (req, res, next){


})

app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    let widthFrame =  352;
    let lengthFrame = 640;
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    console.log(req.files.length);

    for(var i=0;i<req.files.length;i++){
          var lengthFile = req.files[i].filename.length;
          console.log(lengthFile);
          var fileName = req.files[i].filename;
          console.log(fileName);
        const pathForExe = ffmpegExePath +
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

/////////////////////////////
//
//   Select the cutting time and annotation information for multiple videos
//   from a JSON file created
//
////////////////////////////


app.get("/profile-select-time-multiple-videos", (req, res,next) => {
  res.sendFile(__dirname + "/index.html");
  //res.json(data);
});

app.post("/profile-select-time-multiple-videos",  upload.array('profile-files', 12), (req, res,next) => {

  var response = '<a href="/">Home</a><br>'
  response += "Select time for multiple videos<br>"

  let rawdata = fsProcess.readFileSync('./myjsonfile.json', (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
   return;
 }
 console.log("File data:", jsonString);
});
let data = JSON.parse(rawdata);
console.log(data);


for(var i=0;i<req.files.length;i++){
  let outputNameFileTimeCutted = " .\\OutputFiles\\"  + req.files[i].filename + "TimeCutted.mp4";
  console.log(outputNameFileTimeCutted);
  let exeCommandTimeCuttedFile = ffmpegExePath + " -y -i " + ".\\" + req.files[i].path + " -ss " + data.startTime + " -to "  + data.endTime + " "  + outputNameFileTimeCutted;
  console.log(exeCommandTimeCuttedFile);
  childProcess.execSync(exeCommandTimeCuttedFile, function(err, data) {
          console.log(err)
          console.log(data.toString());
});
response += `<div>
${outputNameFileTimeCutted}
<video src="${outputNameFileTimeCutted}" width ="420" type="video/mp4" controls>
</div> <br> <br> <br>`

}

  return res.send(response);
});



/////////////////////////////////
//
//    Concatenate multiple videos
//
/////////////////////////////////

function extractVideoFileName(req,i){

		let outputFileNamePath = " .\\OutputFiles\\"  + req.files[i].filename + "Resized.mp4";
    let outputFileName = req.files[i].filename;


	return outputFileNamePath;
}




app.get("/profile-concatenate-multiple-videos", (req, res,next) => {
  res.sendFile(__dirname + "/index.html");
  //res.render("compress-video");
});

/////////////////////////////
//
// Concatenate multiple files
//
////////////////////////////////

app.post("/profile-concatenate-multiple-videos",  upload.array('profile-files', 12), (req, res,next) => {
  var response = '<a href="/">Home</a><br>'
  response += "Videos concatenated successfully<br>"
  console.log(req.files.length);

/////////////////////////
//
//  Read relevant info from JSON files - original mp4 videos
//
//////////////////////////
let frameWidth = [];
let frameHeight = [];

let minFrameWidth = 0;
let minFrameHeight = 0;
//let obj =[];

for(var i=0;i<req.files.length;i++){
	//let outputNameFileResized = " .\\OutputFiles\\"  + req.files[i].filename + "Resized.mp4";
	//console.log(outputNameFileResized);
	//let exeCommandResizeFile = ffmpegExePath + " -y -i " + ".\\" + req.files[i].path + " -c:a copy -s 352x640 " + outputNameFileResized;
	//console.log(exeCommandResizeFile);

  console.log(req.files[i].filename);

	let outputFilePathLength = (req.files[i].path).length;
	console.log("outputFilePathLength =", outputFilePathLength)
	let outputFileName = req.files[i].originalname;
	console.log(outputFileName)
	let outputFileLength = outputFileName.length;
	console.log("outputFileLength = ", outputFileLength)
	let lengthName = outputFileLength - 4;
	outputFileNameJSON = outputFileName.substr(0,lengthName) + ".json";
	console.log("outputFileNameJSON = ", outputFileNameJSON)
  let outputFileInfo = outputFileNameJSON;

	let exeCommandInfoFile = ffProbeExePath + " -v quiet -print_format json -show_format -show_streams " + ".\\" + req.files[i].path + " > " + outputFileNameJSON;
	//var fileName = fsProcess.filename(req.file);
	//let exeCommandInfoFile = ffProbeExePath + " -show_streams " + ".\\" + req.file.path + " > " + req.file.substr[0, req.file.length - 4] + "outputFileInfo.txt";
	console.log(exeCommandInfoFile);
	childProcess.execSync(
	//childProcess.exec(
							 exeCommandInfoFile, function(err, data) {
							 console.log(err);
							 console.log('data.toString = ',  data.toString());
									 });


	//let outputFileNameJSON = createInitialJSONfileName(req, i);
	//let outputFileInfo = outputFileNameJSON;


	var obj = JSON.parse(fsProcess.readFileSync(outputFileNameJSON, 'utf8'));

	frameWidth[i] = obj.streams[0].width;
	frameHeight[i] = obj.streams[0].height;

}


/////////////////////
//
// Resize the video files at 352x640
//
/////////////////////////

let frameWidthResizedValue = 352;
let frameHeightResizedValue = 640;

  for(var i=0;i<req.files.length;i++){
    let outputNameFileResized = " .\\OutputFiles\\"  + req.files[i].filename + "Resized.mp4";
    console.log(outputNameFileResized);
    let exeCommandResizeFile = ffmpegExePath + " -y -i " + ".\\" + req.files[i].path + " -c:a copy -s " + frameWidthResizedValue +"x"+ frameHeightResizedValue + outputNameFileResized;
    console.log(exeCommandResizeFile);
    childProcess.execSync(exeCommandResizeFile, function(err, data) {
            console.log(err)
            console.log(data.toString());
});
}

/////////////////////
//
// Read myJSONFile - Working Parameters
//
/////////////////////////

let rawdata = fsProcess.readFileSync('./myjsonfile.json', (err, jsonString) => {
	if (err) {
		console.log("File read failed:", err);
 return;
}
console.log("File data:", jsonString);
});
let data = JSON.parse(rawdata);
console.log(data);

let firstAnnotatedLine = data.firstAnnotatedLine;
console.log('firstAnnotatedLine=', firstAnnotatedLine);
let startTimeFirstAnnotatedLine = data.startTimeFirstAnnotatedLine;
let endTimeFirstAnnotatedLine = data.endTimeFirstAnnotatedLine;


////////////////////////////////
//
// Add annotations to each video file
//
////////////////////////////////



for(var i=0;i<req.files.length;i++){
	let firstAnnotatedLine = data.firstAnnotatedLine;
	console.log(firstAnnotatedLine);
	let outputNameFileResized = " .\\OutputFiles\\"  + req.files[i].filename + "Resized.mp4";
	let outputNameFileResizedAnnotated = " .\\OutputFiles\\"  + req.files[i].filename + "ResizedAnnotated.mp4";
	let drawTextFirstLine = "drawtext=text='" + firstAnnotatedLine + ", ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=540:enable='gte(t,17)',"
	let drawTextSecondLine ="drawtext=text=' BWV Anh. 115 ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=570:enable='gte(t,17)',"
	let drawTextThirdLine = "drawtext=text=' by Johann Sebastian Bach ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=600:enable='gte(t,17)'"
	console.log(outputNameFileResizedAnnotated);
	//let exeCommandResizeAnnotatedFile = ffmpegExePath + " -y -i " + ".\\" + req.files[i].path + " -c:a copy -s 352x640 " + outputNameFileResized;
	let exeCommandResizeAnnotatedFile = ffmpegExePath + " -y -i " + outputNameFileResized + " -vf " +' "'+ drawTextFirstLine + drawTextSecondLine +
	                                    drawTextThirdLine + '" ' + outputNameFileResizedAnnotated;
	console.log(exeCommandResizeAnnotatedFile);
	childProcess.execSync(exeCommandResizeAnnotatedFile, function(err, data) {
					console.log(err)
					console.log(data.toString());
});
}


////////////////////////
//
//  Create TS files
//
////////////////////////////
for(var i=0;i<req.files.length;i++){
    let outputNameFileResizedAnnotated = req.files[i].filename + "ResizedAnnotated.mp4";
		console.log(outputNameFileResizedAnnotated);
    let outputNameTSFileResizedAnnotated =  req.files[i].filename + "ResizedAnnotated" + ".ts";
    console.log(outputNameTSFileResizedAnnotated);
    let exeCommandCreateTSFile = ffmpegExePath + " -y -i " + " .\\OutputFiles\\" + outputNameFileResizedAnnotated + " -c copy" +  " .\\OutputFiles\\" + outputNameTSFileResizedAnnotated;
    console.log(exeCommandCreateTSFile);
    childProcess.execSync(exeCommandCreateTSFile, function(err, data) {
            console.log(err)
            console.log(data.toString());
});
}


  for(var i=0;i<req.files.length;i++){
      let inputNameTSFileResized = req.files[i].filename + "ResizedAnnotated" + ".ts";
      console.log(inputNameTSFileResized);
      if(i==0){
        let exeCommandWriteTSFileToTextFile = "echo file " + "'" + ".\\OutputFiles\\" + inputNameTSFileResized + "'" + " > " + ".\\resultfile.txt";
        console.log(exeCommandWriteTSFileToTextFile);
        childProcess.execSync(exeCommandWriteTSFileToTextFile, function(err, data) {
                    console.log(err)
                    console.log(data.toString());
                  });
                }
                else if(i>=1){
                  let exeCommandWriteTSFileToTextFile = "echo file " + "'" + ".\\OutputFiles\\" + inputNameTSFileResized + "'" + " >> " + ".\\resultfile.txt";
                  console.log(exeCommandWriteTSFileToTextFile);
                  childProcess.execSync(exeCommandWriteTSFileToTextFile, function(err, data) {
                              console.log(err)
                              console.log(data.toString());
                            });
                }
    }

// Concatenate


    let outputNameConcatenatedFiles = " .\\OutputFiles\\output.mp4";
    console.log(outputNameConcatenatedFiles);
    let exeCommandConcatenate = ffmpegExePath + " -y -f concat -safe 0 -i resultfile.txt " + " -c copy" + outputNameConcatenatedFiles;
    console.log(exeCommandConcatenate);
    childProcess.execSync(exeCommandConcatenate, function(err, data) {
            console.log(err)
            console.log(data.toString());
});


    console.log(outputNameConcatenatedFiles);
    response += `<div>
    <video src= ${outputNameConcatenatedFiles} width ="420" type="video/mp4" controls>
    </div> <br> <br> <br>`


for(var i=0;i<req.files.length;i++){
      var lengthFile = req.files[i].filename.length;
      console.log(lengthFile);
      var fileName = req.files[i].filename;
      console.log(fileName);
      console.log(req.files[i].path)
      console.log(req.files[i].filename)
    response += `<div>
    ${req.files[i].filename}
    <video src="${req.files[i].path}" width ="420" type="video/mp4" controls>
    </div> <br> <br> <br>`
    //console.log(req.files[i].filename)
    //console.log(req.files[i].path)
    //console.log(pathForExe)
    '<vr>'
}

console.log(frameWidth);
console.log(frameHeight);

  return res.send(response);
});



//app.listen(port, () => {
//    console.log(`[info] ffmpeg-api listening at http://localhost:${port}`)
//});


app.listen(process.env.PORT || 3000, function(){
   console.log(`[info] ffmpeg-api listening at http://localhost:${port}`)
});

//////////////////////////////////////////////////////////
