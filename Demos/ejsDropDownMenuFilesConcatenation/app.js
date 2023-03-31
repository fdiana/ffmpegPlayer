//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
var multer  = require('multer');
const ejs = require("ejs");
const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//const connectEnsureLogin = require('connect-ensure-login');
//const GoogleStrategy = require('passport-google-oauth20').Strategy;

const _ = require("lodash");
const fs = require("fs");
const childProcess = require("child_process");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let ffmpegExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffmpeg.exe";
let ffProbeExePath = "C:\\Programs\\ffmpeg\\ffmpeg-2021-04-25-git-d98884be41-full_build\\bin\\ffProbe.exe";
//let arrayOfVideoFileNames = [];
//let numberOfVideoFilesUpdated = 0;


app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use('/jsonFiles', express.static('jsonFiles'));
app.use('/OutputFiles', express.static('OutputFiles'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

//app.use(express.static("public"));


/////////////
////
///    Session
///
////////////////

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

let posts = [];

//////  Create data base

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'userVideoDB';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }


_connect() {
     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

mongoose.set("strictQuery", true);

module.exports = new Database();

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       var dirUser = __dirname + '\\UsersCollections\\' + req.user.username + '\\uploads';
     cb(null, dirUser);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });


/*
app.get("/", function(req, res){
  res.render("home");
});
*/

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});


app.get("/video_processing", function(req, res){
console.log("app.get(/video_processing=================");
  if(req.isAuthenticated()){
    res.render("video_processing");
  } else {
    res.render("/login");
  }

});


app.post("/video_processing", function(req, res){
console.log("app.post(/video_processing=================");
  const user =  new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user,function(err){
    if (err) {
      console.log(err);
    } else {
     passport.authenticate("local")(req, res, function(){
        res.redirect("/video_processing");
      });
    }
  });
});

app.post("/register", function(req, res){

debugger
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        var dirUser = __dirname + '\\UsersCollections\\' + user.username;
        console.log(dirUser)
        var dirUploads =   dirUser  + "\\" + 'uploads';
        console.log(dirUploads)
        var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
        console.log(dirJsonFiles)
        var dirOutputFiles = dirUser  + "\\" + 'outputFiles';
        console.log(dirOutputFiles)
        var dirOutputFilesWorkingParameters = dirUser  + "\\" + 'outputFilesWorkingParameters';
        console.log(dirOutputFilesWorkingParameters)

        if (!fs.existsSync(dirUser)){
          fs.mkdirSync(dirUser, { recursive: true });
         }
         else{
           console.log("The user directory exists already!")
         }
         if (!fs.existsSync(dirUploads)){
             fs.mkdirSync(dirUploads, { recursive: true });
         }
         else{
           console.log("dirUploads exists!")
         }

         if (!fs.existsSync(dirJsonFiles)){
             fs.mkdirSync(dirJsonFiles, { recursive: true });
             let outputFileNameJSON = dirJsonFiles + "//jsonVideoMultipleFiles.json";
             let outputOrdoredFileNameJSON = dirJsonFiles + "//jsonVideoOrderedMultipleFiles.json";
             let outputSelectedVideoFileJSON = dirJsonFiles + "//selectedVideoFileForProcessing.json";

             let dataJSON = []
             let dataOrdererJSON = [];
             let dataSelectedVideoFileJSON = [];

             const data = JSON.stringify(dataJSON);
             const dataOrderer = JSON.stringify(dataOrdererJSON);
             const dataSelectedVideo = JSON.stringify(dataSelectedVideoFileJSON);

             fs.writeFileSync(outputFileNameJSON, data, (err) =>{
                if (err) throw err;
                console.log('Data written to file');
             });

             fs.writeFileSync(outputOrdoredFileNameJSON, dataOrderer, (err) =>{
               if (err) throw err;
               console.log('Data written to file');
             });

             fs.writeFileSync(outputSelectedVideoFileJSON, dataSelectedVideo, (err) =>{
               if (err) throw err;
               console.log('Data written to file');
             });
         }
         else{
           console.log("dirJsonFiles exists!")
         }

         if (!fs.existsSync(dirOutputFiles)){
             fs.mkdirSync(dirOutputFiles, { recursive: true });
         }
         else{
           console.log("dirOutputFiles exists!")
         }

         if (!fs.existsSync(dirOutputFilesWorkingParameters)){
             fs.mkdirSync(dirOutputFilesWorkingParameters, { recursive: true });
         }
         else{
           console.log("dirOutputFilesWorkingParameters exists!")
         }



        res.redirect("/video_processing");
      });
    }
  });

});



