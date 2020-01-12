/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var canyons;
var collectables;
var clouds;
var mountains;
var trees_x;
var game_score;

var pub;

var lives;

var jumpSound;
var bottleSound;
var screamSound;
var pubSound;

function preload()
{
    soundFormats('wav','mp3');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    bottleSound = loadSound('assets/bottle_sound.mp3');
    bottleSound.setVolume(0.5);
    screamSound = loadSound('assets/canyon_scream_sound.mp3');
    screamSound.setVolume(0.1);
    pubSound = loadSound('assets/pub_sound.mp3');
    pubSound.setVolume(0.5);
        
}

function startGame(){
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
    game_score = 0;
 
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    trees_x = [-100,360, 905, 1423, 2082, -710];
    
    clouds = [{x_pos: 90, y_pos: 80, size: 100},
             {x_pos: 650, y_pos: 150, size: 60},
             {x_pos: 2200, y_pos: 65, size: 110},
             {x_pos: 1205, y_pos: 110, size: 80}];
    
    mountains = [{x_pos: 550, y_pos: 365, size: 150},
                {x_pos: -550, y_pos: 299, size: 300},
                {x_pos: 1050, y_pos: 245, size: 420},
                {x_pos: 2250, y_pos: 339, size: 210}];
    
    collectables = [{x_pos: 100, y_pos: 100, size: 50, isFound: false},
                   {x_pos: 1810, y_pos: 100, size: 50, isFound: false},
                   {x_pos: 450, y_pos: 100, size: 50, isFound: false},
                   {x_pos: 1380, y_pos: 100, size: 50, isFound: false}];
    
    canyons = [{x_pos: 0, width: 92},
              {x_pos: 2450, width: 160},
              {x_pos: 1605, width: 100},
              {x_pos: 610, width: 145}];
    
    pub = {x_pos: 2800, isReached: false}
    
    lives -= 1;
   
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 4;
    startGame();
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos,0);

	// Draw clouds.
    
    drawClouds();
     
	// Draw mountains.
    
    drawMountains();

	// Draw trees.
    
     drawTrees();

	// Draw canyons.
    
    for (var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	// Draw collectable items.
    
    for(var i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound){
            checkCollectable(collectables[i]);
            drawCollectable(collectables[i]);
        } 
    }
    
    //Draw the end of the level
    
    renderPub();
    if(pub.isReached !== true){
        checkPub();
    }
    
    
    //Stop Floating
    
    pop();
    
    
    // Draw Game Score
    
    textSize(20);
    stroke(0);
    strokeWeight(1);
    fill(255,58,28);
    text("SCORE: " + game_score, 50, 50);
    
    //Draw Lives
    
    fill(255,58,28);
    text("LIVES: " + lives, width - 123, 50)
    
    for(var i = 0; i < lives; i++){
        stroke(0);
        strokeWeight(2);
        ellipse(i * 20 + width - 103, 70, 10, 10);
    }
       
	// Draw game character.
    
	drawGameChar();
    
    // Game over or Level completed.
    
    
    if(lives < 1)
    {
        strokeWeight(2);
        fill(255,58,28)
        text("Game Over. Press space to continue.", width/2 - 150, height/2 - 50);
        return
    }
    
    if(pub.isReached == true)
    {
        strokeWeight(2);
        fill(255,58,28);
        text("Level Complete. Press space to continue.", width/2 - 150, height/2 - 50);
        return
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    
    // Logic to make the game character rise and fall.
    
    if(gameChar_y < floorPos_y){
        gameChar_y += 3 ; 
        isFalling = true;
     } else if (gameChar_y >= floorPos_y && isPlummeting == false){
        isFalling = false;
        gameChar_y = floorPos_y;
     } else {
         isPlummeting == true;
     }
    
    
    // Check if game ccharacter has fallen below the canvas.
    
    if(gameChar_y > height + 500 && lives > 0){
        startGame()
    }
    
    
    // Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
   
    if(pub.isReached && key == ' ')
    {
        nextLevel();
        return
        
    }
    else if(lives == 0 && key == ' ')
    {
        returnToStart();
        return
    }
    
    
    
	console.log("press" + keyCode);
	console.log("press" + key);
    
    // if statements to control the animation of the character when
	// keys are pressed.
    if(keyCode == 37){
        isLeft = true;
    }
    
    if(keyCode == 39){
        isRight = true;

    }
    
    if(keyCode == 32 && gameChar_y == floorPos_y){
        gameChar_y -= 100;
        jumpSound.play();
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    // if statements to control the animation of the character when
	// keys are released.
    if(keyCode == 37){
    isLeft = false;
    }
    
    if(keyCode == 39){
    isRight = false;
    }
    

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    var bottle;

    
    if(isLeft && isFalling)
    {
		// add your jumping-left code
        fill(229,73,73);
        stroke(0);
        strokeWeight(2);
        rect(gameChar_x - 10 + 10,gameChar_y - 70, 20,20); //head
        strokeWeight(4);
        point(gameChar_x - 4 + 8,gameChar_y - 65); //left eye
        line(gameChar_x - 3 + 10, gameChar_y - 55, gameChar_x + 2, gameChar_y - 55); //mouth
        strokeWeight(2);
        rect(gameChar_x - 5 + 10, gameChar_y - 50, 10, 5); //neck
        fill(170, 169, 164);
        rect(gameChar_x - 12 + 13, gameChar_y - 45, 18, 25); //body
        rect(gameChar_x - 20 + 26, gameChar_y - 60, 8, 21); //left arm
        fill(21,96,189);
        rect(gameChar_x - 12 + 7, gameChar_y - 20, 20, 12); //left leg

        //bottle
        bottle_x = - 7;
        bottle_y = - 39;
        fill(13,69,7);
        strokeWeight(1);
        beginShape();
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 16) + bottle_y);
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 16) + bottle_y);
        endShape(CLOSE);
        fill(255,223,0);
        beginShape();
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        endShape(close)
        rect(gameChar_x + 13 + bottle_x, (gameChar_y - 20) + bottle_y, 7, 3);
        //hands
        stroke(0);
        strokeWeight(2);
        fill(229,73,73);
        rect(gameChar_x + 6, gameChar_y - 28 - 34, 8 , 3 ); //left


        strokeWeight(1); 

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(229,73,73);
        stroke(0);
        strokeWeight(2);
        rect(gameChar_x - 10 - 10,gameChar_y - 70, 20,20); //head
        strokeWeight(4);
        point(gameChar_x - 4 - 0,gameChar_y - 65); //eye
        line(gameChar_x - 3 - 4, gameChar_y - 55, gameChar_x + 3 - 5, gameChar_y - 55); //mouth
        strokeWeight(2);
        rect(gameChar_x - 5 - 10, gameChar_y - 50, 10, 5); //neck
        fill(170, 169, 164);
        rect(gameChar_x - 12 - 8, gameChar_y - 45, 18, 25); //body
        rect(gameChar_x - 20 + 5, gameChar_y - 60, 8, 21); //left arm
        fill(21,96,189);
        rect(gameChar_x - 12 - 3 , gameChar_y - 20, 20, 12); //left leg

        //bottle
        bottle_x = - 27;
        bottle_y = - 39;
        fill(13,69,7);
        strokeWeight(1);
        beginShape();
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 16) + bottle_y);
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 16) + bottle_y);
        endShape(CLOSE);
        fill(255,223,0);
        beginShape();
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        endShape(close)
        rect(gameChar_x + 13 + bottle_x, (gameChar_y - 20) + bottle_y, 7, 3);
        //hands
        stroke(0);
        strokeWeight(2);
        fill(229,73,73);
        rect(gameChar_x - 15, gameChar_y - 28 - 34, 8 , 3 ); //left


        strokeWeight(1);
        

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(229,73,73);
        stroke(0);
        strokeWeight(2);
        rect(gameChar_x - 10 + 10,gameChar_y - 70, 20,20); //head
        strokeWeight(4);
        point(gameChar_x - 4 + 8,gameChar_y - 65); //left eye
        line(gameChar_x - 3 + 10, gameChar_y - 55, gameChar_x + 2, gameChar_y - 55); //mouth
        strokeWeight(2);
        rect(gameChar_x - 5 + 10, gameChar_y - 50, 10, 5); //neck
        fill(170, 169, 164);
        rect(gameChar_x - 12 + 13, gameChar_y - 45, 18, 25); //body
        rect(gameChar_x - 20 + 10, gameChar_y - 45, 21, 8); //left arm
        fill(21,96,189);
        rect(gameChar_x - 12 + 16, gameChar_y - 20, 12, 20); //left leg

        //bottle
        bottle_x = - 30;
        bottle_y = - 14;
        fill(13,69,7);
        strokeWeight(1);
        beginShape();
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 16) + bottle_y);
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 16) + bottle_y);
        endShape(CLOSE);
        fill(255,223,0);
        beginShape();
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        endShape(close)
        rect(gameChar_x + 13 + bottle_x, (gameChar_y - 20) + bottle_y, 7, 3);
        //hands
        stroke(0);
        strokeWeight(2);
        fill(229,73,73);
        rect(gameChar_x + 12 - 24, gameChar_y - 28 - 17, 3 , 8 ); //left


        strokeWeight(1);

	}
	else if(isRight)
	{
		// add your walking right code
        fill(229,73,73);
        stroke(0);
        strokeWeight(2);
        rect(gameChar_x - 10 - 10,gameChar_y - 70, 20,20); //head
        strokeWeight(4);
        point(gameChar_x - 4 - 0,gameChar_y - 65); //eye
        line(gameChar_x - 3 - 4, gameChar_y - 55, gameChar_x + 3 - 5, gameChar_y - 55); //mouth
        strokeWeight(2);
        rect(gameChar_x - 5 - 10, gameChar_y - 50, 10, 5); //neck
        fill(170, 169, 164);
        rect(gameChar_x - 12 - 8, gameChar_y - 45, 18, 25); //body
        rect(gameChar_x - 20 + 10, gameChar_y - 45, 21, 8); //left arm
        fill(21,96,189);
        rect(gameChar_x - 12 - 5 , gameChar_y - 20, 12, 20); //left leg

        //bottle
        bottle_x = -1;
        bottle_y = - 14;
        fill(13,69,7);
        strokeWeight(1);
        beginShape();
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 16) + bottle_y);
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 16) + bottle_y);
        endShape(CLOSE);
        fill(255,223,0);
        beginShape();
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        endShape(close)
        rect(gameChar_x + 13 + bottle_x, (gameChar_y - 20) + bottle_y, 7, 3);
        //hands
        stroke(0);
        strokeWeight(2);
        fill(229,73,73);
        rect(gameChar_x + 12 - 1, gameChar_y - 28 - 17, 3 , 8 ); //left


        strokeWeight(1);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(229,73,73);
        stroke(0);
        strokeWeight(2);
        rect(gameChar_x - 10,gameChar_y - 70, 20,20); //head
        strokeWeight(4);
        point(gameChar_x - 4,gameChar_y - 65); //left eye
        point(gameChar_x + 4,gameChar_y - 65); //right eye
        line(gameChar_x - 3, gameChar_y - 55, gameChar_x + 3, gameChar_y - 55); //mouth
        strokeWeight(2);
        rect(gameChar_x - 5, gameChar_y - 50, 10, 5); //neck
        fill(170, 169, 164);
        rect(gameChar_x - 12, gameChar_y - 45, 24, 25); //body
        rect(gameChar_x - 20, gameChar_y - 62, 8, 21); //left arm
        rect(gameChar_x + 12, gameChar_y - 62, 8, 21); // right arm
        fill(21,96,189);
        rect(gameChar_x - 21, gameChar_y - 20, 20, 12); //left leg
        rect(gameChar_x, gameChar_y - 20, 20, 12); //right leg
        //bottle
        bottle_y = -37;
        fill(13,69,7);
        strokeWeight(1);
        beginShape();
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 16) + bottle_y);
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 16) + bottle_y);
        endShape(CLOSE);
        fill(255,223,0);
        beginShape();
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        endShape(close)
        rect(gameChar_x + 13 + bottle_x, (gameChar_y - 20) + bottle_y, 7, 3);
        //hands
        stroke(0);
        strokeWeight(2);
        fill(229,73,73);
        rect(gameChar_x + 12, gameChar_y - 65, 8 , 3); //left
        rect(gameChar_x - 20, gameChar_y - 65, 8, 3); //right
        strokeWeight(1);

	}
	else
	{
		// add your standing front facing code
        fill(229,73,73);
        stroke(0);
        strokeWeight(2);
        rect(gameChar_x - 10,gameChar_y - 70, 20,20); //head
        strokeWeight(4);
        point(gameChar_x - 4,gameChar_y - 65); //left eye
        point(gameChar_x + 4,gameChar_y - 65); //right eye
        line(gameChar_x - 3, gameChar_y - 55, gameChar_x + 3, gameChar_y - 55); //mouth
        strokeWeight(2);
        rect(gameChar_x - 5, gameChar_y - 50, 10, 5); //neck
        fill(170, 169, 164);
        rect(gameChar_x - 12, gameChar_y - 45, 24, 25); //body
        rect(gameChar_x - 20, gameChar_y - 45, 8, 21); //left arm
        rect(gameChar_x + 12, gameChar_y - 45, 8, 21); // right arm
        fill(21,96,189);
        rect(gameChar_x - 12, gameChar_y - 20, 12, 20); //left leg
        rect(gameChar_x, gameChar_y - 20, 12, 20); //right leg
        //bottle
        bottle_x = 0;
        bottle_y = 0;
        fill(13,69,7);
        strokeWeight(1);
        beginShape();
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 16) + bottle_y);
        vertex(gameChar_x + bottle_x + 12, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 22) + bottle_y);
        vertex(gameChar_x + bottle_x + 21, (gameChar_y - 16) + bottle_y);
        endShape(CLOSE);
        fill(255,223,0);
        beginShape();
        vertex(gameChar_x + bottle_x + 14, (gameChar_y - 26) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 16, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 34) + bottle_y);
        vertex(gameChar_x + bottle_x + 17, (gameChar_y - 33) + bottle_y);
        vertex(gameChar_x + bottle_x + 19, (gameChar_y - 26) + bottle_y);
        endShape(close)
        rect(gameChar_x + 13 + bottle_x, (gameChar_y - 20) + bottle_y, 7, 3);
        //hands
        stroke(0);
        strokeWeight(2);
        fill(229,73,73);
        rect(gameChar_x + 12, gameChar_y - 28, 8 , 3); //left
        rect(gameChar_x - 20, gameChar_y - 24, 8, 3); //right

        strokeWeight(1);

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds(){
    
    for(var i = 0; i < clouds.length; i++ ){
        fill(255);
        ellipse(clouds[i].x_pos, clouds[i].y_pos,
                1.25 * clouds[i].size,1 * clouds[i].size);
        ellipse(clouds[i].x_pos + 0.5 * clouds[i].size, clouds[i].y_pos + 0.2 * clouds[i].size ,
                1.20 * clouds[i].size ,0.95 * clouds[i].size);
        ellipse(clouds[i].x_pos + 0.6 * clouds[i].size, clouds[i].y_pos - 0.2 * clouds[i].size ,
                
                1.10 * clouds[i].size ,0.88 * clouds[i].size);
    }

    
}
// Function to draw mountains objects.

