//-- Socket.io File Server
//-- https://gist.github.com/rpflorence/701407

var PORT = 8080;
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var fs = require("fs");

var PHOTOS_DIR = "/photos";

app.use(express.static(__dirname));

server.listen(PORT, function() {
  console.log("Listening on port %d", server.address().port);
});

//-- gphoto2 Setup
var gphoto2 = require("gphoto2");
var GPhoto = new gphoto2.GPhoto2();
var camera;
GPhoto.list(function(list) {
  if (list.length === 0) {
    console.log("Cannot find camera!");
    return;
  }
  camera = list[0];
  console.log("Found", camera.model);
});

//-- Socket.io commands
io.on("connection", function(socket) {
  //-- Take the photo and save to drive
  socket.on('takePhoto', function() {
    takePhoto();
  });
});

function takePhoto() {
  if (camera) {
    console.log("Taking photo...");
    camera.takePicture({
      targetPath: "/tmp/foo.XXXXX"
    }, function(er, tmpname) {
      console.log("tmpname: " + tmpname);
      var datetime = new Date().toISOString();
      console.log(datetime);
      fs.renameSync(tmpname, __dirname + PHOTOS_DIR +
                             "/photobooth" + datetime + ".jpg");
      console.log("Done");
    });
  }
};
