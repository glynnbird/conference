var userlist = {};

var answercount = {};
var renderUser = function(user) {
  return "<img id=\"user" + user._id + "\" class=\"userpic\" src=\"" + user.pic+ "\" title=\"" + user.name + "\" />";
}

var moveUser=function(user_id, div) {
  // find position of destination div
  var dest = $("#"+div).position();
  var selector = "#user"+user_id;
  var source = $(selector).position();
  move(selector).translate(dest.left - source.left , dest.top - source.top).end();
}

// onload
$(window).load(function() {
  console.log("Loaded");
  
  var socket = io.connect(location.origin);
  socket.on('question', function (data) {
    console.log("QUESTION",data);
    answercount = { };
    // e.g. { _id: "123", _rev: "567", type: "question", prompt: "Have you used SQL before?", field: "used_sql", options: Array[2] }
    var html = "";
    var bits = 12 / data.options.length;
    for(var i in data.options) {
      html += "<div class=\"col-md-" + bits+ "\"><h2 class=\"center-block\">"+ data.options[i] + "</h2><ul class=\"list-inline\">";
      for (j=0;j<100;j++) {
        html += "<li class=\"placeholder\" id=\"answer" +data.options[i] + j + "\">.</li>";
      }  
      html += "</ul></div>";
      answercount[data.options[i]] = 0;
    }


    $('#answerpods').html(html);
    $('#questionprompt').html('<h1>'+ data.prompt + '</h1>');
    console.log(answercount);
    //socket.emit('my other event', { my: 'data' });
  });

  socket.on('answer', function (data) {
    console.log("ANSWER",data);
    if(typeof answercount[data.answer] != "undefined") {
      var slot = answercount[data.answer]++;
      var selector = 'answer'+data.answer+slot;
      $('#' + selector).html("X");
      moveUser(data.user_id, selector)
    }


  });
  
  socket.on('human', function(data) {
    console.log("HUMAN", data);
    userlist[data._id] = data; 
    $('#userlist').append(renderUser(data));
    
  })

});

