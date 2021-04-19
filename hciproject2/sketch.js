
let speed, accel;
let cruiseEngaged, cruiseSpeed;
let odometer;
let turnSignal, signalTimer;
let fuel;
let outerTemp; //Fahrenheit
let engineTemp;
//I should probably capitalize these differently to differentiate them
const dragCoefficient = 0.26; //idk units; this is experimental, pulled from wikipedia for the 6th gen Nissan Altima (my car)
const airDensity = 1.29; //kg/m^3
const carArea = 5.5; //m^2, approximation for general vehicles
const carMass = 1500; //kg, taken from a Nissan press kit, approximation
const rollingCoefficient = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  speed = 0;
  accel = 0;
  odometer = 0;
  cruiseEngaged = false;
  cruiseSpeed = 0;
  turnSignal = 0;
  fuel = 1.0;
  outerTemp = random(40, 90);
  engineTemp = 0.0;
  signalTimer = 0.5;
  frameRate(60);
}

function draw() {
  //Modern, edgy black
  background(0);

  //Speed calculated before acceleration because it's more accurate
  speed += accel * (deltaTime / 1000); //I would put the frameRate() function here but it returns 0 until the draw function is run once
  if(speed < 0)
  	speed = 0; //Reversing looks the exact same as accelerating to the dash so I really don't need to do anything special here

  let forceEngine = 0;
  let drag = dragCoefficient * airDensity * speed * speed * 0.5 * carArea; //Drag equation
  let rollingResistance = rollingCoefficient * carMass * 9.81; //Rolling resistance equation.

  if(keyIsDown(87) || (cruiseEngaged && speed < cruiseSpeed)) //w key or cruise being under its target speed
  	forceEngine = 8000; //This will be tweaked to feel right
  if(keyIsDown(83)) { //s key
  	forceEngine = -5000; //Also tweaked
  	cruiseEngaged = false; //Disengages cruise
  }
  accel = (forceEngine - drag - rollingResistance) / carMass; //F = ma -> a = F/m
  if(cruiseEngaged && (cruiseSpeed === speed)) {
  	accel = 0;
  }
  let speedMPH = speed * 2.23693625; //Conversion from meters per second to mph

  if(speed > 0 && engineTemp < 1.0) {
    if(engineTemp < outerTemp/150)
      engineTemp += 0.015 * speedMPH/40 * deltaTime/1000;
    else
      engineTemp += 0.005 * speedMPH/30 * deltaTime/1000;
  }
  else if(engineTemp > 0) {
    if(engineTemp > outerTemp/150)
      engineTemp -= 0.01 * deltaTime/1000;
    else
      engineTemp -= 0.001 * deltaTime/1000;
  }

  odometer += speedMPH / 60 / 60 * (deltaTime / 1000); //Miles per hour to miles per second
  if(accel > -0.05)
    fuel -= 0.01 * deltaTime/1000;

  textSize(70);
  stroke(255, 255, 255);
  fill(255, 255, 255);

  //Text rounded to look nicer, hooray!
  textAlign(CENTER, CENTER);
  text(round(speedMPH), windowWidth / 2, windowHeight / 2 - 200);
  //text(round(outerTemp), 10, 140);
  textSize(70);
  textAlign(RIGHT, CENTER);
  text(round(odometer, 0), windowWidth / 2 + 400 + 220, 310);
  text('miles', windowWidth / 2 + 400 + 400, 310);

  stroke(255, 255, 255);
  strokeWeight(2);
  fill(0, 0, 0);
  angleMode(DEGREES);
  //Speedometer
  //circle(windowWidth / 2, windowHeight / 2, 800);
  
  strokeWeight(5);
  let angle = 210;
  for(let i = 0; i < 17; i++) {
    line(windowWidth / 2 + 400*cos(angle), windowHeight / 2 - 400*sin(angle), windowWidth / 2 + 350*cos(angle), windowHeight / 2 - 350*sin(angle));
    angle -= 15;
  }
  angle = 202.5;
  for(let i = 0; i < 16; i++) {
    line(windowWidth / 2 + 400*cos(angle), windowHeight / 2 - 400*sin(angle), windowWidth / 2 + 375*cos(angle), windowHeight / 2 - 375*sin(angle));
    angle -= 15;
  }
  let speedFraction = min(speedMPH, 160)/160 //160 is the highest speed we can display.
  let needleAngle = speedFraction * 240 //240 is our total angle for the speedometer markers. 210 - -30
  stroke(255, 0, 0);
  strokeWeight(6);
  line(windowWidth / 2, windowHeight / 2, windowWidth / 2 + 400*cos(210-needleAngle), windowHeight / 2 - 400*sin(210-needleAngle))

  //Tachometer
  strokeWeight(2);
  stroke(255, 255, 255);
  //circle(windowWidth / 2 - 650, windowHeight / 2 + 150, 500);
  strokeWeight(5);
  angle = 210;
  for(let i = 0; i < 9; i++) {
    line(windowWidth / 2 - 650 + 250*cos(angle), windowHeight / 2 + 150 - 250*sin(angle), windowWidth / 2 - 650 + 200*cos(angle), windowHeight / 2 + 150 - 200*sin(angle));
    angle -= 30;
  }
  angle = 195;
  for(let i = 0; i < 8; i++) {
    line(windowWidth / 2 - 650 + 250*cos(angle), windowHeight / 2 + 150 - 250*sin(angle), windowWidth / 2 - 650 + 220*cos(angle), windowHeight / 2 + 150 - 220*sin(angle));
    angle -= 30;
  }
  strokeWeight(3);
  angle = 202.5;
  for(let i = 0; i < 16; i++) {
    line(windowWidth / 2 - 650 + 250*cos(angle), windowHeight / 2 + 150 - 250*sin(angle), windowWidth / 2 - 650 + 235*cos(angle), windowHeight / 2 + 150 - 235*sin(angle));
    angle -= 15;
  }
  strokeWeight(6);
  stroke(255, 0, 0);
  if(speed > 0)
    angle = 140;
  else
    angle = 210;
  line(windowWidth / 2 - 650, windowHeight / 2 + 150, windowWidth / 2 - 650 + 250*cos(angle), windowHeight / 2 + 150 - 250*sin(angle));

  //Engine temperature
  stroke(255, 255, 255);
  strokeWeight(2);
  line(windowWidth / 2 - 400 - 400, windowHeight / 2 - 300 + 60, windowWidth / 2 - 400 - 20, windowHeight / 2 - 300 + 60);
  strokeWeight(4);
  line(windowWidth / 2 - 400 - 400, windowHeight / 2 - 300 + 60, windowWidth / 2 - 400 - 400, windowHeight / 2 - 300 + 50);
  stroke(255, 0, 0);
  line(windowWidth / 2 - 400 - 20, windowHeight / 2 - 300 + 60, windowWidth / 2 - 400 - 20, windowHeight / 2 - 300 + 50);
  stroke(255, 255, 255);
  line(windowWidth / 2 - 400 - 400 + 380*engineTemp, windowHeight / 2 - 300 + 60, windowWidth / 2 - 400 - 400 + 380*engineTemp, windowHeight / 2 - 300 + 40);

  textSize(30);
  textAlign(CENTER, CENTER);
  text('C', windowWidth / 2 - 400 - 400, windowHeight / 2 - 280);
  stroke(255, 0, 0);
  text('H', windowWidth / 2 - 400 - 20, windowHeight / 2 - 280);

  //Fuel
  stroke(255, 255, 255);
  strokeWeight(2);
  line(windowWidth / 2 + 400 + 400, windowHeight / 2 - 300 + 60, windowWidth / 2 + 400 + 20, windowHeight / 2 - 300 + 60);
  strokeWeight(4);
  line(windowWidth / 2 + 400 + 400, windowHeight / 2 - 300 + 60, windowWidth / 2 + 400 + 400, windowHeight / 2 - 300 + 50);
  stroke(255, 0, 0);
  line(windowWidth / 2 + 400 + 20, windowHeight / 2 - 300 + 60, windowWidth / 2 + 400 + 20, windowHeight / 2 - 300 + 50);
  stroke(255, 255, 255);
  line(windowWidth / 2 + 400 + 20 + 380*fuel, windowHeight / 2 - 300 + 60, windowWidth / 2 + 400 + 20 + 380*fuel, windowHeight / 2 - 300 + 40);
  
  textSize(30);
  textAlign(CENTER, CENTER);
  text('F', windowWidth / 2 + 400 + 400, windowHeight / 2 - 280);
  stroke(255, 0, 0);
  text('E', windowWidth / 2 + 400 + 20, windowHeight / 2 - 280);

  //Speedometer Extras
  strokeWeight(2);
  stroke(255, 255, 255);
  line(windowWidth / 2 + 100*cos(210), windowHeight / 2 - 100*sin(210) + 20, windowWidth / 2 + 400*cos(210), windowHeight / 2 - 400*sin(210) + 20);
  line(windowWidth / 2 + 100*cos(210), windowHeight / 2 - 100*sin(210) + 20, windowWidth / 2 - 100*cos(210), windowHeight / 2 - 100*sin(210) + 20);
  line(windowWidth / 2 - 100*cos(210), windowHeight / 2 - 100*sin(210) + 20, windowWidth / 2 - 400*cos(210), windowHeight / 2 - 400*sin(210) + 20);
  noFill();
  arc(windowWidth / 2, windowHeight / 2 + 20, 800, 800, 30, 150);

  //Current Gear
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  textSize(72);
  square(windowWidth / 2 - 40 + 350*cos(245), windowHeight / 2 - 80 - 350*sin(245), 80, 10);
  if(speed > 0) {
    text('D', windowWidth / 2 + 350*cos(245), windowHeight / 2 - 40 - 350*sin(245));
  }
  else
    text('P', windowWidth / 2 + 350*cos(245), windowHeight / 2 - 40 - 350*sin(245));

  //Temperature
  text(round(outerTemp, 1) + "°F", windowWidth / 2 + 350*cos(270), windowHeight / 2 + 20 - 350*sin(270));

  //Time
  text(hour() + ':' + minute(), windowWidth / 2 + 350*cos(295), windowHeight / 2 - 40 - 350*sin(295));
  //Warning Indicator Area
  strokeWeight(2);
  stroke(255, 255, 255);
  square(windowWidth / 2 + 420, windowHeight / 2 - 100, 500, 10);

  //Turn signals
  fill(30, 30, 30);
  stroke(30, 30, 30);
  if(turnSignal !== 0) {
    signalTimer -= deltaTime/1000;
    if(signalTimer < -0.5)
      signalTimer += 1;
  }
  if(turnSignal == -1 && signalTimer > 0) {
    fill(0, 255, 0);
    stroke(0, 255, 0);
  }
  triangle(windowWidth / 2 - 350, windowHeight / 2 - 400, windowWidth / 2 - 400, windowHeight / 2 - 350, windowWidth / 2 - 350, windowHeight / 2 - 300);

  fill(30, 30, 30);
  stroke(30, 30, 30);
  if(turnSignal == 1 && signalTimer > 0) {
    fill(0, 255, 0);
    stroke(0, 255, 0);
  }
  triangle(windowWidth / 2 + 350, windowHeight / 2 - 400, windowWidth / 2 + 400, windowHeight / 2 - 350, windowWidth / 2 + 350, windowHeight / 2 - 300);
}

function keyPressed() {
	//Down engages cruise, which sets its target speed to the current speed and toggles a variable.
	if(keyCode === DOWN_ARROW) {
		cruiseEngaged = !cruiseEngaged;
		if(cruiseEngaged)
			cruiseSpeed = speed;
    else if(abs(cruiseSpeed - speed) > 0.5)
    {
      cruiseSpeed = speed;
      cruiseEngaged = true;
    }
	}

	//Up resumes cruise which accelerates up to the previous cruise value
	if(keyCode === UP_ARROW) {
		if(!cruiseEngaged)
			cruiseEngaged = true;
	}

	//r and f increase/decrease cruise by 1 mph, respectively
	if(key === 'r') {
		cruiseSpeed += 1 / 2.23693625;
	}

	if (key === 'f') {
		cruiseSpeed -= 1 / 2.23693625;
	}

  if(key === 'q') {
    turnSignal = (turnSignal != 0) ? 0 : -1;
  }

  if(key === 'e') {
    turnSignal = (turnSignal != 0) ? 0 : 1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); //This is neat :)
}