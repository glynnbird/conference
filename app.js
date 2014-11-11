// app.js

var express = require('express'),
  app = express(),
  server = require('http').Server(app),
  moment = require('moment'),
  bodyParser = require('body-parser'),
  url = "http://127.0.0.1:5984",
  cloudant = require('bluemixcloudant'),
  event_name="AYB 2014",
  tweet = require('./lib/tweet.js'),
  io = require('socket.io')(server);
  
  
//setup static public directory
app.use(express.static(__dirname + '/public')); 

// allow posted forms
app.use(bodyParser.urlencoded({ extended: false }))

// use the jade templating engine
app.set('view engine', 'jade');

// connect to cloudant
conference = cloudant.use("conference");
  
  // listen to the changes feed
/*  var feed = conference.follow({since: "now", include_docs:true});
  feed.on("change", function(change) {
    //console.log(change.doc);
    io.emit("post", change.doc);
  });
  feed.follow();*/



// render index page
app.get('/', function(req, res){
  if (event_name.length > 0) {
    res.render('index',{ title: event_name });
  } else {
    res.send(403);
  }
});

app.get("/go/:id", function(req,res) {
  var id = req.params.id;
  conference.get(id, function(err, data) {
    if (err) {
      return res.send(404);
    }
    res.render('go', { user: data, title: event_name })
  }) 
});

// render index page
app.get('/live', function(req, res){
  res.render('live',{ title: event_name });
});

// add form to register a new participant
app.post('/add', function(req, res){
  console.log(req.body);
  tweet.getUserProfile(req.body.handle, function(err, data) {
    if(!err) {
      var obj = data;
      obj.handle = req.body.handle;
      obj.type =  "person";
      obj.ts = moment().utc().unix();
      obj.date= moment.utc().format("YYYY-MM-DD HH:mm:ss Z");
      obj.handle = req.body.handle;
      obj.event_name = event_name;
      conference.insert(obj, function(err, doc) {

        obj._id = doc.id;
        obj._rev = doc.rev;
        console.log(obj);
        io.emit('human', obj);
        res.send(doc);
      })
    } else {
      res.send(404);
    }
  })


});

// record an answer to a question
app.post('/answer', function(req, res){
  var obj = req.body;
  obj.type =  "answer";
  obj.ts = moment().utc().unix();
  obj.date= moment.utc().format("YYYY-MM-DD HH:mm:ss Z");
  obj.event_name = event_name;
  io.emit('answer', obj);
  console.log(obj);
  
  conference.insert(obj, function(err, doc) {
    res.send(doc);
  });
});


setTimeout(function() {
  console.log("sample question");
  var question = {
    _id: "123",
    _rev: "567",
    type: "question",
    prompt: "Have you used SQL before?",
    field: "used_sql",
    options: ["yes", "no"]
  }
  io.emit('question', question);
},5000);
/*
setInterval(function() {
  console.log("answer");
  
 var user =  {
     "_id": "b9b17343691c1ca00bdfafd0fe005175",
     "_rev": "1-7addea7ba836d47fecc5f598609d5b12",
     "name": "Glynn Bird",
     "location": "Stockton-on-tees, UK",
     "description": "Man, UK",
     "url": "http://t.co/uu1stJ6j29",
     "followers": 171,
     "friends": 175,
     "pic": "http://pbs.twimg.com/profile_images/58285534/glynn_normal.jpg",
     "handle": "glynn_bird",
     "type": "person",
     "ts": 1413973971,
     "date": "2014-10-22 10:32:51 +00:00",
     "event_name": "AYB 2014"
  }
  var answer = {
    response: "no",
    user: user
  }

  io.emit('answer', answer);
},3000);*/

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
server.listen(port, host);
console.log('App started on port ' + port);


