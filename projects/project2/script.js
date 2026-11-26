
let buildings = [];
let allWindows = [];

// TIME //////////////////////////////////////////////

// CURRENT SIMULATED TIME (0-24)
let simulatedTime = 0;

// TRUE = AUTOMATIC, FALSE = MANUAL
let isAutomatic = true;

// HOW FAST TIME PASSES
let timeSpeed = 0.006;

// REMEMBER WHICH HOUR WAS LAST UPDATED
let previousWindowHour = -1;


// DAYLIGHT //////////////////////////////////////////////

let daylightAmount = 0;


// COLOURS //////////////////////////////////////////////

let bg;
let darkBuilding;
let blueBuilding;
let roofColour;
let darkWindow;
let yellowWindow;
let creamWindow;


// SET COLOURS //////////////////////////////////////////////

function setColours() {

    // NIGHT COLOURS
    let nightBg = color("#111326");
    let nightBuilding = color("#1C1B30");
    let nightBlue = color("#203B5D");
    let nightRoof = color("#17243D");
    let nightWindow = color("#101729");
    let nightCream = color("#F0D39A");

    // DAY COLOURS
    let dayBg = color("#DCE8E8");
    let dayBuilding = color("#D9C7A5");
    let dayBlue = color("#A9C5D1");
    let dayRoof = color("#718D9B");
    let dayWindow = color("#839BA4");
    let dayCream = color("#304C5A");

    // INTERPOLATE BETWEEN NIGHT AND DAY
    bg = lerpColor(nightBg, dayBg, daylightAmount);

    darkBuilding = lerpColor(
        nightBuilding, dayBuilding, daylightAmount
    );

    blueBuilding = lerpColor(
        nightBlue, dayBlue, daylightAmount
    );

    roofColour = lerpColor(
        nightRoof, dayRoof, daylightAmount
    );

    darkWindow = lerpColor(
        nightWindow, dayWindow, daylightAmount
    );

    creamWindow = lerpColor(
        nightCream, dayCream, daylightAmount
    );

    // KEEP WINDOWS WARM
    yellowWindow = color("#F5BD55");

    // UPDATE EXISTING BUILDINGS
    for (let b of buildings) {

        if (b.isBlue) {
            b.colour = blueBuilding;
        } else {
            b.colour = darkBuilding;
        }

    }

}


// CSV DATA //////////////////////////////////////////////

let table;
let hourData = [];


// CLOCK //////////////////////////////////////////////

// CLOCK SIZE
let clockRadius = 48 * 2;

// CLOCK INTERACTION
let draggingClock = false;

// CLOCK BUTTON
let clockButtonWidth = 76 * 2;
let clockButtonHeight = 25 * 2;


// GET CLOCK POSITION //////////////////////////////////////////////

// USE THE SAME POSITION FOR DRAWING AND INTERACTION
function getClockPosition() {

    return {
        x: width - clockRadius - 35,
        y: clockRadius + 35
    };

}


// SETUP //////////////////////////////////////////////

async function setup() {

    createCanvas(windowWidth, windowHeight);

    noStroke();

    // LOAD CSV
    table = await loadTable(
        "time_of_day_data.csv",
        ";",
        "header"
    );

    // COPY CSV DATA INTO ARRAY
    for (let row = 0; row < table.getRowCount(); row++) {

        let hour = table.getNum(row, "time");

        hourData[hour] = {

            awake: table.getNum(row, "awake"),

            comeHome: table.getNum(row, "come_home"),

            goToSleep: table.getNum(row, "go_to_sleep")

        };

    }

    // CREATE CITY
    createCity();

    // INITIALISE WINDOWS
    updateWindowStates();

}


// DRAW //////////////////////////////////////////////


