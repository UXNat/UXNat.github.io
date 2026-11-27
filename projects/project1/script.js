
let font1;
let font2;
let font3;
let font4;

let fontPath = "Suisse.ttf";
let fontPath2 = "Pixellettersfull-BnJ5.ttf";
let fontPath3 = "PlayfulTime-BLBB8.ttf";
let fontPath4 = "RoughenCornerRegular-7RjV.ttf";

let current_font = 1;
let text_style_mode = "normal";

let frame_counter = 0;
let blinker_length = 2;
let typed_size = 100;
let typed_letters = [""];
let x = 0;
let y = 0;
let current_line = 0;

let random_x = [0];
let random_y = [0];

// COLORS
let aktuelle_farbe = '#1B7A8C';
let background_farbe = '#FDFDFB';
let text_farbe = '#1B7A8C';

let rotation = 0;

let mouse_clicked = 0;
let color_changed = 0;

let last_processed_size_position = -1;
let previous_color_position = -1;

let size_counter = 0;

let enter_counter_hints = 0

let easter_eggs = 0;

let white_discovered = 0
let red_discovered = 0
let blue_discovered = 0
let pink_discovered = 0
let green_discovered = 0
let orange_discovered = 0
let yellow_discovered = 0
let purple_discovered = 0

let bigger_discovered = 0
let bigger_counted = false;
let smaller_discovered = 0
let smaller_counted = false;

let click_discovered = 0;
let enter_discovered = 0;

let click_counted = false;
let enter_counted = false;

let six_seven_discovered = 0;

let rickroll;
let rickroll_discovered = false;
let rickroll_counted = 0;
let rickroll_counter_hint = 0;

let six_seven_counter_hint = 0;

let volume_nr = 0.5

let jumpscare_img;
let scream;

let jumpscare_active = false;
let jumpscare_start = 0;
let previous_jumpscare = -1;

let boo_hint_counter = 0;

let italicOrBold_counter_hints= 0;

function preload() {
    rickroll = loadSound("Voicy_Rickroll (1).mp3");
    jumpscare_img = loadImage("jumpscare.webp");
    scream = loadSound("scream.mp3");
}

async function setup() {

    // LOAD FONTS
    font1 = await loadFont(fontPath);
    font2 = await loadFont(fontPath2);
    font3 = await loadFont(fontPath3);
    font4 = await loadFont(fontPath4);

    createCanvas(windowWidth, windowHeight);

    rectMode(CENTER);
    noStroke();

}


