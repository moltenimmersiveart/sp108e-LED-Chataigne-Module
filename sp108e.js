
/* ********** GENERAL SCRIPTING **********************

		This templates shows what you can do in this is module script
		All the code outside functions will be executed each time this script is loaded, meaning at file load, when hitting the "reload" button or when saving this file
*/


// You can add custom parameters to use in your script here, they will be replaced each time this script is saved
//var myFloatParam = script.addFloatParameter("My Float Param","Description of my float param",.1,0,1); 		//This will add a float number parameter (slider), default value of 0.1, with a range between 0 and 1

//Here are all the type of parameters you can create
/*
var myTrigger = script.addTrigger("My Trigger", "Trigger description"); 									//This will add a trigger (button)
var myBoolParam = script.addBoolParameter("My Bool Param","Description of my bool param",false); 			//This will add a boolean parameter (toggle), defaut unchecked
var myFloatParam = script.addFloatParameter("My Float Param","Description of my float param",.1,0,1); 		//This will add a float number parameter (slider), default value of 0.1, with a range between 0 and 1
var myIntParam = script.addIntParameter("My Int Param","Description of my int param",2,0,10); 				//This will add an integer number parameter (stepper), default value of 2, with a range between 0 and 10
var myStringParam = script.addStringParameter("My String Param","Description of my string param", "cool");	//This will add a string parameter (text field), default value is "cool"
var myColorParam = script.addColorParameter("My Color Param","Description of my color param",0xff0000ff); 	//This will add a color parameter (color picker), default value of opaque blue (ARGB)
var myP2DParam = script.addPoint2DParameter("My P2D Param","Description of my p2d param"); 					//This will add a point 2d parameter
var myP3DParam = script.addPoint3DParameter("My P3D Param","Description of my p3d param"); 					//This will add a point 3d parameter
var myTargetParam = script.addTargetParameter("My Target Param","Description of my target param"); 			//This will add a target parameter (to reference another parameter)
var myEnumParam = script.addEnumParameter("My Enum Param","Description of my enum param",					//This will add a enum parameter (dropdown with options)
											"Option 1", 1,													//Each pair of values after the first 2 arguments define an option and its linked data
											"Option 2", 5,												    //First argument of an option is the label (string)
											"Option 3", "banana"											//Second argument is the value, it can be whatever you want
											); 	
*/


//you can also declare custom internal variable
//var myValue = 5;

var CMD_NULL = [0,0,0];

var CMD_PREFIX = 0x38;
var CMD_SUFFIX = 0x83;
var CMD_PIXELS = 0x2D;
var CMD_SEGMENTS = 0x2E;
var CMD_CHIP_TYPE = 0x1C;
var CMD_LED_ORDER = 0x3C;
var CMD_SET_COLOR = 0x22; // RGB: 000000-FFFFFF
var CMD_SET_SPEED = 0x03; // Param: 00-FF
var CMD_SET_BRIGHTNESS = 0x2A; // Param: 00-FF
var CMD_SET_WHITE = 0x08; // Param: 00-FF
var CMD_TOGGLE = 0xAA;
var CMD_MIXED_AUTO_MODE = 0x06;
var CMD_SET_ANIMATION = 0x2C; // Param: 00-FF

var message = CMD_NULL;
var command = 0x00;
var canSend = false;


/*
 The init() function will allow you to init everything you want after the script has been checked and loaded
 WARNING it also means that if you change values of your parameters by hand and set their values inside the init() function, they will be reset to this value each time the script is reloaded !
*/
function init()
{
	//script.setUpdateRate(50);

	setPixelsPerSegment(local.parameters.pixelsPerSegment.get());
	setSegments(local.parameters.segments.get());
	setChipType(local.parameters.chipType.get());
	setColorOrder(local.parameters.colorOrder.get());

	//myFloatParam.set(5); //The .set() function set the parameter to this value.
	//myColorParam.set([1,.5,1,1]);	//for a color parameter, you need to pass an array with 3 (RGB) or 4 (RGBA) values.
	//myP2DParam.set([1.5,-5]); // for a Point2D parameter, you need to pass 2 values (XY)
	//myP3DParam.set([1.5,2,-3]); // for a Point3D parameter, you need to pass 3 values (XYZ)
}


/*
 This function will be called each time a parameter of your script has changed
*/
function scriptParameterChanged(param)
{
	//You can use the script.log() function to show an information inside the logger panel. To be able to actuallt see it in the logger panel, you will have to turn on "Log" on this script.
	script.log("Parameter changed : "+param.name); //All parameters have "name" property
	if(param.is(myTrigger)) script.log("Trigger !"); //You can check if two variables are the reference to the same parameter or object with the method .is()
	else if(param.is(myEnumParam)) script.log("Key = "+param.getKey()+", data = "+param.get()); //The enum parameter has a special function getKey() to get the key associated to the option. .get() will give you the data associated
	else script.log("Value is "+param.get()); //All parameters have a get() method that will return their value
}

