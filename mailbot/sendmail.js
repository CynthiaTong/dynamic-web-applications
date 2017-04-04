var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var Request = require("request");
var MongoClient = require("mongodb").MongoClient;

var nodemailer = require("nodemailer");

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

MongoClient.connect(db, function(err, database) {
  if (err) return console.log(err);

  db = database;

  routineMail();

});

function routineMail() {

    console.log('Time to send email!');

    db.collection("mailinglist").find({}).toArray(function(err, data) {

      if (!data.length) {
        console.log("No receivers exist.");
        return;
      }

      var counter = 0;
      userEmail(counter);

      function userEmail(counter) {

              var user = data[counter].email;
              var searchWord = data[counter].topic;
              var recency = data[counter].recency;
              console.log(searchWord);

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

               var transporter = nodemailer.createTransport({
                 service: "Gmail",
                 auth: {
                   user: mailbox,
                   pass: mailpass
                 }
               });

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
                     console.log("Email sent to " + user + " " + searchWord + " " + recency);

                     // use counter to increment through subscribers asyncronously
                     counter ++;
                     if (counter < data.length) userEmail(counter);
                 }

               });

           });
      }

    });

}