function draw() {

    // CLOCK
    if (frameCount % 60 == 0) {
        frame_counter++;
        console.log(frame_counter);
    }


    // COLORS
    background(background_farbe);


    // SELECT CURRENT FONT
    if (current_font == 1) {
        textFont(font1);
    }
    else if (current_font == 2) {
        textFont(font2);
    }
    else if (current_font == 3) {
        textFont(font3);
    }
    else if (current_font == 4) {
        textFont(font4);
    }


    let text_a = typed_letters.join("");


    // TEXT STYLE COMMANDS
    let lower_style_text = text_a.toLowerCase();

    let italic_position = lower_style_text.lastIndexOf("italic");
    let bold_position = lower_style_text.lastIndexOf("bold");
    let normal_position = lower_style_text.lastIndexOf("normal");

    let last_style_position = Math.max(
        italic_position,
        bold_position,
        normal_position
    );

    // THE LAST TYPED COMMAND DETERMINES THE STYLE
    if (last_style_position == italic_position && italic_position != -1) {
        text_style_mode = "italic";
         italicOrBold_counter_hints++
    }
    else if (last_style_position == bold_position && bold_position != -1) {
        text_style_mode = "bold";
         italicOrBold_counter_hints++
    }
    else if (last_style_position == normal_position && normal_position != -1) {
        text_style_mode = "normal";
    }

    // APPLY STYLE TO ALL FONTS
    if (text_style_mode == "italic") {
        textStyle(ITALIC);
    }
    else if (text_style_mode == "bold") {
        textStyle(BOLD);
    }
    else {
        textStyle(NORMAL);
    }


    // RICKROLL EASTER EGG
    let rickroll_count = text_a.split("give you up").length - 1;

    if (rickroll_count > rickroll_counted) {

        rickroll.stop();
        rickroll.setVolume(volume_nr);
        rickroll.play();

        rickroll_counted = rickroll_count;

        // ONLY COUNT THE FIRST DISCOVERY
        if (!rickroll_discovered) {

            easter_eggs++;
            rickroll_discovered = true;
            rickroll_counter_hint++;

        }

    }


    // FIND COLOR POSITIONS
    let white_position = text_a.lastIndexOf("white");
    let blue_position = text_a.lastIndexOf("blue");
    let red_position = text_a.lastIndexOf("red");
    let yellow_position = text_a.lastIndexOf("yellow");
    let green_position = text_a.lastIndexOf("green");
    let purple_position = text_a.lastIndexOf("purple");
    let orange_position = text_a.lastIndexOf("orange");
    let pink_position = text_a.lastIndexOf("pink");


    let last_color_position = Math.max(
        white_position,
        blue_position,
        red_position,
        yellow_position,
        green_position,
        purple_position,
        orange_position,
        pink_position
    );


    // CHECK IF A NEW COLOR WAS TYPED

    if (last_color_position == white_position && white_position != -1) {
        aktuelle_farbe = '#FDFDFB';
        color_changed++;
        white_discovered++
    }
    else if (last_color_position == blue_position && blue_position != -1) {
        aktuelle_farbe = '#8FD0F2';
        color_changed++;

        blue_discovered++
    }
    else if (last_color_position == red_position && red_position != -1) {
        aktuelle_farbe = '#E4432A';
        color_changed++;

        red_discovered++
    }
    else if (last_color_position == yellow_position && yellow_position != -1) {
        aktuelle_farbe = '#F6E27A';
        color_changed++;

        yellow_discovered++
    }
    else if (last_color_position == green_position && green_position != -1) {
        aktuelle_farbe = '#93C572';
        color_changed++;

        green_discovered++
    }
    else if (last_color_position == purple_position && purple_position != -1) {
        aktuelle_farbe = '#B75FCB';
        color_changed++;

        purple_discovered++
    }
    else if (last_color_position == orange_position && orange_position != -1) {
        aktuelle_farbe = '#FFB347';
        color_changed++;

        orange_discovered++
    }
    else if (last_color_position == pink_position && pink_position != -1) {
        aktuelle_farbe = '#ffd1dc';
        color_changed++;

        pink_discovered++
    }


    if (white_discovered == 1 || red_discovered == 1 || blue_discovered == 1 || yellow_discovered == 1 || green_discovered == 1 || purple_discovered == 1 || pink_discovered == 1 || orange_discovered == 1) {
        easter_eggs++
    }


    // CHECK IF BIGGER OR SMALLER WAS TYPED
    let lower_text = text_a.toLowerCase();

    let bigger_position = Math.max(
        lower_text.lastIndexOf("bigger"),
        lower_text.lastIndexOf("big")
    );

    let smaller_position = Math.max(
        lower_text.lastIndexOf("smaller"),
        lower_text.lastIndexOf("small")
    );

    let last_size_position = Math.max(
        bigger_position,
        smaller_position
    );


    // ONLY PROCESS A NEW SIZE COMMAND ONCE
    if (last_size_position != last_processed_size_position && last_size_position != -1) {

        if (last_size_position == bigger_position) {
            typed_size = typed_size + 20;
            size_counter++;
            bigger_discovered++;
        }

        else if (last_size_position == smaller_position) {
            typed_size = typed_size - 20;
            size_counter++;
            smaller_discovered++;
        }

        last_processed_size_position = last_size_position;
    }

    /*if (bigger_discovered == 1 || smaller_discovered == 1) {
        easter_eggs++
    }**/


    if (bigger_discovered == 1 && !bigger_counted) {
        easter_eggs++;
        bigger_counted = true;
    }

    if (smaller_discovered == 1 && !smaller_counted) {
        easter_eggs++;
        smaller_counted = true;
    }



    // CURRENT TEXT COLOR
    if (aktuelle_farbe != background_farbe) {
        text_farbe = aktuelle_farbe;
    }

    fill(text_farbe);



    // BIG BACKGROUND TEXT
    let text_big = typed_letters[current_line].slice(-3);

    push();

    textSize(windowWidth * 0.8);

    fill(red(text_farbe), green(text_farbe), blue(text_farbe), 50);

    textAlign(CENTER, CENTER);

    text(text_big, windowWidth / 2, windowHeight / 2);

    pop();



    // NORMAL LETTERS
    translate(windowWidth / 2, windowHeight / 2);
    rotate(rotation);

    textSize(typed_size);
    textAlign(LEFT, BASELINE);


    for (let i = 0; i < typed_letters.length; i++) {

        push();

        translate(random_x[i], random_y[i]);

        // rotate(random_rotation[i]);

        text(typed_letters[i], 0, 0);

        pop();

    }



    // CURSOR POSITION
    textSize(typed_size);

    let cursor_x = textWidth(typed_letters[current_line]);

    let letter_height = textAscent() + textDescent();
    let cursor_offset = 0;

    rectMode(CORNER);

    if (frame_counter % blinker_length == 0) {

        if (current_font == 1) {
            cursor_offset = 0;
        }

        rect(
            random_x[current_line] + cursor_x + cursor_offset,
            random_y[current_line] - textAscent(),
            typed_size / 30,
            letter_height
        );

    }


    let six_seven = text_a.lastIndexOf("sixseven");
    let six_seven2 = text_a.lastIndexOf("67");
    let six_seven3 = text_a.lastIndexOf("six seven");
    let six_seven4 = text_a.lastIndexOf("Six Seven");
    let six_seven5 = text_a.lastIndexOf("Six seven");
    let six_seven6 = text_a.lastIndexOf("SIXSEVEN");
    let six_seven7 = text_a.lastIndexOf("SIX SEVEN");


    if (six_seven != -1 || six_seven2 != -1 || six_seven3 != -1 || six_seven4 != -1 || six_seven5 != -1 || six_seven6 != -1 || six_seven7 != -1) {

        six_seven_counter_hint++
        textSize(500)
        text("67", random(0 - windowWidth / 2, windowWidth / 2), random(0 - windowWidth / 2, windowWidth / 2));
        six_seven_discovered++

        if (six_seven_discovered == 1) {
            easter_eggs++;
        }
    }




    let stop = text_a.lastIndexOf("stop");

    if (stop != -1 && volume_nr < 1) {
        volume_nr += 0.1;
        rickroll.setVolume(volume_nr);
    }


            // JUMPSCARE EASTER EGG
    let jumpscare = text_a.lastIndexOf("boo");

    // START JUMPSCARE ONLY WHEN BOO IS NEW
    if (jumpscare != -1 && jumpscare != previous_jumpscare) {

        jumpscare_active = true;
        boo_hint_counter++;
        jumpscare_start = frame_counter;

        // PLAY SCREAM SOUND
        scream.stop();
        scream.play();

        previous_jumpscare = jumpscare;
    }

    // RESET WHEN BOO IS DELETED
    if (jumpscare == -1) {
        previous_jumpscare = -1;
    }

    // SHOW JUMPSCARE FOR 3 SECONDS
    if (jumpscare_active) {

        if (frame_counter - jumpscare_start < 3) {

            imageMode(CENTER);
            image(jumpscare_img, 0, 0, windowWidth, windowHeight);

        } else {

            jumpscare_active = false;
        }
    }






    // EASTER EGGS COUNTER
    textSize(typed_size);

    text(`easter eggs collected: ${easter_eggs}/16`, 0, typed_size);


    if (click_discovered == 1 && !click_counted) {
        easter_eggs++;
        click_counted = true;
    }



    ////////////////////////////////////////////////////////
    // HINTS

    // CLICK
    if (frame_counter >= 30 && mouse_clicked < 2) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("you rly didnt try clicking yet?", 0, 2 * typed_size + 10);

    }


    // WRITE COLOR
    if (frame_counter >= 45 && color_changed < 1) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("grass is...", 0, 3 * typed_size + 10);

    }

    // WRITE COLOR
    if (frame_counter >= 45 && color_changed >= 1 && color_changed < 250  ) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("the sky is...", 0, 3 * typed_size + 10);

    }

    // ITALIC BOLD
    if (frame_counter >= 65 && italicOrBold_counter_hints < 1) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("what else can you do with fonts?", 0, 5 * typed_size + 10);

    }

    // MAKE BIGGER/SMALLER
    if (frame_counter >= 70 && size_counter < 1) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("your grandma cant read this, its too SMALL", 0, 4 * typed_size + 10);

    }

    


    // ENTER
    if (frame_counter >= 80 && enter_counter_hints < 1) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("press ENTER", 0, 5 * typed_size + 10);

    }

    // ENTER
    if (frame_counter >= 110 && rickroll_counter_hint < 1) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("'im never gonna...'", 0, 6 * typed_size + 10);

    }


    // ENTER
    if (frame_counter >= 130 && six_seven_counter_hint < 1) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("whats the best meme on earth?", 0, 7 * typed_size + 10);

    }


    // BOO
    if (frame_counter >= 150 && boo_hint_counter < 1) {

        fill(255, 0, 0)
        textSize(typed_size / 1.5);
        text("scare me.", 0, 7 * typed_size + 10);

    }

}




