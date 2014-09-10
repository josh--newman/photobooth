//-- Socket.io File Server
//-- https://gist.github.com/rpflorence/701407

var app = require("http").createServer(handler),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8080;
    io = require('socket.io').listen(app);

//-- gphoto2 Setup
var gphoto2 = require("gphoto2");
var GPhoto = new gphoto2.GPhoto2();
var camera;
GPhoto.list(function(list) {
  if (list.length === 0) return;
  camera = list[0];
  console.log("Found", camera.model);
});

app.listen(parseInt(port, 10));

function handler (request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown\n");

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
