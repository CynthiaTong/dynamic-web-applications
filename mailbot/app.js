var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var Request = require("request");
var MongoClient = require("mongodb").MongoClient;

var nodemailer = require("nodemailer");
var schedule = require('node-schedule');


var app = express();
app.use(express.static(__dirname + "/public"));

//body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var credObj = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
var mailbox = credObj.address;
var mailpass = credObj.password;
var apiKey = credObj.apikey;
var receivers = credObj.receivers;
var db = credObj.db;

var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: mailbox,
    pass: mailpass
  }
});

MongoClient.connect(db, function(err, database) {
  if (err) return console.log(err);

  db = database;

  var port = process.env.PORT || 5000;
  app.listen(port, function() {
    console.log("app started on port: " + port);
  });
});

app.get("/", function(req, res){
  res.render("index");
});

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [schedule.Range(1,7)];
// rule.hour = 10;
rule.minute = 38;

var j = schedule.scheduleJob(rule, function(){
    console.log('Time to send email!');

    db.collection("mailinglist").find({}).toArray(function(err, data) {

      if (!data.length) {
        console.log("No receivers exist.");
        return;
      }

      for (var i in data) {

            var user = data[i].email;
            var searchWord = data[i].topic;
            var recency = data[i].recency;

            var nyTimesUrl = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/" +
                             searchWord + "/" + recency + ".json?api-key=" + apiKey;

            var articlesHtml = "";

            Request.get({
              url: nyTimesUrl,
              json: true
            },
            function(err, response, body) {

              if (err) {
                console.log("Error: " + err);
                res.render("index");
              }

              var num = 10;
              var results = body.results;
              var numResults = results.length;
              var randomStart = Math.floor(Math.random()*(numResults-10));

              if (randomStart > 0) {
                for (var i = randomStart; i <= (randomStart + 10); i++) {
                  articlesHtml += "<p><a href='"+ results[i].url + "' " +
                                  ">" + results[i].title + "</a></p>";
                }
             }

             var mailOptions = {
               from: mailbox,
               to: user,
               subject: "Your nyTimes  " + searchWord + "  Articles",
               html: articlesHtml
             };

             transporter.sendMail(mailOptions, function(error, info){
               if(error){
                   console.log(error);
               }else{
                   console.log("Email sent to " + user);
               }
             });

            });

        }

    });
});


app.post("/sendmail", function(req,res) {

  var email = req.body.email;
  var section = req.body.section;
  var period = req.body.period;

  var receiver = {
    email: email,
    topic: section,
    recency: period
  };
  var addedToList = false;

  db.collection("mailinglist").insert(receiver, function(err, result) {
    if (err) console.log(err);
    addedToList = true;
  });

  var nyTimesUrl = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/" +
                   section + "/" + period + ".json?api-key=" + apiKey;

  var articlesHtml = "";


  Request.get({
    url: nyTimesUrl,
    json: true
  },
  function(err, response, body) {

        if (err) {
          console.log("Error: " + err);
          res.render("index");
        }

        var num = 10;
        var results = body.results;
        var numResults = results.length;
        var randomStart = Math.floor(Math.random()*(numResults-10));

        if (randomStart > 0) {
          for (var i = randomStart; i <= (randomStart + 10); i++) {

            articlesHtml += "<p><a href='"+ results[i].url + "' " +
                            ">" + results[i].title + "</a></p>";
          }

      }

        if (articlesHtml) {

          var mailOptions = {
            from: mailbox,
            to: email,
            subject: "Your nyTimes  " + section + "  Articles",
            html: articlesHtml
          };

          transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                res.send("Error, cannot send Email. Try again!");
            }else{
                console.log("Email sent!");
                // res.json({"sent-message": info.response});
                if (addedToList) {
                  res.send("Added to Mailing List & Email is sent!");
                }
                else
                  res.send("Email is sent but couldn't add to mailing list. Try again!");
            }
          });
        }
        else {
            res.send("Error, cannot send Email. Try again!");
        }

    });
});

app.post("/unsubscribe", function(req, res) {
  var user = req.body.email;

  db.collection("mailinglist").find({}).toArray(function(err, data) {

    for (var i=0; i < data.length; i++) {
      if (data[i].email === user) {

        db.collection("mailinglist").remove({_id: data[i]._id},
          function(err, result) {
          if (err) {
            console.log(err);
            res.send("Error unsubscribe. Try Again!");
            return;
          }
        });

      }
    }

    res.send(user + " is unsubscribed from mailing list.");
  });


});
