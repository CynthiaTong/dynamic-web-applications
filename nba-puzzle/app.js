//requirements 
var express = require("express");
// var logger = require("morgan");

var app = express();

//views directory
app.set("views", __dirname + "/views");
app.engine(".html", require("ejs").__express);
app.set("view engine", "html");

//images directory 
app.use("/images", express.static(__dirname + "/images"));

//Middleware - log to terminal 
// app.use(logger("dev"));

//start page 
app.get("/", function(req, res) { 
	var data = {
		title : "Welcome to NBA Puzzle. Play to see how well you know about NBA.",
		question : "Intro Level Question: What's the last name of the Golden State Warriors' #30 player?",
		hint : "Hint: A type of food.",
		instruction: 'Add a "/" and your answer to the url'
	};

	res.render("index", data);
});

app.get("/curry", function(req, res) {
	var data = {
		title : "Now you actually know (or have heard of) NBA. Let's move on!",
		question : "2nd Question: How many points did Kobe Bryant score in his last NBA game?",
		hint : "Hint: Guess high.",
		instruction : 'Add a "/" and your answer to the url'
	};

	res.render("index", data);
});

app.get("/curry/60", function(req, res) {
	var data = {
		title : "A big fan of Kobe, huh? What about LBJ?",
		question : "3rd Question: In what year did LeBron James return to Cleveland?",
		hint : 'Hint: A recent year of course.',
		instruction : 'Add a "/" and your answer to the url'
	};

	res.render("index", data);
});

app.get("/curry/60/2014", function(req, res) {
	var data = {
		title : "What? You're a fan of Curry, Kobe AND James?? Bizarre!",
		question : "Bonus Question: Who's the best player ever in history?",
		hint : "Hint: Wow, how dare you.",
		instruction : 'Add a "/" and your answer to the url'
	};

	res.render("index", data);
});

app.get("/curry/60/2014/:answer", function(req, res) {
	var data = {
		title : req.params.answer + "? You sure?",
		question : "",
		hint : "",
		instruction : ""
	};

	res.render("index", data);
});

//catch all 
app.get("*", function(req, res) {
	var data = {
		title : "No idea what you're talking about. Go back home (page)!",
		question : "",
		hint : "",
		instruction : ""
	}; 
	res.render("index", data);
	// res.redirect("/");
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("app started on port: " + port);