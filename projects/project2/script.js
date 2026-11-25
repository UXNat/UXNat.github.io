
let player_x = 0;
let player_y = 0;
let player_size = 80;

let velocity_y = 0;
let gravity = 0.5;
let jump_strength = -12;

let ground_y = 0;
let is_jumping = false;


function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
}


function draw() {
    background(200);

    translate(windowWidth / 2, windowHeight / 2);


    //////// GROUND
    rectMode(CORNER);
    fill(0);
    rect(-windowWidth/2, player_size/2, windowWidth);


    //////// PLAYER
    rectMode(CENTER);
    fill(255);
    rect(player_x, player_y, player_size);


    //////// LEFT AND RIGHT MOVEMENT
    if (keyIsDown(LEFT_ARROW)) {
        player_x -= 10;
    }

    if (keyIsDown(RIGHT_ARROW)) {
        player_x += 10;
    }


    //////// GRAVITY
    player_y += velocity_y;
    velocity_y += gravity;


    //////// GROUND COLLISION
    if (player_y >= ground_y) {
        player_y = ground_y;
        velocity_y = 0;
        is_jumping = false;
    }

}


function keyPressed() {

    if (key == " " && !is_jumping) {
        velocity_y = jump_strength;
        is_jumping = true;
    }

}
