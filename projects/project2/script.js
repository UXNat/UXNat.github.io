let player_x = 0;
let player_y = 0;
let player_size = 50


let ground_r = 0
let ground_g = 0
let ground_b = 0

let velocity_y = 0; //how fast player moves
let gravity = 0.5; //how the speed changes over time 
let jump_strength = -12;

let ground_y = 0;
let is_jumping = false;
let jumped_counter = 0;
let was_jumping = false;



function setup(){
 createCanvas(windowWidth, windowHeight)
	noStroke();
	
}
  

function draw() {
    background(200);
	
	
    translate(windowWidth / 2, windowHeight / 2);

	
 ////////GROUND
	rectMode(CORNER)
	fill(ground_r, ground_g, ground_b);
	rect(-windowWidth/2,player_size/2, windowWidth)

	/*push()
 noLoop();
	for (let i = 0; i < 7; i++){
		fill(random(0,255), random(0,255), random(0,255));
		rect(-windowWidth/2, player_size/2, windowWidth, windowWidth/i)
	}
	pop()**/

	////////PLAYER
	rectMode(CENTER);
    fill(255);
    rect(player_x, player_y, player_size);


    // LEFT AND RIGHT MOVEMENT
    if (keyIsDown(LEFT_ARROW)) {
        player_x -= 10;
    }

    if (keyIsDown(RIGHT_ARROW)) {
        player_x+= 10;
    }

    
    


    //////// print DATA  /////////////////////////////////////////////////////////////////////
    textSize(60);   
    text(`jumps: ${jumped_counter} `, -100, -100)

    //////// visualize DATA  /////////////////////////////////////////////////////////////////////
    let rect_width = jumped_counter*100
    
    fill(255,0,0)
    rect(-windowWidth/2,-player_size/2, rect_width, 50 )

    
     if (player_x - player_size/2 < -windowWidth/2 + rect_width) {
    player_x = -windowWidth/2 + rect_width + player_size/2;
    }



    // RED BAR COLLISION WITH PLAYER
   


    //(map(constrain(jumped_counter, 0, width), 0, width, wi, 40))

    //JUMPS
    /*let previous_jumped = 0;
    let jumped = 0;

        if (jumped > previous_jumped) {
            console.log("number of jumps increased!");
            text_farbe(`jumps: ${jumped_counter} `)
        }

        previous_jumped = jumped;**/
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // GRAVITY
    player_y += velocity_y; // 0 -12 = -12, -12 - 11.5 = -23.5, ...
    velocity_y += gravity; //-12 +0.5, +0.5, +0.5 ... wird immer höher dh sinkt wieder


    // GROUND COLLISION
    if (player_y >= ground_y) {
    player_y = ground_y;
    velocity_y = 0;
    is_jumping = false;

	    if (was_jumping) {
	        jumped_counter++;
            fill(255)
            
	        //console.log(jumped_counter);
	        was_jumping = false;
			ground_r += 20
			ground_g += 20
			ground_b += 20
    }

	}


    
}


function keyPressed() {

    if (key == " " && !is_jumping) {
    velocity_y = jump_strength; //velocity wird zu -12 y dh geht hoch
    is_jumping = true;
    was_jumping = true;
}

}


