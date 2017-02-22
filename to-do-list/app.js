var express = require("express");
var handlebars = require("express-handlebars");
var MongoClient = require("mongodb").MongoClient;
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "public"));

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: {
  	section: function(name, options) {
  		if (!this._sections) this._sections = {};
  		this._sections[name] = options.fn(this);
  		return null;
  	}
  }
}));

app.set("view engine", "handlebars");

var db;

MongoClient.connect("mongodb://cynthia:idm2017@ds145369.mlab.com:45369/to-do-list",
	function(err, database) {
		if (err) return console.log(err);

		db = database;
		var port = process.env.PORT || 3000;
		app.listen(port, function() {
			console.log("App is running on port " + port);
		});
	});

app.get("/", function(req, res) {
	db.collection("goals").find({}).toArray(function(err, results) {
		res.render("home", {goals: results});
	});
});

app.get("/add", function(req, res) {
	res.render("add-notes");
});

app.post("/add", function(req, res) {

	var d = new Date();
	var month = parseInt(d.getMonth())+1;
	month = month > 9? "" + month : "0" + month;
	var minute = d.getMinutes();
	minute = minute > 9? ""+ minute: "0" + minute;

	var dueDate = req.body.due_date === ""? null: "Due on: " + req.body.due_date;
	var dueTime = req.body.due_hour === ""? null: req.body.due_hour + ":" + req.body.due_min;
	var rawContent = req.body.content.trim();

	var goal = {
		content: rawContent,
		stripContent: rawContent.replace(/[^A-Za-z0-9]/g, ""),
		tag: req.body.tag.trim(),
		create_date: d.getFullYear() + "-" + month + "-" + d.getDate() + "  " + d.getHours() + ":" + minute, 
		due_date: dueDate,
		due_time: dueTime
	};
    
    if (goal.content === "") {
		res.render("add-notes", {message: "Please enter your to-do."});
		} else {
			db.collection("goals").insert(goal, function(err, result) {
				res.redirect("/");
		});
	}
	
});

app.get("/delete/:content", function(req, res) {
	db.collection("goals").remove({content: req.params.content}, function(err, result) {
		if (err) console.log(err);
		res.redirect("/");
	});
});

app.get("/edit/:content", function(req, res) {
	db.collection("goals").findOne({content: req.params.content}, function(err, result) {
    if (err) console.log(err);
    res.render('edit-notes', {goal: result});
  });
});
	
app.post("/edit-goals", function(req, res){

	var d = new Date();
	var month = parseInt(d.getMonth())+1;
	month = month > 9? "" + month : "0" + month;
	var minute = d.getMinutes();
	minute = minute > 9? ""+ minute: "0" + minute;

	var dueDate = req.body.due_date === ""? null: "Due on: " + req.body.due_date;
	var dueTime = req.body.due_hour === ""? null: req.body.due_hour + ":" + req.body.due_min;

	var goal = {
		content: req.body.content.trim(),
		tag: req.body.tag.trim(),
		create_date: d.getFullYear() + "-" + month + "-" + d.getDate() + "  " + d.getHours() + ":" + minute, 
		due_date: dueDate,
		due_time: dueTime
	};

	db.collection("goals").updateOne({content: goal.content}, 
		{$set: {tag: goal.tag, create_date: goal.create_date, 
			due_date:goal.due_date, due_time:goal.due_time}}, function(err, result) {

   		res.redirect('/');
	});
});
				
		
// CATCH ALL 
app.get("*", function(req, res) {
	res.redirect("/");
});

