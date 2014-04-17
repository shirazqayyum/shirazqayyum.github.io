

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

/* Width and height of application window in pixels */
var APPLICATION_WIDTH = c.getAttribute("width");
var APPLICATION_HEIGHT = c.getAttribute("height");


/* Dimensions of game board (usually the same) */
var WIDTH = APPLICATION_WIDTH;
var HEIGHT = APPLICATION_HEIGHT;

/* Dimensions of the paddle */
var PADDLE_WIDTH = 60;
var PADDLE_HEIGHT = 10;

/* Offset of the paddle up from the bottom */
var PADDLE_Y_OFFSET = 30;

/* Number of bricks per row */
var NBRICKS_PER_ROW = 10;

/* Number of rows of bricks */
var NBRICK_ROWS = 10;

/* Separation between bricks */
var BRICK_SEP = 4;

/* Width of a brick */
var BRICK_WIDTH =
  //(WIDTH - (NBRICKS_PER_ROW - 1) * BRICK_SEP) / NBRICKS_PER_ROW;
	//((WIDTH / BRICK_SEP) - 1) / NBRICKS_PER_ROW;
	((WIDTH - BRICK_SEP) / NBRICKS_PER_ROW) - BRICK_SEP;
/* Height of a brick */
var BRICK_HEIGHT = 12;

/* Radius of the ball in pixels */
var BALL_RADIUS = 10;

/* Offset of the top brick row from the top */
var BRICK_Y_OFFSET = 70;

/* Number of turns */
var NTURNS = 3;

var PAUSE_TIME = 15;

var BALL_VELOCITY = 1; 

var GAME_WON = 0;

var GAME_LOST = 1;

var SCORE_X = WIDTH - 100;

var SCORE_Y = 17;

gameSetup();
gameStart();


function gameSetup() {
	brickLayout();
	createPaddle();	
}

function brickLayout() {
	
	var colors = new Array();
	colors[0] = "DarkSlateBlue ";
	colors[1] = "DarkSlateGray ";
	colors[2] = "DarkTurquoise  ";
	colors[3] = "DarkViolet ";
	colors[4] = "DeepPink ";
	
	var dy = BRICK_Y_OFFSET;
	for ( var i = 0; i < NBRICK_ROWS; ++i ) {
		var dx = BRICK_SEP;
		for ( var j = 0; j < NBRICKS_PER_ROW; ++j) {
			ctx.fillStyle = colors[i / 2];
			ctx.fillRect(dx, dy, BRICK_WIDTH, BRICK_HEIGHT);
			dx += BRICK_WIDTH + BRICK_SEP;
		}
		dy += BRICK_HEIGHT + BRICK_SEP;
	};
};

function createPaddle(){
	var x = WIDTH/2 - PADDLE_WIDTH/2;
	var y = HEIGHT - PADDLE_Y_OFFSET;
	ctx.fillStyle = "black";
	ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);	
}

