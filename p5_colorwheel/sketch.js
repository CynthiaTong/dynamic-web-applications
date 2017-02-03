function setup() {
	createCanvas(windowWidth, windowHeight);
	background(240);
	smooth();
}

function draw() {
	strokeWeight(30);
	stroke(map(mouseX, 0, width, 0, 200), map(mouseY, 0, height, 0, 200), 255);
	fill(map(mouseX, 0, width, 0, 255), map(mouseY, 0, height, 0, 255), 255, 50);
	ellipse(width/2, height/2, height-30, height-30);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}