var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

app.use(express.static(__dirname + '/public'));

app.use('/scripts', express.static(__dirname + '/node_modules/'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('button press', function(msg){
    console.log('button was pressed');
  });
});

var port = process.env.PORT || 5000;

http.listen(port, "0.0.0.0", function() {
  console.log('Node app is running on port '+port);
});
