var face = [];
var position = {x:0, y:0};
var scale = 0;
var orientation = {x:0, y:0, z:0};
var mouthWidth = 0;
var mouthHeight = 0;
var eyebrowLeft = 0;
var eyebrowRight = 0;
var eyeLeft = 0;
var eyeRight = 0;
var jaw = 0;
var nostrils = 0;

var normalHeight=0;
var normalWidth=0;
var normalEyeBrow=0;

var happy=true;
var sad=false;
var question=false;

var mWidth=false;

var happy;
var scream;
var sceptic;

function preload(){
	happy = loadImage("/assets/happy.png");
	scream = loadImage("/assets/croc.png");
	sceptic=loadImage("/assets/red.png");
}


function setup() {
  	createCanvas(windowWidth, windowHeight);
	setupOsc(8338, 3334);
}

function draw() {

	print(mouthWidth);
	print(mouthHeight);

	print(frameCount);

	if (frameCount<30){
		normalHeight=mouthHeight;
		normalWidth=mouthWidth;
		normalEyeBrow=eyebrowLeft;
	}

	if ((mouthHeight-normalHeight)>.4){
		//screaming
		//fill(255);
		image(scream, floor(random()*width),floor(random()*height));
		//rect(floor(random()*width),floor(random()*height), 30, 30);
	}
	else{
		image(happy, floor(random()*width),floor(random()*height));

		//fill(20);
		//rect(floor(random()*width),floor(random()*height), 30, 30);
	}
	if(eyebrowLeft-normalEyeBrow>.3){
		image(sceptic, floor(random()*width),floor(random()*height));
	}
}

function receiveOsc(address, value) {
	if (address == '/raw') {
		face = [];
		for (var i=0; i<value.length; i+=2) {
			face.push({x:value[i], y:value[i+1]});
		}
	}
	else if (address == '/pose/position') {
		position = {x:value[0], y:value[1]};
	}
	else if (address == '/pose/scale') {
		scale = value[0];
	}
	else if (address == '/pose/orientation') {
		orientation = {x:value[0], y:value[1], z:value[2]};
	}
	else if (address == '/gesture/mouth/width') {
		mouthWidth = value[0];
	}
	else if (address == '/gesture/mouth/height') {
		mouthHeight = value[0];
	}
	else if (address == '/gesture/eyebrow/left') {
		eyebrowLeft = value[0];
	}
	else if (address == '/gesture/eyebrow/right') {
		eyebrowRight = value[0];
	}
	else if (address == '/gesture/eye/left') {
		eyeLeft = value[0];
	}
	else if (address == '/gesture/eye/right') {
		eyeRight = value[0];
	}
	else if (address == '/gesture/jaw') {
		jaw = value[0];
	}
	else if (address == '/gesture/nostrils') {
		nostrils = value[0];
	}
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {	
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}