var socket = io.connect(window.location.origin);

var p;
var madePlayer = false;
var bullets = [];

// var otherPlayers = [];
// var otherBullets = [];
// var otherData = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(255, 100);

	if (madePlayer) {

		p.live();

		if (p.dead) {
			madePlayer = false;
			bullets = [];
			// console.log(p.lifeTime);
		}

		else p.move();

		if (p.lifeTime > 60 && p.lifeTime%20 === 0) {
			if (!p.dead) p.fire();
		}

		for (var i=0; i < bullets.length; ++i) {
			bullets[i].fly();
		}
	}

	// if (otherData) {
	// 	for (var j=0; j < otherPlayers.length; ++j) {
	//
	// 		if (otherPlayers[j].moved && !otherPlayers[j].dead) {
	// 			otherPlayers[j].move();
	// 		}
	// 	}
	//
	// 	for (var k=0; k < otherBullets.length; ++k) {
	// 		otherBullets[k].fly();
	// 	}
	// }

}


function mousePressed() {
	if (!madePlayer)
		p = new Player("ab", color(255, 0));
	madePlayer = true;
}

// function mouseMoved() {
// 	if (madePlayer)
// 		p.moved  = true;
// 	// sendData(p, bullets);
// }

// function Enemy(name, color, moveState, liveState, posX, posY) {
//
// 	this.moved = moveState;
// 	this.dead = liveState;
//
// 	this.move = function() {
// 		background(255, 100);
//
// 		fill(color);
// 		rectMode(CENTER);
// 		rect(posX, posY, 40, 40);
// 	};
//
// }

function Player(name, color) {
	this.name = name;
	this.color = color;
	this.dead = false;
	this.lifeTime = 0;

	var easing = 0.04;
	this.posX = windowWidth/2;
	this.posY = windowHeight/2;
	var width = 40;
	// this.posX = posX;
	// this.posY = posY;

	this.move = function() {

		this.posX += (mouseX - this.posX)*easing;
		this.posY += (mouseY - this.posY)*easing;

		fill(this.color);
		rectMode(CENTER);
		rect(this.posX, this.posY, width, width);
		// this.posX = posX;
		// this.posY = posY;
		this.lifeTime ++;
	};

	this.fire = function() {

		var deltaX = mouseX - this.posX;
		var deltaY = mouseY - this.posY;
		var angle = acos(deltaX/sqrt(deltaX*deltaX + deltaY*deltaY));
		var speed = random(5, 10);

		var bullet = new Bullet(angle, speed, this.posX, this.posY, deltaY);
		bullets.push(bullet);
	};

	this.live = function() {

		for (var i=0; i < bullets.length; ++i) {
			var b = bullets[i];

			if (b.lifeTime < 250 && abs(this.posX - b.x) < (width+b.w)/2 &&
				abs(this.posY - b.y) < (width+b.w)/2) {
				this.dead = true;
				return;
			}
		}

		if (abs(mouseX-this.posX) < 1 && abs(mouseY-this.posY) < 1) {
			this.dead = true;
		}
	};

}

function Bullet(angle, initSpeed, posX, posY, deltaY) {
	this.x = posX;
	this.y = posY;
	this.w = 10;
	this.lifeTime = 300;

	var vx = initSpeed*cos(angle);
	var vy = initSpeed*sin(angle);

	this.fly = function() {

		this.x += vx;

		if (deltaY > 0) this.y += vy;
		else if (deltaY < 0) this.y -= vy;

		fill(70, map(this.lifeTime, 0, 255, 0, 300));
		rect(this.x, this.y, this.w, this.w);

		if (this.x-this.w < 0 || this.x+this.w > windowWidth) {
			vx *= -1;
		}
		if (this.y-this.w < 0 || this.y+this.w > windowHeight) {
			vy *= -1;
		}

		if (this.lifeTime < 0) {
			var index = bullets.indexOf(this);
			bullets.splice(index, 1);
		}

		this.lifeTime --;
	};
}

// *** sockets *** //

// function sendData(player, blts) {
//
// 	var data = {
// 		player: player,
// 		bullets: blts
// 	};
//
// 	socket.emit("attack", data);
// }
//
//
// socket.on("attackFromOthers", function(data) {
//
// 	var otherPlayer = new Enemy(data.player.name, color(0),
// 								data.player.moved, data.player.dead,
// 								data.player.posX, data.player.posY);
// 	var otherBlts = [];
//
// 	for (var b=0; b < data.bullets.length; ++b) {
// 		var otherBullet = new Bullet(data.bullets.x,
// 									 data.bullets.y,
// 								 	 data.bullets.w,
// 								 	 data.bullets.lifeTime);
// 		otherBlts.push(otherBullet);
// 	}
//
// 	// var exist = false;
// 	// for (var p=0; p < otherPlayers.length; ++p) {
// 	// 	if (otherPlayers[p].name == otherPlayer.name) {
// 	// 		exist = true;
// 	// 		return;
// 	// 	}
// 	// }
// 	// if (!exist) {
// 	// 	console.log(otherPlayer);
// 		otherPlayers.push(otherPlayer);
// 	// }
//
// 	// if (otherBullets !== otherBlts) {
// 	// 	otherBullets = otherBlts;
// 	// }
//
// 	otherData = true;
//
// });


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
