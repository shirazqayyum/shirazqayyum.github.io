
/* BREAKOUT 
 * Author: Shiraz Qayyum 
 * 2014
 */ 

window.addEventListener('load', eventWindowLoaded, false); 
function eventWindowLoaded() {
	var bounceAudioElement = document.getElementById("bounceAudio");
	//audioElement.addEventListener('progress',updateLoadingStatus,false);
	//audioElement.addEventListener('canplaythrough',audioLoaded,false); 
	bounceAudioElement.load();
	
	var missedAudioElement = document.getElementById("missedAudio");
	missedAudioElement.load();
	
	//lifeImage.load();
}

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var score_canvas = document.getElementById("scoreCanvas");
var score_ctx = score_canvas.getContext("2d");
var score_w = parseInt( score_canvas.getAttribute("width") );
var score_h = parseInt( score_canvas.getAttribute("height") );

var bounceAudioElement = document.getElementById("bounceAudio"); 
var missedAudioElement = document.getElementById("missedAudio");

var lifeImage = new Image();
lifeImage.src = "life4.jpg";

canvasApp();

function canvasApp() {
	
	/* For now the game just has three states */
	
	const GAME_STATE_TITLE = 0;
	const GAME_STATE_NEW_GAME = 1; 
	const GAME_STATE_GAME_OVER = 2;
	
	var globalID;
	var currentGameState = GAME_STATE_TITLE;
	var currentGameStateFunction = null;
	var start_level_one = false;
	
	/* Function to switch between different game states */
	
	function switchGameState(newState) { 
		currentGameState = newState; 
		switch (currentGameState) {
			case GAME_STATE_TITLE: 
				currentGameStateFunction = gameStateTitle;
				break;
			case GAME_STATE_NEW_GAME: 
				currentGameStateFunction = gameStateNewGame;
				break;
			case GAME_STATE_GAME_OVER: 
				currentGameStateFunction = gameStateGameOver; 
				break;
		} 
	}
	
	/* start game */
	switchGameState(currentGameState);
	
	function runGame() {
		currentGameStateFunction();
	}
	
	
	/* This is the title page show to the user */
	
	function gameStateTitle() {
		globalID = requestAnimationFrame(gameStateTitle);
		
		drawScoreBackground();		
		drawMainBackground();
		
		ctx.fillStyle = 'crimson';
		ctx.font = "100px serif";
		ctx.fillText('Breakout', 120, 300);
		
		ctx.fillStyle = 'black';
		ctx.font = "50px serif";
		ctx.fillText('Hit Enter to play', 120, 400);
		/* If the user hits enter start_level_one is set to true */
		
		if ( start_level_one ) {
			cancelAnimationFrame(globalID);
			switchGameState(GAME_STATE_NEW_GAME);
			runGame();
		}
	}
	
	/* Start showing the very first animation i.e. just the welcome screen */
	runGame();
	
	
	/* Breakout level one stuff starts here */
	
	/* Width and height of application window in pixels */
	const APPLICATION_WIDTH = c.getAttribute("width");
	const APPLICATION_HEIGHT = c.getAttribute("height");

	/* Dimensions of game board (usually the same) */
	const WIDTH = APPLICATION_WIDTH;
	const HEIGHT = APPLICATION_HEIGHT;

	/* Dimensions of the paddle */
	const PADDLE_WIDTH = 80;
	const PADDLE_HEIGHT = 10;

	/* Offset of the paddle up from the bottom */
	const PADDLE_Y_OFFSET = 30;

	/* Number of bricks per row */
	const NBRICKS_PER_ROW = 10;

	/* Number of rows of bricks */
	const NBRICK_ROWS = 8;

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
	
	const BALL_MAX_VEL = 3;
	
	const BALL_MIN_VEL = -3;
	
	const SPEED_BUMP = 1;

	/* Offset of the top brick row from the top */
	const BRICK_Y_OFFSET = 70;
	
	const SCORE_INCREMENT = 100;
	
	const INITIAL_LIVES = 3;
	
	/* The player object */
	
	function Player(score, lives) {
		this.score = score;
		this.lives = lives;
	}
	
	//function Life(x, y)
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
		this.w = PADDLE_WIDTH;
		this.h = PADDLE_HEIGHT;
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
		this.vx = 0;
		this.vy = 0;
		this.vx_saved = Math.floor( (Math.random() * (BALL_MAX_VEL - BALL_MIN_VEL + 1)) + BALL_MIN_VEL);
		this.vy_saved = 6;
		this.pause = 1;
		
		this.drawBall = function() {
			ctx.beginPath();
			ctx.fillStyle="royalblue";
			ctx.arc(ball.x + BALL_RADIUS, ball.y + BALL_RADIUS, BALL_RADIUS,0, Math.PI*2, true); 
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
	colors[0] = "DarkSlateBlue";
	colors[1] = "DarkSlateGray";
	colors[2] = "DarkTurquoise";
	colors[3] = "DarkViolet";
	colors[4] = "DeepPink";
	
	var dy = BRICK_Y_OFFSET;
	for ( var i = 0; i < NBRICK_ROWS; ++i ) {
		var dx = BRICK_SEP;
		for ( var j = 0; j < NBRICKS_PER_ROW; ++j) {
			 
			brick_array.push(new Brick(dx, dy, BRICK_WIDTH, BRICK_HEIGHT, colors[i / 2]));
			dx += BRICK_WIDTH + BRICK_SEP;
		}
		dy += BRICK_HEIGHT + BRICK_SEP;
	}

	/* Create the player, paddle and the ball too */
	var player = new Player(0, INITIAL_LIVES);
	var paddle = new Paddle();
	var ball = new Ball();
	
	/* Array to store the key presses */
	var key_press_list = [];
	
	/* The background for level one */	
	function drawMainBackground() {
		ctx.fillStyle = 'PapayaWhip';
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
	}
	
	function drawBricks() {
		for ( var i = 0; i < brick_array.length; ++i) {
			(brick_array[i]).drawBrick();
		}
	}
	
	
	function drawScoreBackground() {
		score_ctx.fillStyle = 'palevioletred';	
		score_ctx.fillRect(0, 0, score_w, score_h);
	}
	
	/* Score update function */
	
	function updateScore() {
		drawScoreBackground();
		
		score_ctx.fillStyle = 'white';
		score_ctx.font = (score_h - 4) + "px serif";
		score_ctx.fillText("Score: " + player.score, scoreCanvas.width / 20, scoreCanvas.height / 1.4 );
		
		
		var life_x = player.lives * score_h;
		life_x = score_w - life_x;
		for ( var i = 0; i < player.lives; ++i ) {
			score_ctx.drawImage(lifeImage, life_x, 0.1 * score_h, 0.8 * score_h, 0.8 * score_h);
			life_x = life_x + score_h;
		};
	}
	

	/* All the drawing should go in here  
	 * - Called in main gameStateNewGame() loop
	 */
	
	function render() {
		drawMainBackground();
		updateScore();
		drawBricks();
		ball.drawBall();
		paddle.drawPaddle();
	}
	
	/* Check for controlling commands (arrow keys) from the player 
	 * - Called in main gameStateNewGame() loop
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
	
	/* Check bounding box collision for two objects that have x, y, w, h */
	
	function boundingBoxCollision(object1, object2) {
		var left1 = object1.x;
		var left2 = object2.x;
		var right1 = object1.x + object1.w; 
		var right2 = object2.x + object2.w; 
		var top1 = object1.y;
		var top2 = object2.y;
		var bottom1 = object1.y + object1.h; 
		var bottom2 = object2.y + object2.h;
		
		if (bottom1 < top2) return(false); 
		if (top1 > bottom2) return(false);
		if (right1 < left2) return(false);
		if (left1 > right2) return(false);
		
		return(true);
	}
	
	
	/* The main Canvas draw loop, called over and over to 
	 * animate the game play
	 */
	
	function gameStateNewGame() {	
		globalID = requestAnimationFrame(gameStateNewGame);
		render();
		control();
		
		/* Check for ball collisions with the walls */
		if ( (ball.x) <= 0 || (ball.x ) >= (WIDTH - 2 * BALL_RADIUS) ) {
			ball.vx = -ball.vx;
		}
		
		if ( (ball.y) <= 0 ) {
			ball.vy = -ball.vy;
		}
		
		if ( ball.y >= HEIGHT - BALL_RADIUS ) {
			missedAudioElement.play();
			--player.lives;
			if ( player.lives == 0 ) {
				/* Stop this state and load the game over state */				
				cancelAnimationFrame(globalID);
				switchGameState(GAME_STATE_GAME_OVER);
				setTimeout(runGame, 2000);
		
			} else {
				ball.y = HEIGHT / 2;
				ball.x = WIDTH / 2;
				ball.vx = Math.floor( (Math.random() * (BALL_MAX_VEL - BALL_MIN_VEL + 1)) + BALL_MIN_VEL);
				paddle.x = WIDTH / 2 - PADDLE_WIDTH / 2;
			
				cancelAnimationFrame(globalID);
				setTimeout(runGame, 2000);		
			}
		}			
		
		for ( var i = 0; i < brick_array.length; ++i) {
			if ( boundingBoxCollision(ball, brick_array[i]) ) {
				bounceAudioElement.play();
				brick_array.splice(i, 1);
				ball.vy = - ball.vy;
				player.score += SCORE_INCREMENT * Math.abs(ball.vx);
				break;
			}
		}
		
		if ( boundingBoxCollision(paddle, ball) ) {
			ball.vy = -ball.vy;
			if ( key_press_list[39] ) {
				ball.vx += SPEED_BUMP;
			}
			
			if ( key_press_list[37] ) {
				ball.vx -= SPEED_BUMP;
			}	
		}
		
		/* Update ball position */
		ball.x += ball.vx;
		ball.y += ball.vy;			
	}; 
	
	
	function gameStateGameOver() {
		//globalID = requestAnimationFrame(gameStateGameOver);
		drawMainBackground();
		drawScoreBackground();
		ctx.fillStyle = 'crimson';
		ctx.font = "100px serif";
		ctx.fillText('Game Over',70,300);		
	}
		
/* Keyup and keydown events */
	// 32 - space
	// 13 - enter
	document.onkeydown = function(e){
		e = e?e:window.event;  
		key_press_list[e.keyCode] = true;
		
		if ( e.keyCode == 13 && start_level_one == false ) {
			start_level_one = true;
		}
		
		/* The ball's motion can be controlled using the 'enter' key */
		
		if ( e.keyCode == 13) {
			if ( ball.pause == 1) {
				ball.vx = ball.vx_saved;
				ball.vy = ball.vy_saved;
				ball.pause = 0;
			} else {
				ball.vx_saved = ball.vx;
				ball.vy_saved = ball.vy;
				ball.vx = 0;
				ball.vy = 0;
				ball.pause = 1;
			}
		}	
	};
		
	document.onkeyup = function(e){ 
		e = e?e:window.event;
		key_press_list[e.keyCode] = false; 
	};
	
//	const FRAME_RATE = 60;
//	var intervalTime = 1000 / FRAME_RATE;
//	setInterval(drawScreen, intervalTime );

}; // end canasApp()



