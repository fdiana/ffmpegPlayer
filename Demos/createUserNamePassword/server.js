//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const connectEnsureLogin = require('connect-ensure-login'); //authorization

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
var multer  = require('multer')
var fs = require('fs');

const app = express();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       var dirUser = __dirname + '\\UsersCollections\\' + req.user.username + '\\uploads';
     cb(null, dirUser);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage })

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use('/jsonFiles', express.static('jsonFiles'));


//app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
//mongoose.set("useCreateIndex", true);


const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'userDB';      // REPLACE WITH YOUR DB NAME

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

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  //googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
//userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

*/
/*
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
*/

app.get("/", function(req, res){
  res.render("home");
});

/*
app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/video_processing",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to video_processing.
    res.redirect("/video_processing");
  });
*/

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  debugger
  res.render("register");
});

app.get("/video_processing", connectEnsureLogin.ensureLoggedIn(), function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
      //  res.render("video_processing", {usersWithVideoProcessing: foundUsers});
        res.render("video_processing");
      }
    }
  });
});

app.get("/submit", function(req, res){
  debugger
  if (req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", function(req, res){
//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  // console.log(req.user.id);
  User.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
         if (!fs.existsSync(dirUser)){
         fs.mkdirSync(dirUser, { recursive: true });
         }
         else{
           console.log("The user directory exists already!")
         }
         if (!fs.existsSync(dirUserCollection)){
          fs.mkdirSync(dirUserCollection, { recursive: true });
          }
          else{
            console.log("The collection exists already!")
          }
        foundUser.save(function(){
          res.redirect("/video_processing");
        });
      }
    }
  });
});

app.get("/logout", function(req, res){
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
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
        //let userName = req.body.username;
        //console.log(userName.indexOf('@'));
        //let userIndex = user.indexOf('@');
        //let userLength = (req.body.username).length;
        //let userDirName = user.substr(0,userIndex);
        //console.log(userDirName);
        var dirUser = __dirname + '\\UsersCollections\\' + user.username;
        console.log(dirUser)
        if (!fs.existsSync(dirUser)){
          fs.mkdirSync(dirUser, { recursive: true });
        }
        else{
         console.log("The user directory exists already!")
        }

        var dirUploads =   dirUser  + "\\" + 'uploads';
        console.log(dirUploads)

        if (!fs.existsSync(dirUploads)){
            fs.mkdirSync(dirUploads, { recursive: true });
        }
        else{
          console.log("dirUploads exists!")
        }

        var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
        console.log(dirJsonFiles)
        if (!fs.existsSync(dirJsonFiles)){
            fs.mkdirSync(dirJsonFiles, { recursive: true });
            let outputFileNameJSON = dirJsonFiles + "//jsonVideoFile.json";

            let dataJSON = []
            const data = JSON.stringify(dataJSON);

            fs.writeFileSync(outputFileNameJSON, data, (err) =>{
               if (err) throw err;
               console.log('Data written to file');
            });

          }
        else{
          console.log("dirJsonFiles exists!")
        }

        var dirOutputFiles = dirUser  + "\\" + 'outputFiles';
        console.log(dirOutputFiles)
        if (!fs.existsSync(dirOutputFiles)){
             fs.mkdirSync(dirOutputFiles, { recursive: true });
         }
         else{
           console.log("dirOutputFiles exists!")
         }
        var dirOutputFilesWorkingParameters = dirUser  + "\\" + 'outputFilesWorkingParameters';
        console.log(dirOutputFilesWorkingParameters)
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

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
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
          let outputFileNameJSON = dirJsonFiles + "//" + "jsonVideoFile.json";

          let dataJSON = []
          const data = JSON.stringify(dataJSON);

          fs.writeFileSync(outputFileNameJSON, data, (err) =>{
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



app.get("/profile-upload-single", function(req, res){
  console.log("app.get(/profile-upload-single=================");

  if(req.isAuthenticated()){
    res.render("profile-upload-multiple");
  } else {
    res.redirect("/login");
  }
});

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
console.log("=============app.post('/profile-upload-single'=================");
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  //console.log(req);

    console.log(req.user.id);
    User.findById(req.user.id, function(err, foundUser){
      if (err) {
        console.log(err);
      } else {
          if(foundUser){
            let dataJSON = [];
            dataJSON = {inputVideoFile: req.file.originalname,
                      inputVideoFilePath: req.file.path
                   }
            var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
            console.log(dirUser)
            var dirUploads =   dirUser  + "\\" + 'uploads';
            console.log(dirUploads)
            var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
            console.log(dirJsonFiles)
            const data = JSON.stringify(dataJSON);
            let outputFileNameJSON = dirJsonFiles + "//jsonVideoFile.json";
            fs.writeFileSync(outputFileNameJSON, data, (err) =>{
               if (err) throw err;
               console.log('Data written to file');
            });
            res.redirect("/video_processing");
          }
      }
    });
});



app.get("/video", function (req, res) {
console.log("=============app.get(/video=================");

console.log(req.user.id);
/*
if(req.isAuthenticated()){
  res.render("video_processing");
} else {
  res.render("login");
}*/
console.log(req.user)
  if(req.isAuthenticated()){

          var dirUser = __dirname + '\\UsersCollections\\' + req.user.username;
          //console.log(dirUser)
          var dirUploads =   dirUser  + "\\" + 'uploads';
          //console.log(dirUploads)
          var dirJsonFiles = dirUser  + "\\" + 'jsonFiles';
          //console.log(dirJsonFiles)



          let videoFileToShowJson = dirJsonFiles + "\\jsonVideoFile.json";
          let objVideoFileToShow = JSON.parse(fs.readFileSync(videoFileToShowJson));


          var lengthJsonOrderedFiles = Object.keys(objVideoFileToShow).length;

          console.log("lengthJsonOrderedFiles", lengthJsonOrderedFiles)
          console.log("objVideoFileToShow = ", objVideoFileToShow)

          // console.log("lengthJsonOrderedFiles", lengthJsonOrderedFiles);
           if(lengthJsonOrderedFiles == 2){
              let outputPathNameFile = objVideoFileToShow.inputVideoFilePath;
              console.log(outputPathNameFile)

              const videoSize = fs.statSync(outputPathNameFile).size;

              const rs = fs.createReadStream(outputPathNameFile);

              // get size of the video file
              const { size } = fs.statSync(outputPathNameFile);
              res.setHeader("Content-Type", "video/mp4");
              res.setHeader("Content-Length", size);
              rs.pipe(res)
              //res.render(outputNameFile)
            }
            else {
              console.log("error - The json file is empty");
            }

          }
    else {
        res.render("video_processing");
    }


});



app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