app.post("/login", function(req, res){
console.log("app.post('/login'=================");
  const user =  new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user,function(err){
    if (err) {
      console.log(err);
    } else {
     passport.authenticate("local")(req, res, function(){  
       var dirUser = __dirname + '\\UsersCollections\\' + user.username;
       //console.log(dirUser)
       var dirUploads =   dirUser  + "\\" + 'uploads';
       //console.log(dirUploads)
       var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
       //console.log(dirJsonFiles)
       var dirOutputFiles = dirUser  + "\\" + 'outputFiles';
       //console.log(dirOutputFiles)
       var dirOutputFilesWorkingParameters = dirUser  + "\\" + 'outputFilesWorkingParameters';
       //console.log(dirOutputFilesWorkingParameters)

       if (!fs.existsSync(dirUser)){
         fs.mkdirSync(dirUser, { recursive: true });
        }
        else{
          console.log("The user directory exists already!")
        }
        if (!fs.existsSync(dirUploads)){
            fs.mkdirSync(dirUploads, { recursive: true });
        }
        else{
          console.log("dirUploads exists!")
        }
        if (!fs.existsSync(dirJsonFiles)){
            fs.mkdirSync(dirJsonFiles, { recursive: true });

        }
        else{
          let outputFileNameJSON = dirJsonFiles + "//jsonVideoMultipleFiles.json";
          let outputOrdoredFileNameJSON = dirJsonFiles + "//jsonVideoOrderedMultipleFiles.json";
          let outputSelectedVideoFileJSON = dirJsonFiles + "//selectedVideoFileForProcessing.json";

          let dataJSON = []
          let dataOrdererJSON = [];
          let dataSelectedVideoFileJSON = [];

          const data = JSON.stringify(dataJSON);
          const dataOrderer = JSON.stringify(dataOrdererJSON);
          const dataSelectedVideo = JSON.stringify(dataSelectedVideoFileJSON);

          fs.writeFileSync(outputFileNameJSON, data, (err) =>{
             if (err) throw err;
             console.log('Data written to file');
          });

          fs.writeFileSync(outputOrdoredFileNameJSON, dataOrderer, (err) =>{
            if (err) throw err;
            console.log('Data written to file');
          });

          fs.writeFileSync(outputSelectedVideoFileJSON, dataSelectedVideo, (err) =>{
            if (err) throw err;
            console.log('Data written to file');
          });
          console.log("dirJsonFiles exists!")
        }

        if (!fs.existsSync(dirOutputFiles)){
            fs.mkdirSync(dirOutputFiles, { recursive: true });
        }
        else{
          console.log("dirOutputFiles exists!")
        }

        if (!fs.existsSync(dirOutputFilesWorkingParameters)){
            fs.mkdirSync(dirOutputFilesWorkingParameters, { recursive: true });
        }
        else{
          console.log("dirOutputFilesWorkingParameters exists!")
        }


        res.redirect("/video_processing");
      });
    }
  });

});




app.get("/logout", function(req, res){
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});





/*
app.get("/submit", function(req, res){
  debugger
  if (req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", function(req, res){

  const user =  new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user,function(err){
    if (err) {
      console.log(err);
    } else {
     passport.authenticate("local")(req, res, function(){
        var dirUser = __dirname + '\\UsersCollections\\' + user.username;
        console.log(dirUser)
        if (!fs.existsSync(dirUser)){
          fs.mkdirSync(dirUser, { recursive: true });
         }
         else{
           console.log("The user directory exists already!")
         }
        res.redirect("/video_processing");
      });
    }
  });

})
*/
//////////////////////


app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});


app.get("/submit", function(req, res){
  if(req.isAuthenticated()){
    res.render("video_processing");
  } else {
    res.render("/login");
  }

});


app.get('/profile-upload-multiple', function(req, res){

  if(req.isAuthenticated()){
      res.render("profile-upload-multiple");
  } else {
    res.render("/login");
  }

});





app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
  console.log("app.post('/profile-upload-multiple'=================");
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any

    //console.log("user.usename = ", req.user.username)
    //console.log("user.session = ", req.session)
    const user =  new User({
      username: req.user.username,
      password: req.user.password
    });

    console.log(user)

    User.findById(req.user.id, function(err, foundUser){

      if(err){
        console.log(err);
      } else {
         if(foundUser){

           console.log(foundUser)
           let widthFrame =  352;
           let lengthFrame = 640;
           var response = '<a href="/">Home</a><br>'
           response += "Files uploaded successfully.<br>"
           numberOfVideoFilesUpdated = req.files.length;
           let dataJSON = []
           let outputTimeCuttingParametersFileNameJSON = [];
           let outputAnnotationParametersFileNameJSON = [];
           let outputFileName = [];
           let outputFileLength = [];
           let lengthName = [];

      try{
            var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
            console.log(dirUser)
            var dirUploads =   dirUser  + "\\" + 'uploads';
            console.log(dirUploads)
            var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
            console.log(dirJsonFiles)


           for(var i=0;i<numberOfVideoFilesUpdated;i++){
             dataJSON[i] = {inputVideoFile: req.files[i].originalname,
                           inputVideoFilePath: req.files[i].path
                        }
              outputFileName[i] = req.files[i].originalname;
              console.log("outputFile =", outputFileName[i])
              outputFileLength[i] = outputFileName[i].length;
              console.log("outputFileLength = ", outputFileLength[i])
              lengthName[i] = outputFileLength[i] - 4;
              outputTimeCuttingParametersFileNameJSON[i] = dirJsonFiles + '/' + outputFileName[i].substr(0,lengthName[i]) + "TimeCutParameters.json";
              outputAnnotationParametersFileNameJSON[i] = dirJsonFiles + '/' + outputFileName[i].substr(0,lengthName[i]) + "AnnotationParameters.json";

              var dataParametersJSON = [];
              const dataParameters = JSON.stringify(dataParametersJSON);
               //let outputFileNameJSON = './myjsonfile.json';
               fs.writeFileSync(outputTimeCuttingParametersFileNameJSON[i], dataParameters, (err) =>{
                 if (err) throw err;
                console.log('Data written to file');
               });

               fs.writeFileSync(outputAnnotationParametersFileNameJSON[i], dataParameters, (err) =>{
                 if (err) throw err;
                console.log('Data written to file');
               });

             }

           dataOrdererJSON = [];
           const data = JSON.stringify(dataJSON);
           const dataOrderer = JSON.stringify(dataOrdererJSON);



           let outputFileNameJSON = dirJsonFiles + "//jsonVideoMultipleFiles.json";
           let outputOrdoredFileNameJSON = dirJsonFiles + "//jsonVideoOrderedMultipleFiles.json";


           fs.writeFileSync(outputFileNameJSON, data, (err) =>{
              if (err) throw err;
              console.log('Data written to file');
           });

           fs.writeFileSync(outputOrdoredFileNameJSON, dataOrderer, (err) =>{
             if (err) throw err;
             console.log('Data written to file');
           });

           res.redirect("/video_processing");

         }
            catch(err) {
                  console.error("Error - /profile-upload-multiple!");
           }


        }

     }
   })

