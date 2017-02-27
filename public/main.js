var socket = io.connect(window.location.origin);

var i = 10;
var drawShape = false;
var newRipple = false;
var shapeColor;
var circleX, circleY;
var maxRadius;

var drawRippleFromElsewhere = false;
var dataFromElsewhere = {};
var ripplesFromElsewhere = []; 

var ripples = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	fill(255, 80);
	rect(0, 0, width, height);

	if (drawRippleFromElsewhere) {
		for (var i =0; i < ripplesFromElsewhere.length; ++i) {
			ripplesFromElsewhere[i].drawRipple();
		}
	}

	for (var i =0; i < ripples.length; ++i) {
		ripples[i].drawRipple();
	}
	
}

function randomColor() {
	var r = random(50, 230);
	var g = random(50, 230);
	var b = random(50, 230);

	return [r,g,b];
}

function mousePressed() {
	shapeColor = randomColor();
	circleX = mouseX;
	circleY = mouseY;
	maxRadius = random(70, 90);
	ripples.push(new Ripple(maxRadius, shapeColor, circleX, circleY));
	sendDrawings(maxRadius, shapeColor, circleX, circleY);
}

function Ripple(count, color, x, y) {
	this.count = count;
	var draw = true;
	var i = 10;

	this.drawRipple = function() {

		if (draw) {
			noStroke();
			fill(color[0], color[1], color[2], 255-i*3);
			ellipse(x, y, i, i);
			// ellipse(x, y, i-30, i-30);
			fill(color[0], color[1], color[2], 255-i*2);
			ellipse(x, y, i-15, i-15);
			fill(color[0], color[1], color[2], 255-i);
			ellipse(x, y, i-30, i-30);

			i+=0.3;

			if (i > this.count) {
				draw = false;
			}

		}
	}
}

// *** sockets *** //

function sendDrawings(count, color, x, y) {

	var data = {
		maxRadius: count,
		shapeColor: color,
		circleX: x,
		circleY: y
	}

	socket.emit("drawing", data);
}


socket.on("drawFromOtherClients", function(data) {

	drawRippleFromElsewhere = true;
	dataFromElsewhere = data;
	ripplesFromElsewhere.push(new Ripple(dataFromElsewhere.maxRadius, 
						   dataFromElsewhere.shapeColor, 
						   dataFromElsewhere.circleX, 
						   dataFromElsewhere.circleY));
	// console.log(data);
});


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