function drawMountains()
{
    
    for(var i = 0; i < mountains.length; i++){
        fill(66,68,65);
        triangle(mountains[i].x_pos + 75/300 * mountains[i].size, mountains[i].y_pos - 85/300 * mountains[i].size,
                 mountains[i].x_pos - 100/300 * mountains[i].size ,mountains[i].y_pos + 134/300 * mountains[i].size,
                 mountains[i].x_pos + 250/300 * mountains[i].size, mountains[i].y_pos + 134/300 * mountains[i].size);
        fill(255,255,255);
        triangle(mountains[i].x_pos + 75/300 * mountains[i].size,mountains[i].y_pos - 85/300 * mountains[i].size,
                 mountains[i].x_pos - 1/300 * mountains[i].size, mountains[i].y_pos + 10/300 * mountains[i].size,
                 mountains[i].x_pos + 151/300 * mountains[i].size,mountains[i].y_pos + 10/300 * mountains[i].size);
        fill(66,68,65);
        triangle(mountains[i].x_pos - 1/300 * mountains[i].size, mountains[i].y_pos + 10/300 * mountains[i].size,
                 mountains[i].x_pos + 151/300 * mountains[i].size, mountains[i].y_pos + 10/300 * mountains[i].size,
                 mountains[i].x_pos + 75/300 * mountains[i].size, mountains[i].y_pos - 15/300 * mountains[i].size);
    }
    
}
// Function to draw trees objects.