//res.redirect("/video_processing");

})


app.get('/workingParameters', function(req, res){
console.log("app.get('workingParameters'=================");
  if(req.isAuthenticated()){
     //connectEnsureLogin.ensureLoggedIn();
      //res.send({user: req.user});
      console.log(req.user.username);
      console.log("req.user = ", req.user);
      let url = "./UsersCollections/" + req.user.username + "/jsonFiles/jsonVideoMultipleFiles.json";
      //let url = ".//UsersCollections//1@2.com//jsonFiles//jsonVideoMultipleFiles.json";
      console.log(url)
      //let video = JSON.parse(fs.readFileSync(url));
      let videoFilesList = fs.readFileSync(url);
      //console.log(video);
      res.send(videoFilesList);
      //res.json(videoFilesList);
  } else {
    //res.render("/login");
    res.redirect("/login");
  }

});


app.post('/workingParameters', function (req, res) {
  console.log("app.post('workingParameters'=================");

  console.log(req.user)
  const user =  new User({
    username: req.user.username,
    password: req.user.password
  });

  console.log(user)

  User.findById(req.user.id, function(err, foundUser){

    if(err){
      console.log(err);
    } else {
       if(foundUser){
         res.redirect("/video_processing");

       }
     }
   })

})


app.get('/selectVideoFileOriginal', function (req, res) {
  console.log("app.get(/selectVideoFileOriginal=================");


  console.log("req.user = ", req.user)
  //console.log("req.body = ", req.body)

  //console.log(req.user)
    if(req.isAuthenticated()){

      var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
      //console.log(dirUser)
      var dirUploads =   dirUser  + "\\" + 'uploads';
      //console.log(dirUploads)
      var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
      //console.log(dirJsonFiles)

      let videoFileToShowJson = dirJsonFiles + "\\" + "selectedVideoFileForProcessing.json";

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

            var lengthObj = Object.keys(data).length;
            console.log(lengthObj)
            console.log(data)

            //console.log(videoFileName)
            //const videoSize = fs.statSync(videoPath).size;
            if(lengthObj == 2 ){
              const rs = fs.createReadStream(videoPath);

              // get size of the video file
              const { size } = fs.statSync(videoPath);

              res.setHeader("Content-Type", "video/mp4");
              res.setHeader("Content-Length", size);

              rs.pipe(res);

            }
            //res.render("video_processing");


        //}
      //  catch(err) {
      //     console.error("Error!- - The json file is empty");
      //   }
       }
       else {
         //res.render("video_processing");
         res.redirect("/login");
     }
})


app.post('/jsonSelectVideoFile', function (req, res) {
  console.log("app.post(/jsonSelectVideoFile=================");

  //console.log("req = ", req.body)
  //console.log("indexVideoToShow = ", indexVideoToShow)
  //console.log("arrayOfVideoFileNames = ", arrayOfVideoFileNames);


  User.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
        if(foundUser){

          const newuser= {
                  file_name:req.body,
              }
          //try{
                //console.log(newuser)

                let videoToShow = newuser.file_name;
                console.log(typeof videoToShow);
                const keys = Object.keys(videoToShow);
                console.log(keys[0]);
                videoToShow = keys[0];

                var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
                //console.log(dirUser)
                var dirUploads =   dirUser  + "\\" + 'uploads';
                //console.log(dirUploads)
                var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
                //console.log(dirJsonFiles)

                let outputSelectedVideoFilePath = dirUploads + "\\" + videoToShow;

                let outputFileNameJSON = dirJsonFiles + "\\" + "selectedVideoFileForProcessing.json";
                //console.log("outputFileNameJSON = ", outputFileNameJSON)



                //console.log("videoToShow = ", videoToShow)
                let dataJSON = {inputVideoFile: videoToShow,
                                inputVideoFilePath:outputSelectedVideoFilePath}
                console.log(dataJSON)
                const data = JSON.stringify(dataJSON);



                fs.writeFileSync(outputFileNameJSON, data, (err) =>{
                  if (err) throw err;
                    console.log('Data written to file');
                });
                res.redirect("/video_processing");
              //}
              //catch(err) {
              //  console.error("Error - /profile-upload-multiple!");
               //}
             }
            }
       });

})

/*
app.get('/sendLinkSelectVideoFile', function (req, res) {
console.log("app.get(/sendLinkSelectVideoFile=================");


//console.log(req.user)
  if(req.isAuthenticated()){

    var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
    //console.log(dirUser)
    var dirUploads =   dirUser  + "\\" + 'uploads';
    //console.log(dirUploads)
    var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
    //console.log(dirJsonFiles)

    let videoFileToShowJson = dirJsonFiles + "\\" + "selectedVideoFileForProcessing.json";

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
            res.send(videoPath);
          }

  }
     else {
       res.render("video_processing");
   }


})*/