/*
 This function, if you declare it, will launch a timer at 50hz, calling this method on each tick
*/

function update(deltaTime)
{
	//limit number of messages to update rate
	if(canSend) {
		sendMessage(message, command);
	}
}




/* ********** MODULE SPECIFIC SCRIPTING **********************

	The "local" variable refers to the object containing the scripts. In this case, the local variable refers to the module.
	It means that you can access any control inside  this module by accessing it through its address.
	For instance, if the module has a float value named "Density", you can access it via local.values.density
	Then you can retrieve its value using local.values.density.get() and change its value using local.values.density.set()
*/

/*
 This function will be called each time a parameter of this module has changed, meaning a parameter or trigger inside the "Parameters" panel of this module
 This function only exists because the script is in a module
*/
function moduleParameterChanged(param)
{

	if(param.isParameter()) 
	{

		if(param.is(local.parameters.pixelsPerSegment)) 
		{
			setPixelsPerSegment(param.get());
		}
		else if(param.is(local.parameters.segments))
		{
			setSegments(param.get());
		}
		else if(param.is(local.parameters.chipType))
		{
			setChipType(param.get());
		}
		else if(param.is(local.parameters.colorOrder))
		{
			setColorOrder(param.get());
		}
		else
		{
			script.log("Module parameter changed : "+param.name+" > "+param.get());
		}
		
	} else 
	{
		script.log("Module parameter triggered : "+param.name);	
	}
}

/*
 This function will be called each time a value of this module has changed, meaning a parameter or trigger inside the "Values" panel of this module
 This function only exists because the script is in a module
*/
function moduleValueChanged(value)
{
	script.log("module value changed: " + value.name);

	if(value.isParameter())
	{
		script.log("Module value changed : "+value.name+" > "+value.get());	
	}else 
	{
		script.log("Module value triggered : "+value.name);	
	}
}


/*
sp108e functions
*/

function setSegments(segs){
	script.log("Setting segments: " + segs);
	updateMessage(intToRGB(segs), CMD_SEGMENTS, 2);	
}

function setPixelsPerSegment(pix){
	script.log("Setting pixels per segment: " + pix);
	updateMessage(intToRGB(pix), CMD_PIXELS, 2);
}

function setChipType(type){
	script.log("Setting chip type: " + type);
	updateMessage(oneByte(type), CMD_CHIP_TYPE, 1);
}

function setColorOrder(order){
	script.log("Setting color order: " + order);
	updateMessage(oneByte(order), CMD_LED_ORDER, 1);
}

function toggleOffOn(){
	script.log("Toggle off on");
	updateMessage(CMD_NULL, CMD_TOGGLE);
}

function setColor(color) {
	script.log("Setting color: " + color);
	updateMessage(normalizedToRGB(color), CMD_SET_COLOR);
}

function setBrightness(value) {
	script.log("Setting brigthness: " + value);
	updateMessage(oneByte(value), CMD_SET_BRIGHTNESS);
}

function setAnimationSpeed(value) {
	script.log("Setting speed: " + value);
	updateMessage(oneByte(value), CMD_SET_SPEED);
}

function setAnimation(value) {
	script.log("Setting animation: " + value);
	updateMessage(oneByte(value), CMD_SET_ANIMATION);
}

//message is in the format of [255, 255, 255]
function updateMessage(msg, cmd)
{
	//local.sendBytes(CMD_PREFIX, msg, command, CMD_SUFFIX);
	message = msg;
	command = cmd;
	canSend = true;
}

function sendMessage(msg, cmd)
{
	script.log("----> sending: " + msg);
	local.sendBytes(CMD_PREFIX, msg, cmd, CMD_SUFFIX);
	canSend = false;
}

//converts normalized colour to hex
function normalizedToRGB(col) {
	return [col[0] * 255, col[1] * 255, col[2] * 255];
}

function oneByte(b) {
	return [b, 0, 0];
}


function intToRGB(c) {

	var b = Math.floor(c / (256*256));
	var g = Math.floor(c / 256) % 256;
	var r = c % 256;

	/*
    var b = c % 256,
        g_0 = (c % 65536 - b),
        r_0 = c - g_0 - b,
        g = g_0 / 256,
        r = r_0 / 65536;
*/
    return [r, g, b];
}