function draw() {

    // AUTOMATIC TIME PROGRESSION
    if (isAutomatic) {

        simulatedTime += timeSpeed;

        // LOOP BACK TO MIDNIGHT
        if (simulatedTime >= 24) {
            simulatedTime = 0;
        }

    }

    // CALCULATE DAYLIGHT
    daylightAmount = (
        1 - cos(TWO_PI * simulatedTime / 24)
    ) / 2;

    // UPDATE COLOURS
    setColours();

    // UPDATE WINDOWS WHEN HOUR CHANGES
    let currentHour = floor(simulatedTime);

    if (currentHour !== previousWindowHour) {
        updateWindowStates();
    }

    // BACKGROUND
    background(bg);

    // DRAW SUN AND MOON
    drawCelestialBodies();

    // DRAW BUILDINGS
    for (let b of buildings) {
        drawBuilding(b);
    }

    // DRAW CLOCK
    drawClock();

}





// SUN AND MOON //////////////////////////////////////////////

function drawCelestialBodies() {

    // SUN AND MOON MOVE IN A CONTINUOUS CIRCLE

    // SUN POSITION
    // 06:00 = RIGHT
    // 12:00 = TOP
    // 18:00 = LEFT
    // 00:00 = BOTTOM

    let sunX = map(
        simulatedTime, 6, 18, width - 40, 40
    );

    let sunY = 165 - sin(map(simulatedTime, 6, 18, 0, PI)) * 100;

    // MOON POSITION
    // ALWAYS OPPOSITE THE SUN
    // 18:00 = RIGHT
    // 00:00 = TOP
    // 06:00 = LEFT

    let moonX;
    let moonY;

    if (simulatedTime >= 18) {

        moonX = map(simulatedTime, 18, 30, width - 40, 40);

        moonY = 165 - sin(map(simulatedTime, 18, 30, 0, PI)) * 100;

    } else {

        moonX = map(simulatedTime, -6, 6, width - 40, 40);

        moonY = 165 - sin(map(simulatedTime, -6, 6, 0, PI)) * 100;

    }


    // DRAW SUN DURING DAYTIME

    if (simulatedTime >= 6 && simulatedTime < 18) {

        push();

        // SUN RAYS
        stroke("#F5BD55");
        strokeWeight(3);

        for (let i = 0; i < 8; i++) {

            let angle = TWO_PI / 8 * i;

            let x1 = sunX + cos(angle) * 23;
            let y1 = sunY + sin(angle) * 23;

            let x2 = sunX + cos(angle) * 32;
            let y2 = sunY + sin(angle) * 32;

            line(x1, y1, x2, y2);

        }

        // SUN
        noStroke();
        fill("#F5BD55");

        circle(sunX, sunY, 38);

        pop();

    }


    // DRAW MOON DURING NIGHTTIME

    else {

        push();

        // MOON
        noStroke();
        fill("#F0D39A");

        circle(moonX, moonY, 38);

        // CREATE CRESCENT SHAPE
        fill(bg);

        circle(
            moonX + 12,
            moonY - 9,
            34
        );

        pop();

    }

}




// CLOCK //////////////////////////////////////////////

// CLOCK //////////////////////////////////////////////