function drawTrees()
{
    
    for(var i = 0; i < trees_x.length; i++ ){
        fill(94,21,2);
        rect(trees_x[i] - 13, floorPos_y - 100,25,100);
        fill(3,109,12);
        ellipse(trees_x[i] - 31, floorPos_y - 100,80,80);
        ellipse(trees_x[i] + 30, floorPos_y - 100,80,80);    
        ellipse(trees_x[i] - 1, floorPos_y - 142,80,81);
    }
    
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{

    fill(100,155,255);
    rect(t_canyon.x_pos + 100,432,t_canyon.width,144);
    //lava
    fill(255,58,28);
    beginShape();
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.05 - (t_canyon.width - 100), 500);
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.20 - (t_canyon.width - 100), 460);
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.35 - (t_canyon.width - 100), 500);
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.50 - (t_canyon.width - 100), 460);
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.65 - (t_canyon.width - 100), 500);
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.80 - (t_canyon.width - 100), 460);
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.95 - (t_canyon.width - 100), 500);
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.95 - (t_canyon.width - 100), 576);
    curveVertex(t_canyon.x_pos + t_canyon.width * 1.08 - (t_canyon.width - 100), 576);
    endShape(CLOSE);

    fill(79,42,37);
    rect(t_canyon.x_pos + 95,432,t_canyon.width * 0.1,144);
    rect(t_canyon.x_pos + 95 + t_canyon.width,432, t_canyon.width * 0.1,144);
    rect(t_canyon.x_pos + 95 + t_canyon.width,432,t_canyon.width * 0.1,144);
    rect(t_canyon.x_pos + 95,560,t_canyon.width * 1.1, 16);
    
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{

    if(gameChar_world_x > t_canyon.x_pos + 95 + t_canyon.width * 0.1 
       && gameChar_world_x < t_canyon.x_pos + 95 + t_canyon.width && gameChar_y >= floorPos_y){
        isPlummeting = true;
    }
    
    if(isPlummeting == true){
        gameChar_y += 6;
        noStroke();
	    fill(0,155,0);
        screamSound.play();
        }
    
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------


// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    //bottle
    fill(13,69,7,230);
    strokeWeight(1);
    stroke(0)
    beginShape();
    vertex(t_collectable.x_pos + 199/50 * t_collectable.size , t_collectable.y_pos + 316/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 199/50 * t_collectable.size, t_collectable.y_pos + 277/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 209/50 * t_collectable.size, t_collectable.y_pos + 255/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 214/50 * t_collectable.size, t_collectable.y_pos + 231/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 214/50 * t_collectable.size, t_collectable.y_pos + 224/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 220/50 * t_collectable.size, t_collectable.y_pos + 224/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 220/50 * t_collectable.size, t_collectable.y_pos + 231/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 225/50 * t_collectable.size, t_collectable.y_pos + 255/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 235/50 * t_collectable.size, t_collectable.y_pos + 277/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 235/50 * t_collectable.size, t_collectable.y_pos + 316/50 * t_collectable.size);
    endShape(CLOSE)
    //top
    fill(255,223,0);
    beginShape();
    vertex(t_collectable.x_pos + 209/50 * t_collectable.size, t_collectable.y_pos + 255/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 214/50 * t_collectable.size, t_collectable.y_pos + 231/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 214/50 * t_collectable.size, t_collectable.y_pos + 224/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 220/50 * t_collectable.size, t_collectable.y_pos + 224/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 220/50 * t_collectable.size, t_collectable.y_pos + 231/50 * t_collectable.size);
    vertex(t_collectable.x_pos + 225/50 * t_collectable.size, t_collectable.y_pos + 255/50 * t_collectable.size);
    endShape();
    //label
    rect(t_collectable.x_pos + 201/50 * t_collectable.size, t_collectable.y_pos + 290/50 * t_collectable.size,
         32/50 * t_collectable.size, 20/50 * t_collectable.size);
    stroke(0,0,0);
    line(t_collectable.x_pos + 204/50 * t_collectable.size, t_collectable.y_pos + 300/50 * t_collectable.size, 
         t_collectable.x_pos + 230/50 * t_collectable.size, t_collectable.y_pos + 300/50 * t_collectable.size);
    line(t_collectable.x_pos + 208/50 * t_collectable.size, t_collectable.y_pos + 305/50 * t_collectable.size, 
         t_collectable.x_pos + 226/50 * t_collectable.size, t_collectable.y_pos + 305/50 * t_collectable.size);

}
    

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{

    var d = (dist(gameChar_world_x, gameChar_y,
                  t_collectable.x_pos + 227/50 * t_collectable.size, 
                  t_collectable.y_pos + 316/50 * t_collectable.size));
    
    if(d < 33)
    {
        t_collectable.isFound = true;
        game_score += 1;
        bottleSound.play();
    }
    
}


