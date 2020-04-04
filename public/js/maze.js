import transitionEnd from './browser-specific.js';
import { map as defaultMap, generateRandomMap } from './map.js';
import { showFinishedMessage, updateAriaMessages } from './messages.js';


var mazeLocked = false;
var tehMap = defaultMap; // the MAP

let mapwidth = 6,
    mapheight = 6;

let steps = [];

/**
 * any setup that needs doing before user goes running round in the map
 */
function newMap() {
    tehMap = generateRandomMap(mapwidth,mapheight);
    
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
    let tileNumber = 0;
    let tiles = document.getElementsByClassName('map-tile');

    for (let row = 0; row < mapheight; row++) {
        for (let col = 0; col < mapwidth; col++) {
            thisClass = tehMap[row][col];
            if (!currentSet && Math.random() < 1/remaining--) {
                tiles[tileNumber].className += " current";
                currentSet = true;
            }
            tiles[tileNumber++].firstElementChild.setAttribute('class', thisClass);
        }
    }

    move('current');

    let stepLength = 1/mapwidth;
    let firstStep = stepLength / 2;
    let nextStep = firstStep;

    // set up 'steps' - these are used in CSS to move the pointr around the map
    while (nextStep < 1) {
        // add the next step to the array
        steps.push(nextStep);

        nextStep += stepLength;
    }
    
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
    border.addEventListener(transitionEnd, hideBorderBump, false);

    let currentClass = border.getAttribute('class');
    border.setAttribute('class', currentClass + ' bump');

    try {
        // gap of 50ms is just noticeable
        window.navigator.vibrate([100, 50, 60]);
    } catch (error) {
        console.log("Edge doesn't ignore vibrate");
    }
}

/**
 * Clean up 'bump' border 
 * @param {Event} ev 
 */
function hideBorderBump(ev) {
    let borderElement = ev.target;
    let bumpClass = borderElement.getAttribute('class');

    borderElement.setAttribute('class', bumpClass.replace('bump', '').trim());

    mazeLocked = false;
}


/**
 * Move the pointer along the map
 * @param {} direction 
 */
function move(direction) {
    if (mazeLocked) {
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
    document.querySelector(".map-tile[data-x-coord='" + newX + "'][data-y-coord='" + newY + "']").className += " current";
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
    hideBorderBump,
    bump,
    move,
    getCurrentTileNumber
}