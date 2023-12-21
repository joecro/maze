import transitionEnd from './browser-specific.js';
import { map as defaultMap, generateRandomMap } from './map.js';
import { showFinishedMessage, updateAriaMessages } from './messages.js';


var mazeLocked = false;
var tehMap = defaultMap; // the MAP

/**
 * TODO: fix templating so that I can dynamically set the size of the map
 */
var mapwidth = 6,
    mapheight = 6;

let steps = [];

/**
 * any setup that needs doing before user goes running round in the map
 */
function newMap(size = 6) {
    mapheight = size, mapwidth = size;
    tehMap = generateRandomMap(mapheight,mapwidth);
    
    initMap();
}


/**
 * refresh the current map as is
 */
function initMap() {

    let nTiles = mapheight * mapwidth;
    let remaining = nTiles;
    let currentSet = false;
    let thisClass = "";

    // TODO: 
    //    make sure there are exactly nTiles = mapheight * mapwidth .map-tile elements
    var tiles = document.getElementsByClassName('map-tile'); 

    while ( tiles.length > nTiles ) {
        tiles[0].remove(); // pop
    }

    while ( tiles.length < nTiles ) {
        tiles[0].parentElement.appendChild(tiles[0].cloneNode(true));  // push
    }

    //    set #tehmap { grid-template-columns: repeat(mapwidth, 1fr);   grid-template-rows: repeat(mapheight, 1fr); }
    document.documentElement.style.setProperty('--nCols', mapwidth);
    document.documentElement.style.setProperty('--nRows', mapheight);

    let tileNumber = 0;
    for (let row = 0; row < mapheight; row++) {
        for (let col = 0; col < mapwidth; col++) {
            thisClass = tehMap[row][col];
            tiles[tileNumber].className = "map-tile";
            tiles[tileNumber].setAttribute("data-x-coord", col);
            tiles[tileNumber].setAttribute("data-y-coord", row);
            
            if (!currentSet && Math.random() < 1/remaining--) {
                tiles[tileNumber].className += " current";
                currentSet = true;
            }
            tiles[tileNumber++].firstElementChild.setAttribute('class', thisClass);
        }
    }

    // ick. this assumes the map is always n x n tiles - no rectangles. also 'steps' is not a great descriptor
    steps = [];
    let stepLength = 1/mapwidth;
    let firstStep = stepLength / 2;
    let nextStep = firstStep;

    // set up 'steps' - these are used in CSS to move the pointr around the map
    while (nextStep < 1) {
        // add the next step to the array
        steps.push(nextStep);

        nextStep += stepLength;
    }

    move('current');
    
    // TODO: better name than 'directions'
    let directions = document.querySelector('.directions');
    directions.setAttribute('class','directions visually-hidden');

    document.body.focus();
}

/**
* Well done you! you reached the end and won a warm feeling
*/
function finished() {

    try {
        // gap of 50ms is just noticeable
        window.navigator.vibrate([600, 200, 150, 80, 1200]);
    } catch (error) {
        console.log("Edge doesn't ignore vibrate");
    }

    let tid = window.setTimeout(showFinishedMessage, 1000);
}


/**
 * User tried an illegal move.  Bump shows they can't go that way
 * @param {String} direction 
 */
function bump(direction) {
    let borders = document.getElementsByClassName(direction + '-border');

    if (borders.length != 1) {
        console.log('something went wrong in move. Either too many or not enough borders');
        return 0;
    };

    let border = borders[0];

    let currentClass = border.getAttribute('class');
    border.setAttribute('class', currentClass + ' bump');

    window.setTimeout(() => { border.setAttribute('class', currentClass); }, 100 );

    try {
        // gap of 50ms is just noticeable
        window.navigator.vibrate([100, 50, 60]);
    } catch (error) {
        console.log("Edge doesn't ignore vibrate");
    }
}


/**
 * Move the pointer along the map
 * @param {} direction 
 */
function move(direction) {
    if (mazeLocked) {
        // TODO: lock the maze until movement has finished
        //return false;
    }

    mazeLocked = true;

    let currentTile = document.querySelector('.map-tile.current');
    let currentX = 1.0 * currentTile.getAttribute('data-x-coord');
    let currentY = 1.0 * currentTile.getAttribute('data-y-coord');

    let newX = currentX, newY = currentY; 
    let pointers = document.querySelectorAll('.pointer');

        
    switch (direction) {
        case('current'):
            break;
        case 'north':
            newY -= 1;
            break;
        case 'south':
            newY += 1;
            break;
        case 'east':
            newX += 1;
            break;
        case 'west':
            newX -= 1;
            break;
        default:
            throw (direction + " was not recognised as a direction");
    }   

    pointers.forEach(node => (node.style['top'] = 100 * steps[newY] + '%'));
    pointers.forEach(node => (node.style['left'] = 100 * steps[newX] + '%'));


    currentTile.className = "map-tile";
    let newTile = document.querySelector(".map-tile[data-x-coord='" + newX + "'][data-y-coord='" + newY + "']");
    newTile.className += " current";

    if (newTile.firstElementChild.className.baseVal.indexOf("tile-016") >= 0) {
        finished();
    }
    mazeLocked = false;
}


