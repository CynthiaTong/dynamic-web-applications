var express = require("express");
var app = express();
var handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs');

var db;
var credentialObj = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

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

MongoClient.connect(credentialObj.credentials,
	function(err, database) {
		if (err) return console.log(err);

		db = database;
		var port = process.env.PORT || 3000;
		app.listen(port, function() {
			console.log("App is running on port " + port);
		});
});

app.get("/", function(req, res) {
	res.render("home");
});

var player;
app.post("/", function(req, res) {

	player = {
		name : req.body.name,
		score : 0
	};

	if (player.name.trim() === "") {
		res.render("home", {message: "Enter your name!"});
	}
	else {
		db.collection("players").insert(player, function(err, result) {
			if (err) console.log(err);
			res.redirect("/game");
		});
	}
});

app.get("/game", function(req, res) {
	res.render("game", player);
});

app.post("/game", function(req, res) {
	console.log(req.body.score);

	db.collection("players").updateOne({_id: ObjectId(req.body.id)},
	{$set: {score : req.body.score} },

	function(err, result) {
		if (err) console.log(err);
		res.redirect("/");
	});
});

app.get("/rank", function(req, res) {
	db.collection("players").find({}).toArray(function(err, results) {
		res.render("rank", {players: results});
	});
});

// var server = require("http").Server(app);
// var io = require("socket.io")(server);

// io.on("connection", function(client) {
// 	console.log("a client is connected!");
// 	client.emit("You are connected!");
//
// 	client.on("attack", function(data) {
// 		client.broadcast.emit("attackFromOthers", data);
// 	});
//
// });