app.get("/selectVideoFileTimeCuttingParameters", function (req, res) {
          console.log("app.get(/selectVideoFileTimeCuttingParameters=================");

          console.log("req.user = ", req.user)
          //console.log("req.body = ", req.body)

          if(req.isAuthenticated()){


              var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
              //console.log(dirUser)
              var dirUploads =   dirUser  + "\\" + 'uploads';
              //console.log(dirUploads)
              var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
              //console.log(dirJsonFiles)

              let videoFileToShowJson = dirJsonFiles + "\\" + "selectedVideoFileForProcessing.json";

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

              var lengthObj = Object.keys(data).length;
              console.log(lengthObj)
              console.log(data)

              if(lengthObj == 2 ){

                let outputFileName =  videoFileName;
                let outputFileLength = outputFileName.length;
                //console.log("outputFileLength = ", outputFileLength)
                let lengthName = outputFileLength - 4;

                var dirOutputFiles = dirUser  + "\\" + 'outputFiles';
                //console.log(dirOutputFiles)
                var dirOutputFilesWorkingParameters = dirUser  + "\\" + 'outputFilesWorkingParameters';
                //console.log(dirOutputFilesWorkingParameters)

                //var outputJSONFileNameTimeCuttedParameters = dirJsonFiles + "\\" + outputFileName.substr(0,lengthName) + "TimeCutParameters.json";

                //let objJSONFileNameTimeCuttedParameters = JSON.parse(fs.readFileSync(outputJSONFileNameTimeCuttedParameters));


                //var lengthJSONFileNameTimeCuttedParameters = Object.keys(objJSONFileNameTimeCuttedParameters).length;

                //console.log("lengthJSONFileNameTimeCuttedParameters = ", lengthJSONFileNameTimeCuttedParameters)

                //if(lengthJSONFileNameTimeCuttedParameters == 3) {

                    outputFileNameTimeCuttingParameters = dirOutputFilesWorkingParameters + "\\" + outputFileName.substr(0,lengthName) + "ResizedTimeCutted.mp4";
                    //console.log("outputFileNameTimeCuttingParameters = ", outputFileNameTimeCuttingParameters)
                    if (!fs.existsSync(outputFileNameTimeCuttingParameters)) {
                       console.log("No time cutted video file exists!")
                      }
                    else
                      {

                      const rs = fs.createReadStream(outputFileNameTimeCuttingParameters);
                      //const videoSize = fs.statSync(outputFileNameTimeCuttingParameters).size;

                      // get size of the video file
                      const { size } = fs.statSync(outputFileNameTimeCuttingParameters);
                      res.setHeader("Content-Type", "video/mp4");
                      res.setHeader("Content-Length", size);

                      rs.pipe(res);
                    }
                 //}
              }

          }
          else {
              res.redirect("/login");
          }
})


app.post("/jsondataTimeCuttingParameters", function (req, res) {
console.log("app.post(/jsondataTimeCuttingParameters=================");


          const user =  new User({
            username: req.user.username,
            password: req.user.password
          });

          console.log(user)

          User.findById(req.user.id, function(err, foundUser){

            if(err){
              console.log(err);
            } else {
               if(foundUser){

                 //console.log(res)
                 //const jsonContent = JSON.parse(req);
                	 res.json({ msg:
                						 `Input video file is ${req.body.inputVideoFile},
                             Cutting File: Start Time is ${req.body.cuttingStartTime},
                             Cutting File: End Time is ${req.body.cuttingEndTime}`});

                    const data = JSON.stringify(req.body);
                    console.log("req.body = ", req.body);

                    console.log("req.body.inputVideoFile =", req.body.inputVideoFile);
                    let outputFileName = req.body.inputVideoFile;
                    console.log("outputFile =", outputFileName)
                    let outputFileLength = outputFileName.length;
                    console.log("outputFileLength = ", outputFileLength)
                    let lengthName = outputFileLength - 4;


                    var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
                    console.log(dirUser)
                    var dirUploads =   dirUser  + "\\" + 'uploads';
                    console.log(dirUploads)
                    var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
                    console.log(dirJsonFiles)
                    var dirOutputFiles = dirUser  + "\\" + 'outputFiles';
                    console.log(dirOutputFiles)
                    var dirOutputFilesWorkingParameters = dirUser  + "\\" + 'outputFilesWorkingParameters';
                    console.log(dirOutputFilesWorkingParameters)


                    outputFileNameJSON = dirJsonFiles + "\\" + outputFileName.substr(0,lengthName) + "TimeCutParameters.json";
                    console.log("outputFileNameJSON = ", outputFileNameJSON)

                     //let outputFileNameJSON = './myjsonfile.json';
                     fs.writeFileSync(outputFileNameJSON, data, (err) =>{
                       if (err) throw err;
                      console.log('Data written to file');
                     });

                 /////////////////////
                 //
                 // Resize the video files at 352x640
                 //
                 //
                 /////////////////////////

                 let frameWidthResizedValue = 352;
                 let frameHeightResizedValue = 640;


                 let outputNameFilePath = dirUploads + "\\" + outputFileName;
                 let outputNameFileResizedPath = dirOutputFilesWorkingParameters + "\\"  + outputFileName.substr(0,lengthName) + "Resized.mp4";
                 console.log(outputNameFileResizedPath);
                 let exeCommandResizeFile = ffmpegExePath + " -y -i " + outputNameFilePath + " -c:a copy -s " + frameWidthResizedValue +"x"+ frameHeightResizedValue + " " + outputNameFileResizedPath;
                     console.log(exeCommandResizeFile);
                     childProcess.execSync(exeCommandResizeFile, function(err, data) {
                             console.log(err)
                             console.log(data.toString());
                 });


                 /////////////////////
                 //
                 //
                 // Cutting time parameters
                 //
                 /////////////////////////

                 var cuttingStartTime = req.body.cuttingStartTime;
                 console.log("req.body.cuttingStartTime =", req.body.cuttingStartTime);
                 var cuttingEndTime = req.body.cuttingEndTime;
                 console.log("req.body.cuttingEndTime =", req.body.cuttingEndTime);

                 let outputNameFileTimeCutted = dirOutputFilesWorkingParameters + "\\"  + outputFileName.substr(0,lengthName) + "ResizedTimeCutted.mp4";
                   //console.log(outputNameFileTimeCutted);
                   let exeCommandTimeCuttedFile = ffmpegExePath + " -y -i " + outputNameFileResizedPath + " -ss " + cuttingStartTime + " -to "  + cuttingEndTime + " "  + outputNameFileTimeCutted;
                   console.log(exeCommandTimeCuttedFile);
                   childProcess.execSync(exeCommandTimeCuttedFile, function(err, data) {
                           console.log(err)
                           console.log(data.toString());
                 });

                ////////////////////////////////
                //
                //  Send the video to client
                //
                /////////////////////////////////

          /*      let videoPath = dirOutputFilesWorkingParameters + "\\" + outputFileName.substr(0,lengthName) + "ResizedTimeCutted.mp4";
                console.log("videoPath = ", videoPath)

                const videoSize = fs.statSync(videoPath).size;

                const rs = fs.createReadStream(videoPath);

                // get size of the video file
                const { size } = fs.statSync(videoPath);

                  //res.setHeader("Content-Type", "video/mp4");
                  //res.setHeader("Content-Length", size);
                  rs.pipe(res);
           */


               }
             }
           })

});