/**
 * Get the tile number for the current tile.  eg to see which direction/s we can move
 */
function getCurrentTileNumber() {
    let currents = document.getElementsByClassName('map-tile current');

    if (currents.length != 1) {
        console.log('something went wrong in getCurrentTileNumber. Either too many or not enough tiles');
        return 0;
    };

    let current = currents[0];
    let currentTileSVG = current.children[0];
    let currentTileNumber = currentTileSVG.getAttribute('class');

    return currentTileNumber;
}


function tryToMove(direction, tileNumber) {
    if (undefined == tileNumber) {
        tileNumber = getCurrentTileNumber();
    }

    canIMove(direction, tileNumber) ? move(direction) : bump(direction);
}


function canIMove(direction, tileNumber) {
    if (undefined == tileNumber) {
        tileNumber = getCurrentTileNumber();
    }
    
    switch (direction) {
        case('current'):
            return true;
            break;
        case 'north':
            return canIMoveNorth(tileNumber);
            break;
        case 'south':
            return canIMoveSouth(tileNumber);
            break;
        case 'east':
            return canIMoveEast(tileNumber);
            break;
        case 'west':
            return canIMoveWest(tileNumber);
            break;
        default:
            throw (direction + " was not recognised as a direction");
    }
}

/**
 * Check if it's possible to move North from the current tile. (based on available exits)
 */
function canIMoveNorth(tileNumber) {

    switch (tileNumber) {
        case 'tile-000':
        case 'tile-002':
        case 'tile-004':
        case 'tile-006':
        case 'tile-008':
        case 'tile-010':
        case 'tile-012':
        case 'tile-014':
        case 'tile-016':
            return false;
        case 'tile-001':
        case 'tile-003':
        case 'tile-005':
        case 'tile-007':
        case 'tile-009':
        case 'tile-011':
        case 'tile-013':
        case 'tile-015':
            return true;
        default:
            throw ('Unrecognised tile ID: ' + tileNumber);
    }
}

function canIMoveSouth(tileNumber) {

    switch (tileNumber) {
        case 'tile-000':
        case 'tile-001':
        case 'tile-002':
        case 'tile-003':
        case 'tile-004':
        case 'tile-005':
        case 'tile-006':
        case 'tile-007':
        case 'tile-016':
            return false;
        case 'tile-008':
        case 'tile-009':
        case 'tile-010':
        case 'tile-011':
        case 'tile-012':
        case 'tile-013':
        case 'tile-014':
        case 'tile-015':
            return true;
        default:
            console.log('Unrecognised tile ID: ' + tileNumber);
    }
}

function canIMoveEast(tileNumber) {

    switch (tileNumber) {
        case 'tile-000':
        case 'tile-001':
        case 'tile-004':
        case 'tile-005':
        case 'tile-008':
        case 'tile-009':
        case 'tile-012':
        case 'tile-013':
        case 'tile-016':
            return false;
        case 'tile-002':
        case 'tile-003':
        case 'tile-006':
        case 'tile-007':
        case 'tile-010':
        case 'tile-011':
        case 'tile-014':
        case 'tile-015':
            return true;
        default:
            console.log('Unrecognised tile ID: ' + tileNumber);
    }
}

function canIMoveWest(tileNumber) {

    switch (tileNumber) {
        case 'tile-000':
        case 'tile-001':
        case 'tile-002':
        case 'tile-003':
        case 'tile-008':
        case 'tile-009':
        case 'tile-010':
        case 'tile-011':
        case 'tile-016':
            return false;
        case 'tile-004':
        case 'tile-005':
        case 'tile-006':
        case 'tile-007':
        case 'tile-012':
        case 'tile-013':
        case 'tile-014':
        case 'tile-015':
            return true;
        default:
            console.log('Unrecognised tile ID: ' + tileNumber);
    }
}


export {
    tryToMove,
    canIMove,
    initMap,
    newMap,
    finished,
    bump,
    move,
    getCurrentTileNumber
}