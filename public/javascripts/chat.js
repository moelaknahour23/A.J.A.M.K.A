
 var msgTemplate = _.template(
            $( "#msg-item-template" ).html()
        );

var socket = io();

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

function chat_init(){
     $("#chat-modal").easyModal({
    });
}

function createMessage(msg, nickname, id, timestamp, left){
    console.log(timestamp);
    var context = {
        m: msg,
        n: nickname,
        t: timestamp,
        i: id
    };
    
    var html = msgTemplate(context);
    var template = document.createElement('template');
    template.innerHTML = html;
    var element = template.content.firstElementChild;
    if(left) element.classList.add('msg-left');
    else element.classList.add('msg-right');
    return element;
}

function closeModal(){
     $('#chat-modal').animateCss('bounceOutDown');
     ('#yourElement').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
             $('#chat-modal').trigger('closeModal');
     });
}


function openChat(chatroomid, title){

    var modalTitle = document.getElementsByClassName('modal-title')[0];
    modalTitle.textContent = title;

    $("#messages").empty();

        var json = {
        reqType: 'get-current'
      };
      var room = 'chat-' + chatroomid;
      $.post('/usersapi', json, function(userData){
        var nickname = userData.nickname;
        var id = userData.id;
        socket.emit('join', room, userData, function() {
            $('form').unbind();
            $('form').submit(function(e) {
            e.preventDefault();
            var message = $('#m').val();
            if(message.length > 0){
                socket.emit('chat message', message);
                
                var json = {
                    reqType: 'post-chat',
                    chatroomid: chatroomid,
                    msg: message
                };
                
                $.post('/chatapi', json, function(data){
                        console.log('Succesfully sent data to server');
                });

                var date = new Date(Date.now());
                var month = date.getMonth();
                var day = date.getDay();
                var time = date.getHours() + ':' + date.getMinutes(); 
                var ampm = (date.getHours() >= 12) ? "p.m" : "a.m";
                var fullTime = month + "/" + day + ", " + time + ampm

                $('#messages').append(createMessage(message, nickname, id, fullTime, true));
                scrollToBottomChat();
                $('#m').val('');
            }
            return false;
        });

            var json = {
                reqType: 'get-messages',
                chatroomid: chatroomid
            };

        $.post('/chatapi', json, function(data){
                    console.log('Succesfully sent data to server');
            }).done(function(data){
                $.each(data, function(){

                    var date = new Date(this.time);
                    var month = date.getMonth();
                    var day = date.getDay();
                    var time = date.getHours() + ':' + date.getMinutes(); 
                    var ampm = (date.getHours() >= 12) ? "p.m" : "a.m";
                    var fullTime = month + "/" + day + ", " + time + ampm

                    console.log('Comparing login:' + nickname + " with: " + this.nickname);
                    $('#messages').append(createMessage(this.msg, this.nickname, this.authorid, fullTime, (nickname == this.nickname)));
                })
                scrollToBottomChat();
            });


        });

        

        $('#chat-modal').trigger('openModal');
    });


 

}

   function scrollToBottomChat(){
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    }
    