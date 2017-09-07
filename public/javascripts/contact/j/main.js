var server = "http://yourserver:1407";

$("#contactform").submit(function(event) {

  //Make inputs easier to select.
  var   uname = $("input[name='name']"),
        email = $("input[name='email']"),
        subject = $("input[name='subject']"),
        question = $("textarea[name='question']");

  //Our input validator
  function isValid(field) {
    return (field.val() != null) && field.val().length > 0;
  }

  if(!isValid(uname)) {  //Is there a valid name?
    $("#error").html("Please enter your name.");
    $("#error").slideDown();
    uname.focus();
    return false;
  }
  else if(!isValid(email)) { //Check for email input and valid email
    $("#error").html("Please enter your email address.");
    $("#error").slideDown();
    email.focus();
    return false;
  }
  else if(!isValid(question)) { //Ensure they are asking a question
    $("#error").html("Please enter your question.");
    $("#error").slideDown();
    question.focus();
    return false;
  }
  else if(!isValid(subject)) { //So its easier for us, please could they fill in a subject?
    $("#error").html("Please enter a subject.");
    $("#error").slideDown();
    subject.focus();
    return false;
  }
  else {  //We're good to go!
    $.post(server,$("#contactform").serialize()).done(function (data) {
      if(data.response == "passed") {
        $("#success").html("Message sent!  We'll get back to you shortly.");
        $("#success").slideDown();
        $("#contactform")[0].reset();
      }
      else {
        //Error codes and reasons
        var errors = {
          '1000': 'Please check you have filled all the boxes.',
          '1001': 'Server Error. Please try again later.',
          '1003': 'Please enter a valid email address',
          '1011': 'Sorry your message has been flagged as spam.'
        };
        $("#error").html(errors[data.error_code]);
        $("#error").slideDown();
      }
    }).fail( function(xhr, textStatus, errorThrown) {
      $("#error").html(xhr.statusText);
      $("#error").slideDown();
    }); 
    return false;
  }
  return false;
});