// Create an end to the level.

function renderPub()
{
    if(pub.isReached == false)
    {
        strokeWeight(2);
        fill(112, 94, 60);
        rect(pub.x_pos, floorPos_y, 250, -150);
        fill(76, 67, 49);
        triangle(pub.x_pos - 15, floorPos_y - 150,
                pub.x_pos + 125, floorPos_y - 240,
                pub.x_pos + 265, floorPos_y - 150);
        textSize(40);
        text("PUB", pub.x_pos + 85, floorPos_y - 110);
        
        rect(pub.x_pos + 95, floorPos_y, 60, -90);
    } else {
        strokeWeight(2);
        fill(112, 94, 60);
        rect(pub.x_pos, floorPos_y, 250, -150);
        fill(76, 67, 49);
        triangle(pub.x_pos - 15, floorPos_y - 150,
                pub.x_pos + 125, floorPos_y - 240,
                pub.x_pos + 265, floorPos_y - 150);
        textSize(40);
        text("PUB", pub.x_pos + 85, floorPos_y - 110);
        
        quad(pub.x_pos + 155, floorPos_y,
            pub.x_pos + 155, floorPos_y - 90,
            pub.x_pos + 175, floorPos_y - 95,
            pub.x_pos + 175, floorPos_y + 5);
        
        fill(255,223,0);
        rect(pub.x_pos + 95, floorPos_y, 60, -90);
        
    }
}

function checkPub()
{
    var d = dist(gameChar_world_x, floorPos_y - 40, pub.x_pos + 125, floorPos_y - 40);
    if(d < 5)
    {
        pub.isReached = true;
        pubSound.play();
    }
}
