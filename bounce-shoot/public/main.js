var socket = io.connect(window.location.origin);

var p;
var bullets = [];

function setup() {
	createCanvas(windowWidth, windowHeight);

	p = new Player("ab", "(50,50,50)");
}

function draw() {
	background(255, 100);

	if (p.moved) p.move();

	for (var i=0; i < bullets.length; ++i) {
		bullets[i].fly();
	}

}


function mousePressed() {
	p.fire();
}

function mouseMoved() {
	p.moved  = true;
}

function Player(name, color) {
	this.name = name;
	this.color = color;
	this.moved = false;

	var easing = 0.05;
	var posX = random(0, windowWidth);
	var posY = windowHeight;
	// this.posX = posX;
	// this.posY = posY;

	this.move = function() {

		posX += (mouseX - posX)*easing;
		posY += (mouseY - posY)*easing;

		noFill();
		rectMode(CENTER);
		rect(posX, posY, 40, 40);
		// this.posX = posX;
		// this.posY = posY;
	};

	this.fire = function() {

		var deltaX = mouseX - posX;
		var deltaY = mouseY - posY;
		var angle = acos(deltaX/sqrt(deltaX*deltaX + deltaY*deltaY));
		var speed = random(5, 10);

		var bullet = new Bullet(angle, speed, posX, posY, deltaY);
		bullets.push(bullet);
	};

}

function Bullet(angle, initSpeed, posX, posY, deltaY) {
	var x = posX;
	var y = posY;
	var r = 10;

	var vx = initSpeed*cos(angle);
	var vy = initSpeed*sin(angle);
	var lifeTime = 300;

	this.fly = function() {

		x += vx;

		if (deltaY > 0) y += vy;
		else if (deltaY < 0) y -= vy;

		fill(50, map(lifeTime, 0, 255, 0, 300));
		rect(x, y, r, r);

		if (x-r < 0 || x+r > windowWidth) {
			vx *= -1;
		}
		if (y-r < 0 || y+r > windowHeight) {
			vy *= -1;
		}

		if (lifeTime < 0) {
			var index = bullets.indexOf(this);
			bullets.splice(index, 1);
		}

		lifeTime --;
	};
}

// *** sockets *** //

function sendDrawings(count, color, x, y) {

	var data = {
		maxRadius: count,
		shapeColor: color,
		circleX: x,
		circleY: y
	};

	socket.emit("drawing", data);
}


socket.on("drawFromOtherClients", function(data) {


	// console.log(data);
});


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
