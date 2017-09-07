// Generated by CoffeeScript 1.7.1

/*
 ===========================================================

  Contact Form (SES Example)- No Javascript (Woo!)

  Created by Daniel Rowe
  http://danielrowe.me

============================================================
 */

(function() {
  var app, config, connect, http, isFieldValid, nodemailer, ses, validEmail;

  connect = require("connect");

  http = require("http");

  nodemailer = require("nodemailer");

  ses = require("nodemailer-ses-transport");

  config = require("./config");

  isFieldValid = function(field) {
    return (field != null) && field.length > 0;
  };

  validEmail = function(email) {
    var re;
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  app = connect().use(connect.bodyParser()).use(function(req, res) {
    var date, email, ip, message, name, question, subject, tel, transport, valid, _ref;
    _ref = req.body, name = _ref.name, email = _ref.email, tel = _ref.tel, subject = _ref.subject, question = _ref.question;
    valid = isFieldValid(name) && isFieldValid(email) && isFieldValid(question);
    if (valid) {
      transport = nodemailer.createTransport(ses({
        AWSAccessKeyID: config.AWSAccessKeyID,
        AWSSecretKey: config.AWSSecretKey
      }));
      question = (question.replace(/<(?:.|\n)*?>/gm, '') + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
      date = new Date().toJSON().toString();
      ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      validEmail(function(email) {
        var re;
        re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      });
      if (!validEmail(email)) {
        return res.redirect(config.siteURL + '/#error');
      } else {
        message = {
          from: name + ' <' + config.SESFrom + '>',
          replyTo: name + ' <' + email + '>',
          to: 'Contact Form <' + config.emailTo + '>',
          subject: 'Online Contact Form: ' + subject,
          html: "<b>Site enquiry:</b> <br><br> <i>Sender:</i> " + name + "<br> <i>Email:</i> " + email + "<br> <i>Telephone:</i> " + tel + "<br> <i>Subject:</i> " + subject + "<br><br>" + question + "<br><br><br> -------------------------------------------- <br> Send Time: <i>" + date + "</i><br> User IP: <i>" + ip + "</i>"
        };
        return transport.sendMail(message, function(error) {
          if (error) {
            console.log('Error occured');
            console.log(error.message);
            return res.redirect(config.siteURL + '#error');
          } else {
            console.log('Message sent successfully!');
            return res.redirect(config.siteURL + '#success');
          }
        });
      }
    } else {
      return res.redirect(config.siteURL + '#error');
    }
  });

  http.createServer(app).listen(config.NoJSPort);

  console.log("Contact-NoJS server running on port" + config.NoJSPort);

  console.info("Created by Daniel Rowe (http://danielrowe.me)");

}).call(this);