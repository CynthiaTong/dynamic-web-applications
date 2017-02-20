var express = require("express");
var handlebars = require("express-handlebars");
var MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.engine('handlebars', handlebars({
  defaultLayout: 'main'
}));

app.set("view engine", "handlebars");

var db;

MongoClient.connect("mongodb://cynthia:idm2017@ds145369.mlab.com:45369/to-do-list",
	function(err, database) {
		if (err) return console.log(err);

		db = database;
		app.listen(process.env.PORT || 3000);
	});

app.get("/", function(req, res) {
	db.collection("goals").find({}).toArray(function(err, results) {
		res.render("home", {goals: results});
	});
});

app.get("/add", function(req, res) {
	var d = new Date();
	res.render("add-notes", {date: d});
});



// CATCH ALL 
app.get("*", function(req, res) {
	res.redirect("/");
});

