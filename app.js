
/**
 * App.js: Express App initialization 
 * that allows us to display network logs.
 */

var PORT = 1920; 	//Port that we listen on for connections.

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(8080);


//TCP Server the robot connects to.
var net = require('net');
var server = net.createServer(function(socket){
  //Make sure to set encoding, else we're left with a gross Buffer object.
  socket.setEncoding('utf8');
  socket.on('data', function(data){
    //Push a new log message to the client app
    io.sockets.emit('log_msg', data);
    console.log('data = ' + data);
  });
});

server.listen(PORT, function() { //'listening' listener
  console.log('server bound');
});


