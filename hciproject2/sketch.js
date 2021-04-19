
let speed, accel;
let cruiseEngaged, cruiseSpeed;
//I should probably capitalize these differently to differentiate them
const dragCoefficient = 0.26; //idk units; this is experimental, pulled from wikipedia for the 6th gen Nissan Altima (my car)
const airDensity = 1.21; //kg/m^3
const carArea = 2.2; //m^2, approximation for general vehicles
const carMass = 1500; //kg, taken from a Nissan press kit, approximation
const rollingCoefficient = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  speed = 0;
  accel = 0;
  cruiseEngaged = false;
  cruiseSpeed = 0;
  frameRate(60);
}

function draw() {
  //Modern, edgy black
  background(0);

  //Speed calculated before acceleration because it's more accurate
  speed += accel * (deltaTime / 60); //I would put the frameRate() function here but it returns 0 until the draw function is run once
  if(speed < 0)
  	speed = 0; //Reversing looks the exact same as accelerating to the dash so I really don't need to do anything special here

  let forceEngine = 0;
  let drag = dragCoefficient * airDensity * speed * speed * 0.5 * carArea; //Drag equation
  let rollingResistance = rollingCoefficient * carMass * 9.81; //Rolling resistance equation.

  if(keyIsDown(87) || (cruiseEngaged && speed < cruiseSpeed)) //w key or cruise being under its target speed
  	forceEngine = 3000; //This will be tweaked to feel right
  if(keyIsDown(83)) { //s key
  	forceEngine = -2400; //Also tweaked
  	cruiseEngaged = false; //Disengages cruise
  }
  accel = (forceEngine - drag - rollingResistance) / carMass; //F = ma -> a = F/m
  if(cruiseEngaged && (cruiseSpeed === speed)) {
  	accel = 0;
  }
  let speedMPH = speed * 0.6213711922; //Conversion from kmph to mph

  textSize(70);
  fill(255, 255, 255);

  //Text rounded to look nicer, hooray!
  text(round(speedMPH, 1), 70, 70);
  text(round(accel, 4), 70, 140);
}

function keyPressed() {
	//Down engages cruise, which sets its target speed to the current speed and toggles a variable.
	if(keyCode === DOWN_ARROW) {
		cruiseEngaged = !cruiseEngaged;
		if(cruiseEngaged)
			cruiseSpeed = speed;
	}

	//Up resumes cruise which accelerates up to the previous cruise value
	if(keyCode === UP_ARROW) {
		if(!cruiseEngaged)
			cruiseEngaged = true;
	}

	//r and f increase/decrease cruise by 1 mph, respectively
	if(key === 'r') {
		cruiseSpeed += 1;
	}

	if (key === 'f') {
		cruiseSpeed -= 1;
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); //This is neat :)
}