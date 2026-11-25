
let currentYear = 2000;
let previousYear = currentYear;

let buildings = [];
let allWindows = [];

// COLOURS
const bg = "#111326";
const darkBuilding = "#1C1B30";
const blueBuilding = "#203B5D";
const roofColour = "#17243D";
const darkWindow = "#101729";
const yellowWindow = "#F5BD55";
const creamWindow = "#F0D39A";

let table;

let years = [];
let capacities = [];

// CUSTOM SLIDER //////////////////////////////////////////////

// SLIDER POSITION
let sliderMargin = 50;
let sliderY = 155;

// SLIDER APPEARANCE
let sliderLineWeight = 6;
let sliderCircleSize = 30;

let sliderLineColour = creamWindow;
let sliderCircleColour = yellowWindow;

// SLIDER INTERACTION
let sliderStart;
let sliderEnd;

let draggingSlider = false;


async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  table = await loadTable("solar_data.csv", ";", "header");

  // COPY CSV DATA INTO ARRAYS
  for (let row = 0; row < table.getRowCount(); row++) {

    years.push(table.getNum(row, "year"));

    capacities.push(
      table.getNum(row, "installed_solar_capacity_mwp")
    );

  }

  createCity();

  // SET SLIDER POSITION
  sliderStart = sliderMargin;
  sliderEnd = width - sliderMargin;

  updateSolarWindows();
}


function draw() {

  background(bg);

  // DRAW BUILDINGS
  for (let b of buildings) {
    drawBuilding(b);
  }

  // DISPLAY CURRENT YEAR
  push();

  fill(creamWindow);
  noStroke();

  textSize(60);
  textAlign(CENTER);

  text(currentYear, windowWidth/2, windowHeight/2);

  pop();

  // DRAW CUSTOM SLIDER
  drawYearSlider();

}


// CUSTOM YEAR SLIDER //////////////////////////////////////////////


function drawYearSlider() {

  // SLIDER POSITION
  let y = height - sliderY;

  // CALCULATE CIRCLE POSITION FROM CURRENT YEAR
  let sliderPosition = map(
    currentYear,
    2000,
    2023,
    sliderStart,
    sliderEnd
  );

  push();

  // DRAW SLIDER LINE
  stroke(sliderLineColour);
  strokeWeight(sliderLineWeight);

  line(
    sliderStart,
    y,
    sliderEnd,
    y
  );

  // DRAW SLIDER CIRCLE
  noStroke();
  fill(sliderCircleColour);

  circle(sliderPosition, y, sliderCircleSize );

  pop();

}


// SLIDER MOUSE INTERACTION //////////////////////////////////////////////


function mousePressed() {

  let y = height - sliderY;

  let sliderPosition = map(
    currentYear,
    2000,
    2023,
    sliderStart,
    sliderEnd
  );

  // CHECK IF MOUSE IS CLOSE TO THE SLIDER
  if (
    mouseX >= sliderStart - sliderCircleSize &&
    mouseX <= sliderEnd + sliderCircleSize &&
    abs(mouseY - y) < sliderCircleSize
  ) {

    draggingSlider = true;

    updateSliderYear();

  }

}


function mouseDragged() {

  if (draggingSlider) {
    updateSliderYear();
  }

}


function mouseReleased() {

  draggingSlider = false;

}


// UPDATE YEAR WHEN SLIDER MOVES //////////////////////////////////////////////


function updateSliderYear() {

  let newPosition = constrain(
    mouseX,
    sliderStart,
    sliderEnd
  );

  let newYear = round(
    map(
      newPosition,
      sliderStart,
      sliderEnd,
      2000,
      2023
    )
  );

  if (newYear !== currentYear) {

    currentYear = newYear;

    updateSolarWindows();

  }

}


// CREATE RESPONSIVE CITY //////////////////////////////////////////////