/*
app.post("/selectVideoFile", function(req, res){
  console.log("app.post(/selectVideoFile=================");

  const user =  new User({
    username: req.user.username,
    password: req.user.password
  });

  console.log(user)

  User.findById(req.user.id, function(err, foundUser){

    if(err){
      console.log(err);
    } else {
      if(foundUser){

        //console.log(res)
        //const jsonContent = JSON.parse(req);
        //res.json({ msg:
        //           `Selected video file for processing is ${req.body.selectedVideoFileForProcessing}`});

        const data = JSON.stringify(req.body);
        //console.log("req.body = ", req.body);

        var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
        //console.log(dirUser)
        var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
        //console.log(dirJsonFiles)

        outputFileNameJSON = dirJsonFiles + "\\selectedVideoFileForProcessing.json";
        //console.log("outputFileNameJSON = ", outputFileNameJSON)

        //let outputFileNameJSON = './myjsonfile.json';
        fs.writeFileSync(outputFileNameJSON, data, (err) =>{
        if (err) throw err;
          console.log('Data written to file');
        });
        console.log("app.get(/selectVideoFile+++++++++++++++++++++++++++++++++++++++video");
        res.redirect("/video_processing");

       }
     }
   })

})*/


app.get("/selectVideoFileAnnotationParameters", function (req, res) {
console.log("app.get(/selectVideoFileAnnotationParameters=================");

          console.log("req.user = ", req.user)
          //console.log("req.body = ", req.body)

          if(req.isAuthenticated()){


              var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
              //console.log(dirUser)
              var dirUploads =   dirUser  + "\\" + 'uploads';
              //console.log(dirUploads)
              var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
              //console.log(dirJsonFiles)

              let videoFileToShowJson = dirJsonFiles + "\\" + "selectedVideoFileForProcessing.json";

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

              var lengthObj = Object.keys(data).length;
              console.log(lengthObj)
              console.log(data)

              if(lengthObj == 2 ){

                let outputFileName =  videoFileName;
                let outputFileLength = outputFileName.length;
                //console.log("outputFileLength = ", outputFileLength)
                let lengthName = outputFileLength - 4;

                var dirOutputFiles = dirUser  + "\\" + 'outputFiles';
                //console.log(dirOutputFiles)
                var dirOutputFilesWorkingParameters = dirUser  + "\\" + 'outputFilesWorkingParameters';
                //console.log(dirOutputFilesWorkingParameters)

                var outputJSONFileNameTimeCuttedParameters = dirJsonFiles + "\\" + outputFileName.substr(0,lengthName) + "AnnotationParameters.json";

                let objJSONFileNameTimeCuttedParameters = JSON.parse(fs.readFileSync(outputJSONFileNameTimeCuttedParameters));


                var lengthJSONFileNameTimeCuttedParameters = Object.keys(objJSONFileNameTimeCuttedParameters).length;

                console.log("lengthJSONFileNameTimeCuttedParameters = ", lengthJSONFileNameTimeCuttedParameters)

                if(lengthJSONFileNameTimeCuttedParameters !=0) {

                    outputFileNameTimeCuttingParameters = dirOutputFilesWorkingParameters + "\\" + outputFileName.substr(0,lengthName) + "ResizedAnnotated.mp4";
                    //console.log("outputFileNameTimeCuttingParameters = ", outputFileNameTimeCuttingParameters)

                    const videoSize = fs.statSync(outputFileNameTimeCuttingParameters).size;

                    const rs = fs.createReadStream(outputFileNameTimeCuttingParameters);

                    // get size of the video file
                    const { size } = fs.statSync(outputFileNameTimeCuttingParameters);
                    //res.setHeader("Content-Type", "video/mp4");
                    //res.setHeader("Content-Length", size);

                   rs.pipe(res);
                 }
              }

          }
          else {
              res.redirect("/login");
          }




})



