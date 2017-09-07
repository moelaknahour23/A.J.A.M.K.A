(function() {
  $(document).ready(function() {
    return $('#contact-form').submit(function(e) {
      var email, message, name;
      name = document.getElementById('inputName');
      email = document.getElementById('inputEmail');
      message = document.getElementById('inputMessage');
      if (!name.value || !email.value || !message.value) {
        alertify.error('Please check your entries');
        return false;
      } else {
        var d = $('#contact-form').serialize();
        d += '&mentorid=' + document.getElementById("myModal").dataset['mentor']; //Put mentorid here
        $.ajax({
          method: 'POST',
          url: '/email',
          data: d,
          datatype: 'json'
        });
        e.preventDefault();
        $(this).get(0).reset();
        return alertify.success('Message sent');
      }
    });
  });

}).call(this);