function drawClock() {

    // CLOCK POSITION
    let position = getClockPosition();

    let clockX = position.x;
    let clockY = position.y;

    // CONTROL PANEL POSITION
    let controlX = clockX - clockRadius - 85;

    push();

    // CLOCK BACKGROUND
    fill(bg);
    stroke(creamWindow);
    strokeWeight(2);

    circle(clockX, clockY, clockRadius * 2);


    // CLOCK TICKS
    for (let i = 0; i < 12; i++) {

        let angle = map(i, 0, 12, -HALF_PI, TWO_PI - HALF_PI);

        let tickLength = 5;

        if (i % 3 === 0) {
            tickLength = 12;
            strokeWeight(2);
        } else {
            strokeWeight(1);
        }

        let x1 = clockX + cos(angle) * (clockRadius - 3);
        let y1 = clockY + sin(angle) * (clockRadius - 3);

        let x2 = clockX + cos(angle) * (clockRadius - 3 - tickLength);
        let y2 = clockY + sin(angle) * (clockRadius - 3 - tickLength);

        stroke(creamWindow);

        line(x1, y1, x2, y2);

    }


    // CLOCK NUMBERS
    noStroke();
    fill(creamWindow);

    textAlign(CENTER, CENTER);
    textSize(20);

    text("12", clockX, clockY - clockRadius + 27);
    text("3", clockX + clockRadius - 27, clockY);
    text("6", clockX, clockY + clockRadius - 27);
    text("9", clockX - clockRadius + 27, clockY);


    // CLOCK HAND
    let clockHour = simulatedTime % 12;

    let angle = map(clockHour, 0, 12, -HALF_PI, TWO_PI - HALF_PI);

    let handLength = clockRadius * 0.65;

    stroke(yellowWindow);
    strokeWeight(4);

    line(
        clockX,
        clockY,
        clockX + cos(angle) * handLength,
        clockY + sin(angle) * handLength
    );


    // CLOCK CENTRE
    noStroke();
    fill(yellowWindow);

    circle(clockX, clockY, 9);


    // DIGITAL TIME //////////////////////////////////////////////

    let hours = floor(simulatedTime);

    let minutes = floor((simulatedTime - hours) * 60);

    let timeText = nf(hours, 2) + ":" + nf(minutes, 2);

    fill(creamWindow);
    textAlign(CENTER, CENTER);

    // TIME
    textSize(42);

    text(timeText,controlX,clockY - 25 - 20);


    // AM / PM
    textSize(36);

    if (simulatedTime < 12) {
        text("AM", controlX, clockY);
    } else {
        text("PM", controlX, clockY );
    }


    // AUTO / MANUAL BUTTON //////////////////////////////////////////////

    let buttonX = controlX - clockButtonWidth / 2;
    let buttonY = clockY + 35;

    noStroke();
    fill(creamWindow);

    rect(
        buttonX,
        buttonY,
        clockButtonWidth,
        clockButtonHeight,
        10
    );

    fill(bg);
    textSize(24);

    if (isAutomatic) {
        text("PAUSE", controlX, buttonY + clockButtonHeight / 2);
    } else {
        text("AUTO", controlX, buttonY + clockButtonHeight / 2);
    }

    pop();

}

// CLOCK INTERACTION //////////////////////////////////////////////

function mousePressed() {

    let position = getClockPosition();

    let clockX = position.x;
    let clockY = position.y;

    // CHECK AUTO BUTTON
    let controlX = clockX - clockRadius - 85;

    let buttonX = controlX - clockButtonWidth / 2;
    let buttonY = clockY + 35;

    if (
        mouseX >= buttonX &&
        mouseX <= buttonX + clockButtonWidth &&
        mouseY >= buttonY &&
        mouseY <= buttonY + clockButtonHeight
    ) {

        isAutomatic = !isAutomatic;

        draggingClock = false;

        return;

    }


    // CHECK CLOCK FACE
    if (
        dist(mouseX, mouseY, clockX, clockY) <= clockRadius + 10
    ) {
        draggingClock = true;
        isAutomatic = false;
        updateTimeFromMouse();

    }

}


function mouseDragged() {

    if (draggingClock) {
        updateTimeFromMouse();
    }

}


function mouseReleased() {
    draggingClock = false;

}


// UPDATE TIME FROM CLOCK HAND //////////////////////////////////////////////