app.post("/jsondataAnnotationParameters", function (req, res) {
console.log("app.post(/jsondataAnnotationParameters=================");


const user =  new User({
  username: req.user.username,
  password: req.user.password
});

console.log(user)

User.findById(req.user.id, function(err, foundUser){

  if(err){
    console.log(err);
  } else {
     if(foundUser){

       //console.log(res)
       //const jsonContent = JSON.parse(req);
      	res.json({ msg:
      						 `Input video file is ${req.body.inputVideoFile},
      						 Start Time - Annotation is ${req.body.startTimeAnnotation},
      						 End Time - Annotation is ${req.body.endTimeAnnotation},
                   First annotated line is ${req.body.firstAnnotatedLine},
                   Second annotated line is ${req.body.secondAnnotatedLine},
      						 Third annotated line is ${req.body.thirdAnnotatedLine}`});

            const data = JSON.stringify(req.body);
            console.log("req.body =", req.body);

            console.log("req.body.inputVideoFile =", req.body.inputVideoFile);
            console.log("req.body.startTimeAnnotation =", req.body.startTimeAnnotation);
            console.log("req.body.endTimeAnnotation =", req.body.endTimeAnnotation);
            let firstAnnotatedLine = req.body.firstAnnotatedLine;
            console.log("req.body.firstAnnotatedLine =", req.body.firstAnnotatedLine);
            let secondAnnotatedLine = req.body.firstAnnotatedLine;
            console.log("req.body.secondAnnotatedLine =", req.body.secondAnnotatedLine);
            let thirdAnnotatedLine = req.body.thirdAnnotatedLine;
            console.log("req.body.thirdAnnotatedLine =", req.body.thirdAnnotatedLine);


            var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
            console.log(dirUser)
            var dirUploads =   dirUser  + "\\" + 'uploads';
            console.log(dirUploads)
            var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
            console.log(dirJsonFiles)
            var dirOutputFiles = dirUser  + "\\" + 'outputFiles';
            console.log(dirOutputFiles)
            var dirOutputFilesWorkingParameters = dirUser  + "\\" + 'outputFilesWorkingParameters';
            console.log(dirOutputFilesWorkingParameters)

            let outputFileName = req.body.inputVideoFile;
            console.log("outputFile =", outputFileName)
            let outputFileLength = outputFileName.length;
            console.log("outputFileLength = ", outputFileLength)
            let lengthName = outputFileLength - 4;
            outputFileNameJSON = dirJsonFiles + '/' + outputFileName.substr(0,lengthName) + "AnnotationParameters.json";
            console.log("outputFileNameJSON = ", outputFileNameJSON)

             //let outputFileNameJSON = './myjsonfile.json';
             fs.writeFileSync(outputFileNameJSON, data, (err) =>{
               if (err) throw err;
              console.log('Data written to file');
             });


             /////////////////////
             //
             // Resize the video files at 352x640
             //
             //
             /////////////////////////

             let frameWidthResizedValue = 352;
             let frameHeightResizedValue = 640;

             let outputNameFilePath = dirUploads + "\\" + outputFileName;
             let outputNameFileResizedPath = dirOutputFilesWorkingParameters + "\\"  + outputFileName.substr(0,lengthName) + "Resized.mp4";
             //console.log(outputNameFileResizedPath);
             let exeCommandResizeFile = ffmpegExePath + " -y -i " + outputNameFilePath + " -c:a copy -s " + frameWidthResizedValue +"x"+ frameHeightResizedValue + " " + outputNameFileResizedPath;
             console.log(exeCommandResizeFile);
                 childProcess.execSync(exeCommandResizeFile, function(err, data) {
                         console.log(err)
                         console.log(data.toString());
             });

             //////////////////////////////////
             //
             //   Annotate the video
             //
             /////////////////////////////////



             let outputNameFileResizedAnnotated = dirOutputFilesWorkingParameters + "\\"  + outputFileName.substr(0,lengthName) + "ResizedAnnotated.mp4";
             let drawTextFirstLine = "drawtext=text='" + firstAnnotatedLine + ", ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=540:enable='gte(t,17)',"
             let drawTextSecondLine ="drawtext=text='" + secondAnnotatedLine + ", ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=570:enable='gte(t,17)',"
             let drawTextThirdLine = "drawtext=text='" + thirdAnnotatedLine + ", ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=600:enable='gte(t,17)'"
             //console.log(outputNameFileResizedAnnotated);
             //let exeCommandResizeAnnotatedFile = ffmpegExePath + " -y -i " + ".\\" + req.files[i].path + " -c:a copy -s 352x640 " + outputNameFileResized;
             let exeCommandResizeAnnotatedFile = ffmpegExePath + " -y -i " + outputNameFileResizedPath + " -vf " +' "'+ drawTextFirstLine + drawTextSecondLine +
                                                 drawTextThirdLine + '" ' + outputNameFileResizedAnnotated;
             console.log(exeCommandResizeAnnotatedFile);
             childProcess.execSync(exeCommandResizeAnnotatedFile, function(err, data) {
                     console.log(err)
                     console.log(data.toString());
            });

     }
   }
 })

});





/*
app.get('/user',function(req, res){
  console.log("/get user================================DEBUGGING");
  connectEnsureLogin.ensureLoggedIn();
    res.send({user: req.user});
});

app.post('/user',function(req, res){
  console.log("/post user================================DEBUGGING");

  console.log(req.user);
});
*/


app.post('/prepareConcatenateVideos', function (req, res) {

   console.log("app.post('prepareConcatenateVideos'=================");
   const user =  new User({
     username: req.user.username,
     password: req.user.password
   });

   console.log(user)

   User.findById(req.user.id, function(err, foundUser){

     if(err){
       console.log(err);
     } else {
        if(foundUser){

        }
      }
    })

})





app.post('/jsonOrderedVideosFiles', function (req, res) {
  console.log("app.post('jsonOrderedVideosFiles'=================");
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any

    const user =  new User({
      username: req.user.username,
      password: req.user.password
    });

    console.log(user)

    User.findById(req.user.id, function(err, foundUser){

      if(err){
        console.log(err);
      } else {
         if(foundUser){
           console.log("req.body=", req.body)
           console.log("req.body.inputVideoFile = ", req.body.inputVideoFile)
           console.log("req.body.inputVideoFilePath = ", req.body.inputVideoFilePath)

           let newObj = {inputVideoFile: req.body.inputVideoFile,
                       inputVideoFilePath: req.body.inputVideoFilePath};

           res.json({ msg:
                     `Input video file is ${req.body.inputVideoFile},
                      Path video file is ${req.body.inputVideoFilePath}`});

           //const data = JSON.stringify(req.body);
           //console.log("data = ", data);

           //const data = JSON.stringify(dataJSON);

           var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
           console.log(dirUser)
           var dirUploads =   dirUser  + "\\" + 'uploads';
           console.log(dirUploads)
           var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
           console.log(dirJsonFiles)

           let outputOrdoredFileNameJSON = dirJsonFiles + "//jsonVideoOrderedMultipleFiles.json";


           let oldObj = JSON.parse(fs.readFileSync(outputOrdoredFileNameJSON));

           console.log("newObj=", newObj)
           console.log("oldObj=", oldObj)

           oldObj.push(newObj);
           console.log("updatedObj=", oldObj)

           let updatedObj = JSON.stringify(oldObj);


           fs.writeFileSync(outputOrdoredFileNameJSON, updatedObj, (err) =>{
              if (err) throw err;
              console.log('Data written to file');
           });

         }
       }

     })




})





