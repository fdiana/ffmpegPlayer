const childProcess = require("child_process");

//var exec = require('child_process').execFile;
var widthSize = 640;
var hightSize = 352;

var fun =function(){
   console.log("fun() start");
   //childProcess.exec('C:/Programs/ffmpeg/ffmpeg-2021-04-25-git-d98884be41-full_build/bin/ffmpeg.exe' ['-i','C:/Diana/2022_Diana/CreatingWebsites/media/2_GMinorScale_and_BachMinuetInGMinor.mp4'], function(err, data) {
childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i C://Diana//2022_Diana//CreatingWebsites//media//Bow1.mp4 -c:a copy -s 352x640 .\\OutputFiles\\Bow1Resized.mp4', function(err, data) {
        console.log(err)
        console.log(data.toString());
    });
childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i .//OutputFiles//Bow1Resized.mp4 -c copy .\\OutputFiles\\Bow1Resized.ts', function(err, data) {
            console.log(err)
            console.log(data.toString());
        });

childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i C://Diana//2022_Diana//CreatingWebsites//media//1_DMajorScale_and_BachMusette.mp4 -c:a copy -s 352x640 .\\OutputFiles\\1_DMajorScale_and_BachMusetteResized.mp4', function(err, data) {
                    console.log(err)
                    console.log(data.toString());
                });

childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe  -i .//OutputFiles//1_DMajorScale_and_BachMusetteResized.mp4  -c copy .\\OutputFiles\\1_DMajorScale_and_BachMusetteResized.ts', function(err, data) {
               console.log(err)
               console.log(data.toString());
              });

childProcess.exec("echo file '.\\OutputFiles\\Bow1Resized.ts' > resultfile.txt", function(err, data) {
                console.log(err)
                console.log(data.toString());
               });

childProcess.exec("echo file '.\\OutputFiles\\1_DMajorScale_and_BachMusetteResized.ts' >> resultfile.txt", function(err, data) {
                    console.log(err)
                    console.log(data.toString());
  });

childProcess.exec('C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe -f concat -safe 0 -i resultfile.txt -c copy .\\OutputFiles\\output.mp4', function(err, data) {
                    console.log(err)
                    console.log(data.toString());
  });
}
fun();


/*
var bat = require.resolve('C:/Diana/2022_Diana/CreatingWebsites/batchFileInNodeJS/run.bat');
var profile = require.resolve('C:/Diana/2022_Diana/CreatingWebsites/batchFileInNodeJS/app.js');
var ls = childProcess.spawn(bat, ['--profile', profile]);
*/
