# SES Contact Us

This is a simple contact handler that will send an email to your inbox regarding their request. Although the email will come from your email address, it'll always reply to the person who sent it.

I put this together for a small project I was creating, but if anyone else can find a use for it - please do!

Currently this supports the following inputs *(Please use the names provided in brackets for your form)*:

* Name (name)
* Email (email)
* Telephone (tel) *optional*
* Subject (subject) *optional*
* Question (question)

## Contents
* [Why SES?](#whyses)
* [No JS?](#nojs)
* [Examples](#examples)
* [Setup](#setup)
* [To Do](#todo)
* [Licence](#licence)


### <a name="whyses"></a>Why SES?
It's cheap, and I was looking for a way to gain experience with the software.

As this uses nodemailer it would be simple to convert to SMTP if you wish, although I do intend to make it easier to setup in the near future.

### <a name="nojs"></a>No-JS?
Believe it or not, some users still don't have JavaScript enabled - and while not many, it's still worth making sure your applications support it.

With JS there is verification done to ensure all required items have been filled in, then data is submitted by AJAX to the server where it will get a JSON response and handle it gracefully

Without JavaScript, verification is done by the server and then redirected either to a success or an error message on the same page.  If there was an error, to make things simpler users are asked to send an email instead.

### <a name="examples"></a>Examples
If you'd like to see the code you'll need, please look at the [front-end example](/front-end%20example) folder.

## <a name="setup"></a>Setup
Coming soon...

### <a name="todo"></a>To Do...
I have several more features to add to this yet, look bellow to see what. Feel free to request any with a feature request.

* Custom Inputs (Plus optional required)
* Different Email Methods

### <a name="licence"></a>Licence
The MIT License (MIT)

Copyright &copy; 2014 - Daniel Rowe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.