app.post('/jsonRemoveFromOrderedVideosFiles', function (req, res) {
  console.log("app.post('jsonRemoveFromOrderedVideosFiles'=================");
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any

    console.log("req.body=", req.body)
    console.log("req.body.inputVideoFile = ", req.body.inputVideoFile)
    console.log("req.body.inputVideoFilePath = ", req.body.inputVideoFilePath)

    let newObj = {inputVideoFile: req.body.inputVideoFile,
                inputVideoFilePath: req.body.inputVideoFilePath};

    res.json({ msg:
              `Input video file is ${req.body.inputVideoFile},
               Path video file is ${req.body.inputVideoFilePath}`});



    //const data = JSON.stringify(req.body);
    //console.log("data = ", data);

    //const data = JSON.stringify(dataJSON);
    var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
    console.log(dirUser)
    var dirUploads =   dirUser  + "\\" + 'uploads';
    console.log(dirUploads)
    var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
    console.log(dirJsonFiles)
    let outputOrdoredFileNameJSON = dirJsonFiles + "//jsonVideoOrderedMultipleFiles.json";


    let oldObj = JSON.parse(fs.readFileSync(outputOrdoredFileNameJSON));
    console.log("length = ", oldObj.length)

    console.log("newObj=", newObj)
    console.log("oldObj=", oldObj)

    for (let i=0; i< oldObj.length; i++){
      if (oldObj[i].inputVideoFile == newObj.inputVideoFile) {
       delete oldObj[i];
       console.log("Result");
     }
    }
    var res = oldObj.filter(elements => {
     return elements !== null;
    })

    console.log("res= ", res)
    //delete oldObj.newObj;


    let updatedObj = JSON.stringify(res);

    console.log("updatedObj=", updatedObj)
    fs.writeFileSync(outputOrdoredFileNameJSON, updatedObj, (err) =>{
       if (err) throw err;
       console.log('Data written to file');
    });


})



app.get('/videoConcatenatedSrc', function (req, res) {
  console.log("app.get(/videoConcatenatedSrc=================");


  console.log("req.user = ", req.user)
  //console.log("req.body = ", req.body)

  //console.log(req.user)
    if(req.isAuthenticated()){

        var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
        //console.log(dirUser)
        var dirOutputFiles =   dirUser  + "\\" + 'outputFiles';

        var videoPath = dirOutputFiles + "\\" + "output.mp4";

        if (!fs.existsSync(videoPath)) {
           console.log("No output file exists!")
          }
        else
          {
            const rs = fs.createReadStream(videoPath);
            const { size } = fs.statSync(videoPath);

            // get size of the video file

            res.setHeader("Content-Type", "video/mp4");
            res.setHeader("Content-Length", size);

            rs.pipe(res);
          }
       }
       else {
         //res.render("video_processing");
         res.redirect("/login");
     }
})



