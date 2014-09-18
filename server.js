//-- Socket.io File Server
//-- https://gist.github.com/rpflorence/701407

var PORT = 8080;
var app = require("express")();
var server = require("http").Server(app);
var io = require('socket.io').listen(server);

app.get("/", function(req, res) {
  // res.sendfile(__dirname + "/css/styles.css");
  res.sendfile(__dirname + "/index.html");
});

var server = app.listen(PORT, function() {
  console.log("Listening on port %d", server.address().port);
});

//-- gphoto2 Setup
var gphoto2 = require("gphoto2");
var GPhoto = new gphoto2.GPhoto2();
var camera;
GPhoto.list(function(list) {
  if (list.length === 0) return;
  camera = list[0];
  console.log("Found", camera.model);
});

//-- Socket.io commands
io.set('log level', 1); // reduce logging

io.on("connection", function(socket) {
  //-- Take the photo and save to drive
  socket.on('takePhoto', function() {

    console.log("Taking photo...");
    camera.takePicture({
      targetPath: "/tmp/foo.XXXXX"
    }, function(er, tmpname) {
      console.log("tmpname: " + tmpname);
      fs.renameSync(tmpname, __dirname + "/photos/picture.jpg")
      console.log("Done");
    });

  });
});