function updateTimeFromMouse() {

    let position = getClockPosition();

    let clockX = position.x;
    let clockY = position.y;

    // FIND ANGLE BETWEEN MOUSE AND CLOCK CENTRE
    let angle = atan2(
        mouseY - clockY,
        mouseX - clockX
    );

    // MOVE ZERO TO THE TOP OF THE CLOCK
    angle += HALF_PI;

    // KEEP ANGLE BETWEEN 0 AND 360 DEGREES
    if (angle < 0) {
        angle += TWO_PI;
    }

    // CONVERT ANGLE INTO 12-HOUR TIME
    let selectedHour = map(
        angle,
        0,
        TWO_PI,
        0,
        12
    );

    // KEEP THE CURRENT HALF OF THE DAY
    // 00:00-12:00 = AM
    // 12:00-24:00 = PM

    let halfOfDay = 0;

    if (simulatedTime >= 12) {
        halfOfDay = 12;
    }

    simulatedTime = halfOfDay + selectedHour;

    // UPDATE WINDOWS
    let currentHour = floor(simulatedTime);

    if (currentHour !== previousWindowHour) {
        updateWindowStates();
    }

}


// CREATE RESPONSIVE CITY //////////////////////////////////////////////

function createCity() {

    buildings = [];
    allWindows = [];

    // CITY AREA
    let cityTop = 300;
    let cityBottom = 30;

    let cityHeight = height - cityTop - cityBottom;

    // HOUSE CELLS
    let cellW = 260 + 100;
    let cellH = 240 + 100;

    // CHECK HOW MANY HOUSES FIT
    let columns = ceil(width / cellW);
    let rows = ceil(cityHeight / cellH);

    // ADAPT SPACING TO CITY AREA
    let actualCellW = width / columns;
    let actualCellH = cityHeight / rows;

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < columns; col++) {

            // HOUSE POSITION
            let x = col * actualCellW + 6;

            // VARY HOUSE HEIGHTS
            let heightVariation =
                0.72 + ((col * 3 + row * 5) % 4) * 0.07;

            let h = (actualCellH - 28) * heightVariation;
            let w = actualCellW - 12;

            let y =
                cityTop + row * actualCellH + actualCellH - h - 10;

            // VARY HOUSE COLOURS
            let colour;

            if ((row + col) % 3 === 0) {
                colour = blueBuilding;
            } else {
                colour = darkBuilding;
            }

            // CREATE HOUSE
            addBuilding(
                x, y, w, h,
                colour,
                4, 3
            );

        }

    }

}


// BUILDING FUNCTION //////////////////////////////////////////////

function addBuilding(x, y, w, h, colour, cols, rows) {

    let b = {

        x: x,
        y: y,
        w: w,
        h: h,

        colour: colour,

        // REMEMBER BUILDING TYPE
        isBlue: colour === blueBuilding,

        cols: cols,
        rows: rows,

        windows: []

    };

    // WINDOW DIMENSIONS
    let windowW = min(34, (w - 50) / cols);
    let windowH = min(38, (h - 65) / rows);

    // SPACING BETWEEN WINDOWS
    let gapX =
        ((w - 50 - cols * windowW) / (cols - 1)) * 0.7;

    let gapY =
        ((h - 65 - rows * windowH) / (rows - 1)) * 0.7;

    // CREATE WINDOWS
    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            let totalW =
                cols * windowW + (cols - 1) * gapX;

            let totalH =
                rows * windowH + (rows - 1) * gapY;

            let startX = (w - totalW) / 2;
            let startY = (h - totalH) / 2;

            let wx = startX + col * (windowW + gapX);
            let wy = startY + row * (windowH + gapY);

            b.windows.push({

                x: wx,
                y: wy,

                w: windowW,
                h: windowH,

                // WINDOW STARTS OFF
                isOn: false

            });

        }

    }

    buildings.push(b);
    allWindows.push(...b.windows);

}


// DRAW BUILDING //////////////////////////////////////////////

function drawBuilding(b) {

    // BUILDING FACADE
    fill(b.colour);

    rect(
        b.x,
        b.y,
        b.w,
        b.h
    );

    // ROOF
    fill(roofColour);

    triangle(
        b.x, b.y,
        b.x + b.w / 2, b.y - 45,
        b.x + b.w, b.y
    );

    // WINDOWS
    for (let win of b.windows) {

        drawWindow(b, win);

    }

}


