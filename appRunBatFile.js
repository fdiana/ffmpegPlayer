const childProcess = require("child_process");

var bat = require.resolve('./run.bat');
var profile = require.resolve('./appRunBatFile.js');
var ls = childProcess.spawn(bat, ['--profile', profile]);

/*
var exec = require('child_process').execFile;

var fun =function(){
   console.log("fun() start");
   exec('HelloJithin.exe', function(err, data) {
        console.log(err)
        console.log(data.toString());
    });
}
fun();
*/




/*
const bash_run = childProcess.spawn('/bin/bash',
    ["bash.sh"], { env: process.env });

bash_run.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});
bash_run.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

const fs = require("fs");

const output = fs.createWriteStream("output.txt");
const input = fs.createReadStream("input.txt");

bash_run.stdout.pipe(output);

input.pipe(bash_run.stdin);
*/
