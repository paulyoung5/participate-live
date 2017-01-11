var data = {
              applesCount: 0,
              grapefruitCount: 0
            };
var app = new Vue({el: "#fruitPoll",
                  data: data});

  var socket = io();

  $('.ui.radio.checkbox').checkbox();

  $('.mobileMenuButton').click(function() {
    $('.ui.sidebar').sidebar('setting', 'transition', 'slide out').sidebar('toggle');
    return false;
  });

  $('.eventEmitter').click(function() {

    var selected = $('input[name=fruit]:checked', '#fruitPoll').val();

    socket.emit('button press');

    return false;

  });
