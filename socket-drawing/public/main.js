var socket = io.connect(window.location.origin);

var shapeColor;
var circleX, circleY;
var maxRadius;

var drawRippleFromElsewhere = false;
var dataFromElsewhere = {};
var ripplesFromElsewhere = []; 

var ripples = [];

// var notes = [54, 56, 58, 60, 62, 64, 65, 67, 69, 71, 73, 75, 77, 80];
var osc; 

function setup() {
	createCanvas(windowWidth, windowHeight);

	// start silent 
	osc = new p5.TriOsc();
	osc.start();
	osc.amp(0);
}

function draw() {
	fill(255, 80);
	noStroke();
	rect(0, 0, width, height);

	if (drawRippleFromElsewhere) {
		for (var i =0; i < ripplesFromElsewhere.length; ++i) {
			ripplesFromElsewhere[i].drawRipple();
		}
	}

	for (var i = 0; i < ripples.length; ++i) {
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

	var randomNote = Math.floor(Math.random()*(80-50+1)) + 50;

	playSound(randomNote, maxRadius/60.0);
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

function playSound(note, duration) {
	osc.freq(midiToFreq(note));
	osc.fade(0.2, 0.2);

	osc.fade(0.3, 0.3);

	setTimeout(function() {
		osc.fade(0, 0.3);
	}, duration*100);
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