function createCity() {

  buildings = [];
  allWindows = [];

  // HOUSE CELLS
  let cellW = 260+100;
  let cellH = 240+100;

  // CHECK HOW MANY HOUSES FIT
  let columns = ceil(width / cellW);
  let rows = ceil(height / cellH);

  // ADAPT SPACING TO SCREEN SIZE
  let actualCellW = width / columns;
  let actualCellH = height / rows;


  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < columns; col++) {

      // HOUSE POSITION
      let x = col * actualCellW + 6;

      // VARY HOUSE HEIGHTS
      let heightVariation = 0.72 + ((col * 3 + row * 5) % 4) * 0.07;

      let h = (actualCellH - 28) * heightVariation;
      let w = actualCellW - 12;

      let y = row * actualCellH + actualCellH - h - 10;

      // VARY BUILDING COLOURS
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



// BUILDING FUNCTION//////////////////////////////////////////////


function addBuilding(x, y, w, h, colour, cols, rows) {

  let b = {
    x: x,
    y: y,
    w: w,
    h: h,
    colour: colour,
    cols: cols,
    rows: rows,

    windows: []
  };


  // WINDOW DIMENSIONS
  let windowW = min(34, (w - 50) / cols);
  let windowH = min(38, (h - 65) / rows);


  // SPACING BETWEEN WINDOWS
  let gapX = ((w - 50 - cols * windowW) / (cols - 1)) * 0.7;
  let gapY = ((h - 65 - rows * windowH) / (rows - 1)) * 0.7;


  // CREATE WINDOWS
  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {

      let totalW = cols * windowW + (cols - 1) * gapX;
      let totalH = rows * windowH + (rows - 1) * gapY;

      let startX = (w - totalW) / 2;
      let startY = (h - totalH) / 2;

      let wx = startX + col * (windowW + gapX);
      let wy = startY + row * (windowH + gapY);

      // PLACEHOLDER SOLAR YEAR
      let solarYear = null;

      b.windows.push({

        x: wx,
        y: wy,
        w: windowW,
        h: windowH,
        solarYear: solarYear

      });

    }
  }

  buildings.push(b);
  allWindows.push(...b.windows);

}


// DRAW BUILDING//////////////////////////////////////////////


function drawBuilding(b) {

  // BUILDING FACADE
  fill(b.colour);
  rect(b.x, b.y, b.w, b.h);


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



// DRAW WINDOW//////////////////////////////////////////////


function drawWindow(b, win) {

  let x = b.x + win.x;
  let y = b.y + win.y;

  // DEFAULT WINDOW COLOUR
  let windowColour = darkWindow;


  // SOLAR-POWERED WINDOW
  if (win.isSolar === true) {
    windowColour = yellowWindow;
  }

  fill(windowColour);

  rect(x, y, win.w, win.h);


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


// UPDATE SOLAR WINDOWS//////////////////////////////////////////////


function updateSolarWindows() {

  // FIND THE CORRECT YEAR IN THE CSV
  let yearIndex = years.indexOf(currentYear);

  // GET SOLAR CAPACITY FOR THAT YEAR
  let solarCapacity = capacities[yearIndex];

  // GET MAXIMUM CAPACITY FROM THE DATA
  let maxCapacity = max(capacities);

  // CALCULATE HOW MANY WINDOWS SHOULD BE YELLOW
  let solarWindowCount = round(
    map(solarCapacity, 0, maxCapacity, 0, allWindows.length)
  );

  // TURN THE CORRECT NUMBER OF WINDOWS ON/OFF
  for (let i = 0; i < allWindows.length; i++) {

    if (i < solarWindowCount) {
      allWindows[i].isSolar = true;
    } else {
      allWindows[i].isSolar = false;
    }

  }

}



// RESIZE//////////////////////////////////////////////


function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  createCity();

  sliderStart = sliderMargin;
  sliderEnd = width - sliderMargin;

  updateSolarWindows();

}
