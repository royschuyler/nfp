console.log('hello');
var test = "yaaa"

var btn = $('btn');
var body = $('body');

// body.css('background-color',"")


$(document).ready(function(){
  $('.test').on('click', function(e) {
    e.preventDefault()
    console.log('heyy')
  });
});

