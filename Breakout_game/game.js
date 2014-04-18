
/* BREAKOUT 
 * Author: Shiraz Qayyum 
 * 2014
 */ 

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
canvasApp();


function canvasApp() {
	/* Width and height of application window in pixels */
	const APPLICATION_WIDTH = c.getAttribute("width");
	const APPLICATION_HEIGHT = c.getAttribute("height");

	/* Dimensions of game board (usually the same) */
	const WIDTH = APPLICATION_WIDTH;
	const HEIGHT = APPLICATION_HEIGHT;

	/* Dimensions of the paddle */
	const PADDLE_WIDTH = 70;
	const PADDLE_HEIGHT = 10;

	/* Offset of the paddle up from the bottom */
	const PADDLE_Y_OFFSET = 30;

	/* Number of bricks per row */
	const NBRICKS_PER_ROW = 10;

	/* Number of rows of bricks */
	const NBRICK_ROWS = 10;

	/* Separation between bricks */
	const BRICK_SEP = 4;

	/* Width of a brick */
	const BRICK_WIDTH =
	  //(WIDTH - (NBRICKS_PER_ROW - 1) * BRICK_SEP) / NBRICKS_PER_ROW;
		//((WIDTH / BRICK_SEP) - 1) / NBRICKS_PER_ROW;
		((WIDTH - BRICK_SEP) / NBRICKS_PER_ROW) - BRICK_SEP;
	/* Height of a brick */
	const BRICK_HEIGHT = 12;

	/* Radius of the ball in pixels */
	const BALL_RADIUS = 15;

	/* Offset of the top brick row from the top */
	const BRICK_Y_OFFSET = 70;

	/* Number of turns */
	const NTURNS = 3;
	
	
	
	/* The brick object. Knows how to draw itself */
	
	function Brick(x, y, w, h, color) {
		this.x = x;
		this.y = y;
		this.h = h;
		this.w = w;
		this.color = color;
		
		this.drawBrick = function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		};	
	}
	
	/* The Paddle object. Knows how to draw itself */
	
	function Paddle() {
		this.x = WIDTH / 2 - PADDLE_WIDTH / 2;
		this.y = HEIGHT - PADDLE_Y_OFFSET;
		this.v = 8;
		
		this.drawPaddle = function() {
			ctx.fillStyle = "black";
			ctx.fillRect(paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);	
		}
	}
	
	/* The Ball object. Knows how to draw itself */
	
	function Ball () {
		this.x = WIDTH / 2;
		this.y = HEIGHT / 2;
		this.w = 2 * BALL_RADIUS;
		this.h = 2 * BALL_RADIUS;
		this.vx = 4;
		this.vy = 6;
		
		this.drawBall = function() {
			ctx.beginPath();
			ctx.fillStyle="royalblue";
		    // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
			ctx.arc(ball.x, ball.y, BALL_RADIUS,0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
		}
	}
	
	
	/* Initialize the brick array with all the bricks
	 * Each brick should be told where to draw itself i.e.
	 * its upper left coordinates x, y
	 */
	var brick_array = [];
	
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
			 
			brick_array.push(new Brick(dx, dy, BRICK_WIDTH, BRICK_HEIGHT, colors[i / 2]));
			dx += BRICK_WIDTH + BRICK_SEP;
		}
		dy += BRICK_HEIGHT + BRICK_SEP;
	}

	/* Create the paddle and the ball too */
	var paddle = new Paddle();
	var ball = new Ball();
	
	/* Array to store the key presses */
	var key_press_list = [];
	
		
	function drawBackground() {
		ctx.fillStyle = 'azure';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
	}
	
	function drawBricks() {
		for ( var i = 0; i < brick_array.length; ++i) {
			(brick_array[i]).drawBrick();
		}
	}
	
	/* Keyup and keydown events */
	document.onkeydown = function(e){
		e = e?e:window.event;  
		key_press_list[e.keyCode] = true;
	};
		
	document.onkeyup = function(e){ 
		e = e?e:window.event;
		key_press_list[e.keyCode] = false; 
	};
	
	

	/* All the drawing should go in here  
	 * - Called in main drawScreen() loop
	 * */
	function render() {
		drawBackground();
		drawBricks();
		ball.drawBall();
		paddle.drawPaddle();
	}
	
	/* Check for controlling commands (arrow keys) from the player 
	 * - Called in main drawScreen() loop
	 */
	function control() {
		/* Move paddle to left */
		if ( key_press_list[37] ) {	
			if (paddle.x - paddle.v <= 0 ) {
				var delta = 0 - paddle.x;
				paddle.x += delta;
			} else {
				paddle.x -= paddle.v;
			}
		}
		
		/* Move paddle to right */
		if ( key_press_list[39] ) {
			if (paddle.x + paddle.v >= WIDTH - PADDLE_WIDTH ) {
				var delta = WIDTH - PADDLE_WIDTH - paddle.x;
				paddle.x += delta;
			} else {
				paddle.x += paddle.v;
			}
		}
	}
	
	/* The main Canvas draw loop, called over and over to 
	 * animate the game play
	 */
	
	function drawScreen() {	
		render();
		control();
			
		/* Update ball position */
		ball.x += ball.vx;
		ball.y += ball.vy;
		
		/* Check for ball collisions with the walls */
		if ( (ball.x - BALL_RADIUS) <= 0 || (ball.x - BALL_RADIUS) >= (WIDTH - 2 * BALL_RADIUS) ) {
			ball.vx = -ball.vx;
		}
		
		if ( (ball.y - BALL_RADIUS) <= 0 || (ball.y - BALL_RADIUS) >= (HEIGHT - 2 * BALL_RADIUS) ) {
			ball.vy = -ball.vy;
		} 		
	}; 
	const FRAME_RATE = 50;
	var intervalTime = 1000 / FRAME_RATE;
	setInterval(drawScreen, intervalTime );

	
}; // end canasApp()

