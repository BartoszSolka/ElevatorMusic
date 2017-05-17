var speedMultiplier = 1;
var floorHeight = 40;
var floorCount = 10;
var machineRoomHeight = 30;
var elevatorWidth = 80;
var elevatorHeight = floorCount * floorHeight + machineRoomHeight;
var elevatorSpeed = floorHeight * speedMultiplier / 30;
var canvasHeight = 720;
var canvasWidth = 1024;
var bottomLevel = canvasHeight - 1;
var padding = 100;
var elevator;

function Elevator() {
	var initFloor = getFloor(10);
	this.currentFloor = initFloor;
	this.goingTo = getFloor(1);
	this.x = this.currentFloor.x;
	this.y = this.currentFloor.y;
	this.peopleCount = 0;
	this.speed = elevatorSpeed;

	this.display = function() {
		fill(245, 195, 66);
		rect(this.x, this.y, elevatorWidth, floorHeight);
		fill(255);
		text(this.peopleCount, this.x + 5, this.y + floorHeight/2);
	};

	this.moveToFloor = function(floorNumber) {
		this.goingTo = getFloor(floorNumber);
	};

	this.move = function() {
		if (abs(this.y - this.goingTo.y) < 1) {
			this.currentFloor = this.goingTo;
			return;
		}
		this.y += this.speed * getDirection(this.y, this.goingTo.y);
	}
}

function getDirection(current, dest) {
	return current > dest ? -1 : 1;
}

function drawMachineRoom() {
	rect(padding, bottomLevel - floorCount * floorHeight - machineRoomHeight, elevatorWidth, machineRoomHeight);
	text("maszynownia", padding - elevatorWidth, bottomLevel - floorCount * floorHeight - machineRoomHeight/2);
}

function drawFloors() {
	for (i = 1; i <= floorCount; i++) {
		rect(padding, bottomLevel - i * floorHeight, elevatorWidth, floorHeight);
		text(i, padding - elevatorWidth/2, bottomLevel - i * floorHeight + floorHeight/2);
	}
}

function getFloor(floorNumber) {
	return {x: padding, y: bottomLevel - floorNumber * floorHeight, floor: floorNumber};
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  elevator = new Elevator();
}

function draw() {
	background(100);  
  drawFloors();
  drawMachineRoom();
	elevator.move();
  elevator.display();
}