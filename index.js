let dragCount = 0
const unitLength = 20;
let boxColor = "#969696";
let gameStart = false;
let generateTime = false;

// var timeLeft = 5;
// var timeLeft2 = 5;
var timer;
var timer2;


document.querySelector('input[type="color"]').addEventListener('input', function (e) {
    boxColor = e.target.value
    dragCount = 0
});


const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;

function windowResized(){
    setup()
}

function setup() {
    /* Set the canvas to be under the element #canvas*/


    console.log(parent)
    let parentWidth = document.querySelector("#games").getBoundingClientRect().width
    const canvas = createCanvas(floor((parentWidth-20)/20)*20, windowHeight - 100);
    canvas.parent(document.querySelector('#canvas'));

    //    console.log("parent width is",document.querySelector("#games").getBoundingClientRect().width) 


    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard

}



//loop over both currentBoard and nextBoard to set all of the boxes' value to 0.
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
}

function draw() {

    background(255); //bg color 255,255,255
    if (gameStart || generateTime) {
        generate();
    }


    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {

                fill(boxColor) //if the box has life, then give it a color
            } else {
                fill(255); //if no life, then bg color
            }
            stroke(strokeColor); //stroke color
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
            //inbuilt function, x-coordinate of rectangle;y-coordinate of rectangle.;width of rectangle;height of rectangle.

        }
    }
}


//calculates the next generation with current generation.
function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge

                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];

                }
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
    if (!gameStart) return;
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    if (hexToRgb(boxColor)[0] + dragCount > 255 || hexToRgb(boxColor)[1] + dragCount > 255 || hexToRgb(boxColor)[2] + dragCount > 255) {
        dragCount = 0
        fill(hexToRgb(boxColor)[0] - dragCount, hexToRgb(boxColor)[1] - dragCount, hexToRgb(boxColor)[2] - dragCount);
    } else {
        fill(hexToRgb(boxColor)[0] + dragCount, hexToRgb(boxColor)[1] + dragCount, hexToRgb(boxColor)[2] + dragCount);
    }

    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
    dragCount++
}

/**
 * When mouse is pressed
 */

function mousePressed() {
    if (!gameStart) return;
    noLoop();
    mouseDragged();
}

document.querySelector('#start-game').addEventListener('click', function (e) {
    init();
    draw();

    if (timer) {
        clearInterval(timer)
        clearInterval(timer2)
    }

    gameStart = true;
    var timeLeft = 10;
    var timeLeft2 = 10;
    timer = setInterval(function () {
        console.log("i'm timer1", timer)
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.querySelector(".time").innerHTML = "TimesUp"
            // allow generating but not drawing
            // noLoop();

            // gameStart signifying can draw of not
            gameStart = false;

            generateTime = true;
            console.log("starting timer2")
            // set the 2nd timer allowing generation
            timer2 = setInterval(function () {
                console.log("hi i'm timer2", timer2)
                // if (timeLeft2 > 11 && timeLeft2 <= 20) {
                timeLeft2 -= 1;

                document.querySelector(".time").innerHTML = "Start Generating Pattern for" + timeLeft2

                if (timeLeft2 <= 0) {
                    noLoop();
                    clearInterval(timer2)
                }
                // }
            }, 1000)

        } else {
            document.querySelector(".time").innerHTML = timeLeft + " seconds remaining";
            timeLeft -= 1;
        }

    }, 1000);

    // var timer2 = setInterval(function(){
    //     if(timeLeft2 > 11 && timeLeft2 <=20){
    //         timeLeft2 -= 1;
    //         generateTime = true;
    //         document.querySelector(".time").innerHTML = "Start Generating Pattern for" + timeLeft2 
    //     }
    // },2000)


});


/**
 * When mouse is released
 */
function mouseReleased() {
    if (!gameStart) return;

    loop();
}

document.querySelector('#reset-game').addEventListener('click', function () {
    init();

    boxColor = "#969696"
    document.querySelector('input[type="color"]').value = "#969696"
    dragCount = 0
    draw();

});


let hexToRgbArry = []
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)

    hexToRgbArry[0] = r
    hexToRgbArry[1] = g
    hexToRgbArry[2] = b

    return hexToRgbArry

}








