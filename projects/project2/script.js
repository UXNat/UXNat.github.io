
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

let yearSlider;


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

  // CREATE YEAR SLIDER //////////////////////////////////////////////
  yearSlider = createSlider(2000, 2023, 2000, 1);

  yearSlider.position(30, height - 45);
  yearSlider.size(300);

  // UPDATE YEAR WHEN SLIDER MOVES
  yearSlider.input(function() {

    currentYear = int(yearSlider.value());

    updateSolarWindows();

  });

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

  textSize(48);
  textAlign(LEFT, TOP);

  text(currentYear, 30, 25);

  pop();


}


// CREATE RESPONSIVE CITY //////////////////////////////////////////////


function createCity() {

  buildings = [];
  allWindows = [];

  // HOUSE CELLS
  let cellW = 260;
  let cellH = 240;

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
  let windowW = min(20, (w - 50) / cols);
  let windowH = min(32, (h - 65) / rows);


  // SPACING BETWEEN WINDOWS
  let gapX = (w - 50 - cols * windowW) / (cols - 1);
  let gapY = (h - 65 - rows * windowH) / (rows - 1);


  // CREATE WINDOWS
  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {

      let wx = 25 + col * (windowW + gapX);
      let wy = 35 + row * (windowH + gapY);

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
    b.x, b.y,                   // bottom left
    b.x + b.w / 2, b.y - 45,    // top point
    b.x + b.w, b.y              // bottom right
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
  strokeWeight(3);

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

  updateSolarWindows();

  yearSlider.position(30, height - 45);

}
