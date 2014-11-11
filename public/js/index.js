// bounce to the chosen quiz
var handleHandler = function() {
  $('#submitbutton').attr('disabled',true);
  $('#handlegroup').removeClass('has-error');
  var handle = $('#handle').val();
  $.ajax({
           type: "POST",
           url: "/add",
           data: { handle: handle}})
           .done(function(a) {
             window.location.href = "/go/"+a.id;
           })
           .error(function() {
               $('#submitbutton').attr('disabled',false);
               $('#handlegroup').addClass('has-error');
           })
  return false;
};