// DRAW WINDOW //////////////////////////////////////////////

function drawWindow(b, win) {

    let x = b.x + win.x;
    let y = b.y + win.y;

    // DEFAULT WINDOW COLOUR
    let windowColour = darkWindow;

    // LIGHT ON
    if (win.isOn === true) {
        windowColour = yellowWindow;
    }

    fill(windowColour);

    rect(
        x,
        y,
        win.w,
        win.h
    );

    // WINDOW DIVISIONS
    stroke(bg);
    strokeWeight(4);

    line(
        x + win.w / 2,
        y,
        x + win.w / 2,
        y + win.h
    );

    line(
        x,
        y + win.h / 3,
        x + win.w,
        y + win.h / 3
    );

    noStroke();

}


// WINDOW SIMULATION //////////////////////////////////////////////

// REBUILD WINDOW STATES FOR THE SELECTED HOUR

function updateWindowStates() {

    // RESET ALL WINDOWS
    // START WITH 50% OF WINDOWS ON
    // THIS REPRESENTS PEOPLE WHO ARE STILL AWAKE AT MIDNIGHT

    randomSeed(42);

    for (let win of allWindows) {

        win.isOn = random() < 0.5;

    }

    // APPLY THE EVENTS FROM 24:00
    // THIS IS THE END OF THE PREVIOUS DAY

    applyHourlyEvents(24);

    // APPLY ALL EVENTS UP TO THE CURRENT HOUR
    for (let hour = 0; hour <= floor(simulatedTime); hour++) {

        applyHourlyEvents(hour);

    }

    // REMEMBER CURRENT HOUR
    previousWindowHour = floor(simulatedTime);

}


// APPLY CSV EVENTS FOR ONE HOUR //////////////////////////////////////////////

function applyHourlyEvents(hour) {

    let data = hourData[hour];

    if (!data) {
        return;
    }

    // USE THE SAME RANDOM SELECTION EACH TIME
    randomSeed(1000 + hour);

    // PEOPLE WAKE UP AND LEAVE
    // WINDOWS TURN OFF

    changeRandomWindows(
        data.awake,
        false
    );

    // PEOPLE COME HOME
    // WINDOWS TURN ON

    changeRandomWindows(
        data.comeHome,
        true
    );

    // PEOPLE GO TO SLEEP
    // WINDOWS TURN OFF

    changeRandomWindows(
        data.goToSleep,
        false
    );

}


// CHANGE RANDOM WINDOWS //////////////////////////////////////////////

function changeRandomWindows(amount, turnOn) {

    // FIND WINDOWS THAT CAN CHANGE STATE
    let candidates = [];

    for (let win of allWindows) {

        if (win.isOn !== turnOn) {
            candidates.push(win);
        }

    }

    // CSV NUMBERS REPRESENT EVENTS PER 100 PEOPLE
    // CONVERT THEM INTO A PROPORTION OF OUR WINDOWS

    let numberOfWindows = round(
        (amount / 100) * allWindows.length
    );

    // RANDOMISE THE CANDIDATES
    shuffleWindows(candidates);

    // CHANGE THE SELECTED WINDOWS
    for (
        let i = 0;
        i < min(numberOfWindows, candidates.length);
        i++
    ) {

        candidates[i].isOn = turnOn;

    }

}


// RANDOMISE ARRAY //////////////////////////////////////////////

function shuffleWindows(array) {

    for (let i = array.length - 1; i > 0; i--) {
        let j = floor(random(i + 1));
        // SWAP TWO POSITIONS
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }

}


// RESIZE //////////////////////////////////////////////

function windowResized() {

    resizeCanvas(windowWidth, windowHeight);

    createCity();

    // REBUILD WINDOW STATES AFTER RESIZING
    previousWindowHour = -1;

    updateWindowStates();

}