app.post('/concatenateVideos', function (req, res) {
  console.log("app.post('concatenateVideos'=================");
////////////////////////////////
//
//  Read JSON ordered file
//
//////////////////////////////

const user =  new User({
  username: req.user.username,
  password: req.user.password
});

console.log(user)

User.findById(req.user.id, function(err, foundUser){

    if(err){
      console.log(err);
    } else {

     if(foundUser){


          var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
          console.log(dirUser)
          var dirUploads =   dirUser  + "\\" + 'uploads';
          console.log(dirUploads)
          var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
          console.log(dirJsonFiles)
          var dirOutputFiles = dirUser  + "\\" + 'outputFiles';
          console.log(dirJsonFiles)


          let outputOrdoredFileNameJSON = dirJsonFiles + "\\jsonVideoOrderedMultipleFiles.json";
          let oldObj = JSON.parse(fs.readFileSync(outputOrdoredFileNameJSON));

          lengthJsonOrderedFiles = oldObj.length;
          console.log(lengthJsonOrderedFiles)

          //////////////////////////////////////////
          //
          // Resize the video files at 352x640
          //
          //////////////////////////////////////////

          let frameWidthResizedValue = 352;
          let frameHeightResizedValue = 640;


          for (i=0; i<lengthJsonOrderedFiles; i++ ){
              let outputFileName = oldObj[i].inputVideoFile;
              console.log("outputFileName =", outputFileName)
              let outputFileLength = outputFileName.length;
              console.log("outputFileLength =", outputFileLength)
              let lengthName = outputFileLength - 4;
              console.log("lengthName =", lengthName)

              let outputNameFilePath = dirUploads + "\\" + outputFileName;
              console.log("outputNameFilePath =", outputNameFilePath)
              let outputNameFileResizedPath = dirOutputFiles + "\\"  + outputFileName.substr(0,lengthName) + "Resized.mp4";
              console.log("outputNameFileResizedPath =", outputNameFileResizedPath)
              let exeCommandResizeFile = ffmpegExePath + " -y -i " + outputNameFilePath + " -c:a copy -s " + frameWidthResizedValue +"x"+ frameHeightResizedValue + " " + outputNameFileResizedPath;
              console.log("exeCommandResizeFile=", exeCommandResizeFile);
              childProcess.execSync(exeCommandResizeFile, function(err, data) {
                         console.log(err)
                          console.log(data.toString());
             });
          }



          //////////////////////////////////
          //
          //   Annotate the video
          //
          /////////////////////////////////

        for (i=0; i<lengthJsonOrderedFiles; i++ ){

            let outputFileName = oldObj[i].inputVideoFile;
            let outputFileLength = outputFileName.length;
            console.log("outputFileLength = ", outputFileLength)
            let lengthName = outputFileLength - 4;
            let outputFileNameJSON = dirJsonFiles + "\\" + outputFileName.substr(0,lengthName) + "AnnotationParameters.json";
            console.log("outputFileNameJSON = ", outputFileNameJSON)

            let outputNameFileResizedPath = dirOutputFiles + "\\"  + outputFileName.substr(0,lengthName) + "Resized.mp4";

            let objAnnotation = JSON.parse(fs.readFileSync(outputFileNameJSON));
            let firstAnnotatedLine = objAnnotation.firstAnnotatedLine;
            console.log("firstAnnotatedLine =", firstAnnotatedLine);
            let secondAnnotatedLine = objAnnotation.firstAnnotatedLine;
            console.log("secondAnnotatedLine =",secondAnnotatedLine);
            let thirdAnnotatedLine = objAnnotation.thirdAnnotatedLine;
            console.log("thirdAnnotatedLine =", thirdAnnotatedLine);


            let outputNameFileResizedAnnotated = dirOutputFiles + "\\"  + outputFileName.substr(0,lengthName) + "ResizedAnnotated.mp4";
            let drawTextFirstLine = "drawtext=text='" + firstAnnotatedLine + ", ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=540:enable='gte(t,17)',"
            let drawTextSecondLine ="drawtext=text='" + secondAnnotatedLine + ", ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=570:enable='gte(t,17)',"
            let drawTextThirdLine = "drawtext=text='" + thirdAnnotatedLine + ", ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=600:enable='gte(t,17)'"
            console.log(outputNameFileResizedAnnotated);
            //let exeCommandResizeAnnotatedFile = ffmpegExePath + " -y -i " + ".\\" + req.files[i].path + " -c:a copy -s 352x640 " + outputNameFileResized;
            let exeCommandResizeAnnotatedFile = ffmpegExePath + " -y -i " + outputNameFileResizedPath + " -vf " +' "'+ drawTextFirstLine + drawTextSecondLine +
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

         for(var i=0;i<lengthJsonOrderedFiles;i++){
             let outputFileName = oldObj[i].inputVideoFile;

             let outputFileLength = outputFileName.length;
             console.log("outputFileLength = ", outputFileLength)
             let lengthName = outputFileLength - 4;

             let outputNameFileResizedAnnotated = dirOutputFiles + "\\" + outputFileName.substr(0,lengthName) + "ResizedAnnotated.mp4";
         	   console.log(outputNameFileResizedAnnotated);
             let outputNameTSFileResizedAnnotated = dirOutputFiles +  "\\" + outputFileName.substr(0,lengthName) + "ResizedAnnotated" + ".ts";
             console.log(outputNameTSFileResizedAnnotated);
             let exeCommandCreateTSFile = ffmpegExePath + " -y -i " + outputNameFileResizedAnnotated + " -c copy" + " " + outputNameTSFileResizedAnnotated;
             console.log(exeCommandCreateTSFile);
             childProcess.execSync(exeCommandCreateTSFile, function(err, data) {
                     console.log(err)
                     console.log(data.toString());
         });
         }


           for(var i=0;i<lengthJsonOrderedFiles;i++){
               let outputFileName = oldObj[i].inputVideoFile;

               let outputFileLength = outputFileName.length;
               console.log("outputFileLength = ", outputFileLength)
               let lengthName = outputFileLength - 4
               let inputNameTSFileResized =  outputFileName.substr(0,lengthName) + "ResizedAnnotated" + ".ts";
               console.log(inputNameTSFileResized);
               if(i==0){
                 let exeCommandWriteTSFileToTextFile = "echo file " + "'" + inputNameTSFileResized + "'" + " > " + dirOutputFiles + "\\resultfile.txt";
                 console.log(exeCommandWriteTSFileToTextFile);
                 childProcess.execSync(exeCommandWriteTSFileToTextFile, function(err, data) {
                             console.log(err)
                             console.log(data.toString());
                           });
                         }
                         else if(i>=1){
                           let exeCommandWriteTSFileToTextFile = "echo file " + "'" + inputNameTSFileResized + "'" + " >> " + dirOutputFiles + "\\resultfile.txt";
                           console.log(exeCommandWriteTSFileToTextFile);
                           childProcess.execSync(exeCommandWriteTSFileToTextFile, function(err, data) {
                                       console.log(err)
                                       console.log(data.toString());
                                     });
                         }
             }

              //////////////////////
              //
             //      Concatenate
             //
             ////////////////////////

                 let outputNameConcatenatedFiles = dirOutputFiles + "\\output.mp4";
                 console.log(outputNameConcatenatedFiles);
                 let exeCommandConcatenate = ffmpegExePath + " -y -f concat -safe 0 -i " + dirOutputFiles + "\\resultfile.txt " + " -c copy " + outputNameConcatenatedFiles;
                 console.log(exeCommandConcatenate);
                 childProcess.execSync(exeCommandConcatenate, function(err, data) {
                         console.log(err)
                         console.log(data.toString());
             });

           }
         }
       })
})




app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

app.get('/user',function(req, res){
    console.log("/get user================================DEBUGGING");
    console.log(req.user)
    console.log(res.user)
    res.send({user: req.user})
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
