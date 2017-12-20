let aClock, dClock;
let time = new Date();

function setup() {
	createCanvas(windowWidth, windowHeight);
	aClock = new analogClock(width/2, height/2, min(0.95*width, 0.95*height));
	dClock = new digitalClock(width/2, (aClock.center.y + aClock.radius/2));
}

function draw() {
	time = new Date();
	background(255);
	dClock.draw();
	aClock.draw();
}

function pad(val) {
	if (val < 10) {
		return `0${val}`;
	} else {
		return val;
	}
}

function hhmmss(format = 24) {
	if (format == 12) {
		str = `${pad(time.getHours()%12)}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
	} else {
		str = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
	}
	return str;
}

class digitalClock {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	draw() {
		fill(220);
		noStroke();
		textAlign(CENTER);
		textSize(48);
		text(hhmmss(12), this.x, this.y);
	}
}

class analogClock {
	constructor(x, y, diameter) {
		this.center = createVector(x, y);
		this.diameter = diameter;
		this.radius = diameter/2;
		this.outlineWeight = 1;
		this.hourHand = new Hand(this.center, 0.70*this.radius, 0, 5);
		this.minuteHand = new Hand(this.center, 0.9*this.radius, 63, 2);
		this.secondHand = new Hand(this.center, 0.85*this.radius, 127, 1);
	}
	draw() {
		stroke(0);
		strokeWeight(this.outlineWeight);
		noFill();
		ellipse(this.center.x, this.center.y, this.diameter, this.diameter);
		noStroke();
		fill(0);
		ellipse(this.center.x, this.center.y, 0.02*this.diameter, 0.02*this.diameter);
		this.drawTicks();
		this.hourHand.update(map(time.getHours() % 12, 0, 12, 0, 2*PI) - PI/2);
		this.minuteHand.update(map(time.getMinutes(), 0, 60, 0, 2*PI) - PI/2);
		this.secondHand.update(map(time.getSeconds(), 0, 60, 0, 2*PI) - PI/2);
		this.secondHand.draw();
		this.minuteHand.draw();
		this.hourHand.draw();
	}
	drawTicks() {
		translate(this.center.x, this.center.y);
		stroke(0);
		for (let i = 0; i < 60; i++) {
			let angle = i*PI / 30;
			strokeWeight(i % 5 == 0 ? (i % 3 == 0 ? 6 : 3) : 1);
			line(0.94*this.radius*cos(angle), 0.94*this.radius*sin(angle), 0.95*this.radius*cos(angle), 0.95*this.radius*sin(angle));
		}
		translate(-this.center.x, -this.center.y);
	}
}

class Hand {
	constructor(initialPoint, length, color, thickness) {
		this.center = initialPoint;
		this.length = length;
		this.color = color;
		this.thickness = thickness;
		this.angle = 0;
	}
	update(angle) {
		this.angle = angle;
	}
	draw() {
		stroke(this.color);
		strokeWeight(this.thickness);
		translate(this.center.x, this.center.y);
		line(0, 0, this.length*cos(this.angle), this.length*sin(this.angle));
		translate(-this.center.x, -this.center.y);
	}
}