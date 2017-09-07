###
 ===========================================================

  Contact Form (SES Example)- No Javascript (Woo!)

  Created by Daniel Rowe
  http://danielrowe.me

============================================================
###

connect = require("connect")
http = require("http")
nodemailer = require("nodemailer")
ses = require("nodemailer-ses-transport")

config = require("./config") # Load all the settings.

isFieldValid = (field) -> field? and field.length > 0

validEmail = (email) ->
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email);

app = connect()
  .use(connect.bodyParser())  #So we can get the post data.
  .use((req,res) ->
    # pickup the body vars first to ease reading
    {name, email, tel, subject, question} = req.body
    # valid should be always defined, even if it's only true/false
      # Was all the data submitted?
    valid = isFieldValid(name) and isFieldValid(email) and isFieldValid(question)

    if(valid)
      transport = nodemailer.createTransport(ses({                 #Set AWS Keys for SES
          AWSAccessKeyID: config.AWSAccessKeyID
          AWSSecretKey: config.AWSSecretKey
      }))

      #Clean up and format the question
      question = (question.replace(/<(?:.|\n)*?>/gm, '') + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2')
      #Set the date (for send time info)
      date = new Date().toJSON().toString()
      #Now set a easier way to recall the user IP
      ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

      #Validate email address
      validEmail (email) ->
          re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return re.test(email);
      
      if not validEmail(email)
          res.redirect(config.siteURL + '/#error')
      else
        #Email content
        message = {
          from: name+' <' + config.SESFrom + '>'
          replyTo: name+' <' + email + '>'
          to: 'Contact Form <' + config.emailTo + '>'
          subject: 'Online Contact Form: ' + subject
          html: "<b>Site enquiry:</b>
          <br><br>
          <i>Sender:</i> " + name + "<br>
          <i>Email:</i> " + email + "<br>
          <i>Telephone:</i> " + tel + "<br>
          <i>Subject:</i> " + subject + "<br><br>
          " + question + "
          <br><br><br>
          -------------------------------------------- <br>
          Send Time: <i>" + date + "</i><br>
          User IP: <i>" + ip + "</i>
          "
        }
        transport.sendMail(message, (error) ->
          if error
            console.log('Error occured')    #Error sending message
            console.log(error.message)
            res.redirect(config.siteURL + '#error')
          else
            console.log('Message sent successfully!')   #Wooo it sent! Return a json sucess
            res.redirect(config.siteURL + '#success')
        )
    else
      #sling your hook, and give me some info!
      res.redirect(config.siteURL + '#error')
  )

http.createServer(app).listen(config.NoJSPort)  #Lastly lets fire up the server!
console.log("Contact-NoJS server running on port" + config.NoJSPort)
console.info("Created by Daniel Rowe (http://danielrowe.me)")