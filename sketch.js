const ALGORITHMS = {
  FIRST_COME_FIRST_SERVED: 'FIRST_COME_FIRST_SERVED',
  SHORTEST_JOB_NEXT: 'SHORTEST_JOB_NEXT',
};

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
var input;
var button;

function CallQueue() {
	this.items = [];
	this.algorithm = ALGORITHMS.FIRST_COME_FIRST_SERVED;

	this.evaluateItem = function (item, floorNo) {
		switch (this.algorithm) {
			case ALGORITHMS.FIRST_COME_FIRST_SERVED:
				return 1.0 / item.time;
			case ALGORITHMS.SHORTEST_JOB_NEXT:
				return 1.0 / (abs(item.call.floor - floorNo) + 1);
		}
	};

	this.push = function (call) {
		this.items.push({
			call: call,
			time: new Date().getTime(),
		});
	};

	this.pop = function (floorNo) {
		var item;
		var priority = 0;
		var highestPriorityIndex = -1;
		var highestPriority = 0;

		for (var i = 0; i < this.items.length; i++) {
			priority = this.evaluateItem(this.items[i], floorNo);
			if (priority > highestPriority) {
				highestPriority = priority;
				highestPriorityIndex = i;
			}
		}

		if (highestPriorityIndex < 0) {
			return null;
		} else {
			item = this.items[highestPriorityIndex];
			this.items.splice(highestPriorityIndex, 1);
			return item.call;
		}
	};

	this.length = function () {
		return this.items.length;
	};
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function Elevator() {
	this.stopped = true;
	var initFloor = getFloor(1);
	this.currentFloor = initFloor;
	this.goingTo = getFloor(2);
	this.x = this.currentFloor.x;
	this.y = this.currentFloor.y;
	this.peopleCount = 0;
	this.speed = elevatorSpeed;
	this.traveledFloors = 0;
	this.algorithm = ALGORITHMS.FIRST_COME_FIRST_SERVED;
	this.queue = new CallQueue();

	this.display = function() {
		fill(245, 195, 66);
		rect(this.x, this.y, elevatorWidth, floorHeight);
		fill(255);
		text(this.goingTo.floor, this.x + 5, this.y + floorHeight/2);
	};

	this.moveToFloor = function(floorNumber) {
		this.queue.push(getFloor(floorNumber));
	};

	this.move = function() {
		if (abs(this.y - this.goingTo.y) < 1) {
			this.currentFloor = this.goingTo;
			if (this.queue.length()) {
				this.goingTo = this.queue.pop(this.currentFloor.floor);
			}
			return;
		}
		this.y += this.speed * getDirection(this.y, this.goingTo.y);
		this.traveledFloors += this.speed / floorHeight;
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
	if (floorNumber < 1) {
		return getFloor(1);
	} else if (floorNumber > floorCount) {
		return getFloor(floorCount);
	}
	return {x: padding, y: bottomLevel - floorNumber * floorHeight, floor: floorNumber};
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  elevator = new Elevator();

  input = createInput();
  input.position(520, 65);

  button = createButton('submit');
  button.position(input.x + input.width, 65);
  button.mousePressed(moveToFloor);

	button = createButton('Start');
  button.position(500, 530);
  button.mousePressed(startElevator);

  button = createButton('Stop');
  button.position(500, 550);
  button.mousePressed(stopElevator);

		var sel = createSelect();
		sel.option('First-Come-First-Served', ALGORITHMS.FIRST_COME_FIRST_SERVED);
		sel.option('Shortest-Job-Next', ALGORITHMS.SHORTEST_JOB_NEXT);
		sel.position(500, 580);
		sel.changed(onAlgorithSelectChange);

  greeting = createElement('h2', 'Gdzie chcesz pojechac?');
  greeting.position(520, 5);
}

function draw() {
	background(100);
	drawFloors();
	drawMachineRoom();
	text("Dystans: " + elevator.traveledFloors.toFixed(0), 500, 500);
	elevator.stopped ? text("Winda zatrzymana" , 500, 520) : text("Winda uruchomiona" , 500, 520);
	if (!elevator.stopped) {
		elevator.move();
	}
 elevator.display();
}

function moveToFloor() {
	var floorNumber = input.value();
	input.value('');
	if (isNumber(floorNumber)) {
		elevator.moveToFloor(floorNumber);
	}
}

function stopElevator() {
	elevator.stopped = true;
}

function startElevator() {
	elevator.stopped = false;
}

function onAlgorithSelectChange(evt) {
	elevator.queue.algorithm = evt.target.value;
}