function keyTyped() {

    // SELECT CURRENT FONT FOR SIZE CALCULATION
    if (current_font == 1) {
        textFont(font1);
    }
    else if (current_font == 2) {
        textFont(font2);
    }
    else if (current_font == 3) {
        textFont(font3);
    }
    else if (current_font == 4) {
        textFont(font4);
    }

    // APPLY CURRENT TEXT STYLE
    if (text_style_mode == "italic") {
        textStyle(ITALIC);
    }
    else if (text_style_mode == "bold") {
        textStyle(BOLD);
    }
    else {
        textStyle(NORMAL);
    }

    textSize(typed_size);

    if (textWidth(typed_letters[current_line] + key) > windowWidth / 2 - random_x[current_line]) {

        current_line++;

        typed_letters.push("");

        random_x.push(random(-windowWidth / 2, windowWidth / 2 - typed_size));

        random_y.push(random(-windowHeight / 2 + typed_size, windowHeight / 2));

    }

    typed_letters[current_line] += key;

    return false;

}




function keyPressed() {

    if (key === "Backspace" || key === "Delete") {

        if (typed_letters[current_line].length > 0) {

            typed_letters[current_line] = typed_letters[current_line].slice(0, -1);

        }

        else if (current_line > 0) {

            typed_letters.pop();
            current_line--;

        }

        return false;

    }


    // SWITCH BETWEEN FOUR FONTS
    if (key == "Enter") {

        current_font++;
        enter_discovered++;
        enter_counter_hints++

        if (current_font > 4) {
            current_font = 1;
        }

        // COUNT FIRST THREE FONT CHANGES AS EASTER EGGS
        if (enter_discovered <= 3) {
            easter_eggs++;
        }

        return false;

    }

}



// MOUSE CLICK: CHANGE COLORS
function mouseClicked() {

    mouse_clicked++;
    click_discovered++;
    //easter_eggs++

    let temp = background_farbe;

    background_farbe = text_farbe;
    text_farbe = temp;

    aktuelle_farbe = text_farbe;

}
