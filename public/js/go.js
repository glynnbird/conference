var thequestion = null;

var answer = function(response) {
  // disable all buttons
  $(".btn").attr('disabled',true);
  console.log(location);
  var obj = {
    user_id: $('#userid').html(),
    question_id: thequestion._id,
    prompt: thequestion.prompt,
    field: thequestion.field,
    answer: response
  };
  $.ajax({
           type: "POST",
           url: "/answer",
           data: obj})
           .done(function(a) {
             console.log("success",a)
           })
           .error(function(e) {
             console.log("error",e);
           })

}


// question looks like this:
/*{
    _id: "123",
    _rev: "567",
    prompt: "Have you used SQL before?",
    field: "used_sql",
    options: ["yes", "no"]
  }
  */

// onload
$(window).load(function() {
  
  var socket = io.connect(location.origin);
  socket.on('question', function (data) {
    console.log("QUESTION",data);
    thequestion = data;
    
    //socket.emit('my other event', { my: 'data' });
    var html = "<h1>" + thequestion.prompt + "</h1><ul class=\"list-inline\">";
    for(var i in thequestion.options) {
      html += "<li><button type=\"button\" class=\"btn btn-info btn-lg\" onclick=\"answer('"+thequestion.options[i]+"')\">" + data.options[i] + "</button></li>";
    }
    html += "</ul>";
    $('#jumbotron').html(html);
  });

});

