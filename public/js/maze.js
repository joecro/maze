import transitionEnd from './browser-specific.js';
import { map, generateRandomMap } from './map.js';
import { showFinishedMessage, updateAriaMessages } from './messages.js';

/**
 * hey buddy, watch my six.
 */
let backcoords = {};
    backcoords['north'] = 'south';
    backcoords['south'] = 'north';
    backcoords['east'] = 'west';
    backcoords['west'] = 'east';

var mazeLocked = false;
var tehMap = map; // the MAP

let mapwidth = 5,
    mapheight = 5;

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
    
    let startTilePath = 'tile-016';
    let startTile = document.querySelector('.south.map-tile');

    let startX = 0, startY = 0;

    while (startTilePath == 'tile-016') {  // don't want to start at the finish :/
        startX = Math.floor(mapwidth * Math.random());
        startY = Math.floor(mapheight * Math.random());

        startTilePath = tehMap[startX][startY];
    }
    
    // startTile is the parent div - need to set class on the child svg
    startTile.children[0].setAttribute('class', startTilePath);
    startTile.setAttribute('data-x-coord', startX);
    startTile.setAttribute('data-y-coord', startY);

    move('south');

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
 * Remove 'moving' class from a tile element
 * @param ev 
 */
function stopMoving(ev) {
    let tileEl = ev.target;
    let oldClass = tileEl.getAttribute('class');

    console.log(' stopMoving: ' + oldClass);

    if (oldClass.includes('entering')) {
        tileEl.setAttribute('class',
            oldClass.replace('entering', '').trim()
        );
        //console.log('  just removed class-=entering');

        let tileID = 'tile-000';
        tileID = tileEl.children[0].getAttribute('class'); // ASSUMPTION: tile DIV only has one child element
        updateAriaMessages(tileID);

        // wait until the new tile is in place before calculating new coords & tiles
        recalcCoords();
        mazeLocked = false;
    } else if (oldClass.includes('leaving')) {
        tileEl.setAttribute('class',
            oldClass.replace('leaving', '').trim()
        );
        //console.log('  just removed class-=leaving');
    }
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
 * Move the current tile out of view and bring the next one in
 * @param {} direction 
 */
function move(direction) {
    if (!mazeLocked) {
        mazeLocked = true;

        let targets = document.getElementsByClassName(direction);
        let currents = document.getElementsByClassName('current');
        let recycles = document.getElementsByClassName(backcoords[direction]);

        if (targets.length != 1 || currents.length != 1 || recycles.length != 1) {
            console.log('something went wrong in move. Either too many or not enough tiles');
            return 0;
        };

        if (targets[0].getAttribute('class').includes('entering')) {
            console.log('Target tile was still moving');
            return 0;
        }

        if (currents[0].getAttribute('class').includes('leaving')) {
            console.log('Current tile was still moving');
            return 0;
        }

        let current = currents[0];
        let target = targets[0];
        let recycle = recycles[0];

        target.addEventListener(transitionEnd, stopMoving, false);
        current.addEventListener(transitionEnd, stopMoving, false);

        // move the new tile into position
        target.setAttribute('class', 'map-tile current entering');
        console.log('started moving - map-tile current entering');

        // move the old tile out - it will stay in that direction
        current.setAttribute('class', 'map-tile leaving ' + backcoords[direction]);
        console.log('start moving - map-tile leaving ' + backcoords[direction]);

        // grab a tile that just went out of reach and recycle it
        recycle.setAttribute('class', 'map-tile ' + direction);
    }
}

/**
 * After moving, reset the surrounding tiles to the right paths
 */
function recalcCoords() {
    let currents = document.getElementsByClassName('map-tile current');
    let norths = document.getElementsByClassName('map-tile north');
    let souths = document.getElementsByClassName('map-tile south');
    let easts = document.getElementsByClassName('map-tile east');
    let wests = document.getElementsByClassName('map-tile west');

    if (currents.length != 1 || norths.length != 1 || souths.length != 1 || wests.length != 1 || easts.length != 1) {
        console.log('something went wrong in recalcCoords. Either too many or not enough tiles');
        return 0;
    };

    let current = currents[0];
    let north = norths[0], northSVG = north.children[0];
    let south = souths[0], southSVG = south.children[0];
    let east = easts[0], eastSVG = east.children[0];
    let west = wests[0], westSVG = west.children[0];

    // get current coords from current tile
    let currentX = current.getAttribute('data-x-coord');
    let currentY = current.getAttribute('data-y-coord');

    console.log('currrent coords are: X = ' + currentX + ', Y = ' + currentY);

    north.setAttribute('data-x-coord', currentX);
    north.setAttribute('data-y-coord', currentY - 1);

    try {
        northSVG.setAttribute('class', tehMap[currentX][currentY - 1]);
    } catch (error) {
        console.log('error setting northSVG class to map[' + currentX + '][' + currentY - 1 + ']')
        northSVG.setAttribute('class', 'tile-000');
    }

    south.setAttribute('data-x-coord', currentX);
    south.setAttribute('data-y-coord', 1 * currentY + 1);

    try {
        southSVG.setAttribute('class', tehMap[currentX][1 * currentY + 1]);
    } catch (error) {
        console.log('error setting southSVG class to map[' + currentX + '][' + (1 * currentY + 1) + ']')
        southSVG.setAttribute('class', 'tile-000');
    }

    east.setAttribute('data-x-coord', 1 * currentX + 1);
    east.setAttribute('data-y-coord', currentY);

    try {
        eastSVG.setAttribute('class', tehMap[1 * currentX + 1][currentY]);
    } catch (error) {
        console.log('error setting eastSVG class to map[' + (1 * currentX + 1) + '][' + currentY + ']')
        eastSVG.setAttribute('class', 'tile-000');
    }

    west.setAttribute('data-x-coord', currentX - 1);
    west.setAttribute('data-y-coord', currentY);

    try {
        westSVG.setAttribute('class', tehMap[currentX - 1][currentY]);
    } catch (error) {
        console.log('error setting westSVG class to map[' + (currentX - 1) + '][' + currentY + ']')
        westSVG.setAttribute('class', 'tile-000');
    }

    if (map[currentX][currentY] == 'tile-016') {  //then you finished. Go you!
        finished();
    }
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
    stopMoving,
    hideBorderBump,
    bump,
    move,
    recalcCoords,
    getCurrentTileNumber
}