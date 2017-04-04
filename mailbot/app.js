#!/usr/local/bin/node

var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var Request = require("request");
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

var nodemailer = require("nodemailer");
var session = require('express-session');


var app = express();
app.use(express.static(__dirname + "/public"));

//session middleware
app.use(session({ secret: 'secret', cookie: { maxAge: 60000 }}));

//ejs views
app.set("views", __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

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

  // routineMail();

  var port = process.env.PORT || 5000;
  app.listen(port, function() {
    console.log("app started on port: " + port);
  });
});

app.get("/", function(req, res){
  res.render("index",  {msg: ""});
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
  var userExist = false;

  db.collection("mailinglist").find({}).toArray(function(err, data) {
    //  console.log(data);

     for (var i in data) {
         if (data[i].email === email && data[i].topic === section && data[i].recency === period) {
             userExist = true;
             console.log("dupicate users");
             break;
        }
     }

     if (!userExist) {
         db.collection("mailinglist").insert(receiver, function(err, result) {
           if (err) {
               console.log(err);
               addedToList = false;
           }
           else {
               addedToList = true;
           }
         });
     }

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

          var transporter = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: mailbox,
                pass: mailpass
              }
          });

          var mailOptions = {
            from: mailbox,
            to: email,
            subject: "Your nyTimes  " + section + "  Articles",
            html: articlesHtml
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.render("redirect",  {msg: "Error, cannot send Email. Try again!"});
            }else{
                console.log("Email sent!");
                // res.json({"sent-message": info.response});
                if (addedToList) {
                  res.render("redirect",  {msg: "Added to Mailing List & NYTimes Articles sent!"});
                }
                else if (userExist) {
                  res.render("redirect",  {msg: "User already exists in mailing list. NYTimes Articles sent!"});
                } else {
                  res.render("redirect",  {msg: "NYTimes Articles sent but couldn't add to mailing list. Try again!"});
                }
            }
          });
        }
        else {
          res.render("redirect",  {msg: "Error, cannot send Email. Try again!"});
        }

    });
});

app.post("/unsubscribe", function(req, res) {
  var user = req.body.email;
  var allRecords = [];

  db.collection("mailinglist").find({}).toArray(function(err, data) {

    for (var i=0; i < data.length; i++) {
      if (data[i].email === user) {
          allRecords.push(data[i]);

        // db.collection("mailinglist").remove({_id: data[i]._id},
        //   function(err, result) {
        //   if (err) {
        //     console.log(err);
        //     res.send("Error unsubscribe. Try Again!");
        //     return;
        //   }
        // });

      }
    }
    req.session.results = allRecords;

    res.redirect("/subscriptions");

    console.log(allRecords);
    // res.render("subscriptions");
    // res.send("haha");

    // res.redirect("/subscriptions?data=" + allRecords);
    // res.send(user + " is unsubscribed from mailing list.");
  });

// app.get("/subscriptions", function(req, res) {
//     var variable = req.query.data;
//
//     for (var d in variable) console.log(variable[d]);
//     res.send("got data");
// });

var records;

app.get("/subscriptions", function(req, res) {

    if (req.session.results) {
        records = req.session.results;
        req.session.result = null;
        // JSON.stringify(records);
        // console.log(records);

        if (records.length) {
            res.render("subscriptions", {rec: records} );
        }
        else {
            res.render("index", {msg: "No record of this email. Register below!"});
        }

    }
    else {
        res.send("Cannot retrieve subscription data. Try again!");
    }

});

app.post("/subscriptions", function(req, res) {
    var obj = req.body;
    var objId = req.body._id;

    db.collection("mailinglist").remove({_id: ObjectId(objId)}, function(err, result) {

        if (err) res.send("Cannot unsubscribe. Try again!");

        var index = 0;

        for (var i = 0; i < records.length; i++) {
          if (records[i]._id === objId) {
            index = i;
          }
        }
        records.splice(index, 1);

        if (records.length) {
            res.render("subscriptions", {rec: records} );
        }
        else {
            res.render("index", {msg: "No record of this email. Register below!"});
        }

    });


});

});
