var backcoords = {};
    backcoords['north'] = 'south';
    backcoords['south'] = 'north';
    backcoords['east'] = 'west';
    backcoords['west'] = 'east';

let map = {
    0: {0:'tile-010',1:'tile-003',2:'tile-008',3:'tile-003',4:'tile-010',5:'tile-003'},
    1: {0:'tile-012',1:'tile-013',2:'tile-011',3:'tile-013',4:'tile-005',5:'tile-006'},
    2: {0:'tile-002',1:'tile-010',2:'tile-005',3:'tile-010',4:'tile-003',5:'tile-006'},
    3: {0:'tile-014',1:'tile-015',2:'tile-009',3:'tile-013',4:'tile-013',5:'tile-007'},
    4: {0:'tile-006',1:'tile-012',2:'tile-003',3:'tile-010',4:'tile-016',5:'tile-006'},
    5: {0:'tile-012',1:'tile-009',2:'tile-005',3:'tile-012',4:'tile-009',5:'tile-005'},
}

window.onload = function() {
    initMap();
    welcome();
};

/**
 * any setup that needs doing before user goes running round in the map
 */
function initMap() {
    let startTilePath = 'tile-016';
    let startTile = document.querySelector('.current.map-tile');

    let startX = 0, startY = 0;

    while (startTilePath == 'tile-016') {  // don't want to start at the finish :/
        startX = Math.floor(6*Math.random());
        startY = Math.floor(6*Math.random());

        startTilePath = map[startX][startY];
    }

    // startTile is the parent div - need to set class on the child svg
    startTile.children[0].setAttribute('class', startTilePath);
    startTile.setAttribute('data-x-coord', startX);
    startTile.setAttribute('data-y-coord', startY);
    
    recalcCoords();
}


function welcome() {
    console.log('TODO - welcome')
}

/**
 * Thank you SO https://stackoverflow.com/questions/15617970/wait-for-css-transition#15618028
 */
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

// browser-specific transitionEnd event
var transitionEnd = whichTransitionEvent();



/**
 * Remove 'moving' class from a tile element
 * @param ev 
 */
function stopMoving(ev) {
    let tileEl = ev.target;
    let oldClass = tileEl.getAttribute('class');

    //console.log(' stopMoving: ' + oldClass);

    if (oldClass.includes('entering')) { 
        tileEl.setAttribute('class', 
            oldClass.replace('entering','').trim()
        );
        //console.log('  just removed class-=entering');

        // wait until the new tile is in place before calculating new coords & tiles
        recalcCoords();
        locked = false;
    } else if (oldClass.includes('leaving')) {
        tileEl.setAttribute('class', 
            oldClass.replace('leaving','').trim()
        );
        //console.log('  just removed class-=leaving');
    } 
}


/**
 * Clean up 'bump' border 
 * @param {Event} ev 
 */
function hideBorderBump(ev) {
    let borderElement = ev.target;
    let bumpClass = borderElement.getAttribute('class');

    borderElement.setAttribute('class', bumpClass.replace('bump','').trim());
    
    locked = false;
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

    border = borders[0];
    border.addEventListener(transitionEnd, hideBorderBump, false);

    let currentClass = border.getAttribute('class');
    border.setAttribute('class', currentClass + ' bump');
    
    // gap of 50ms is just noticeable
    window.navigator.vibrate([100,50,60]);
}


/**
 * Move the current tile out of view and bring the next one in
 * @param {} direction 
 */
function move(direction) {
    targets = document.getElementsByClassName(direction);
    currents = document.getElementsByClassName('current');
    recycles = document.getElementsByClassName(backcoords[direction]);

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

    current = currents[0];
    target = targets[0];
    recycle = recycles[0];
    
    target.addEventListener(transitionEnd, stopMoving, false);
    current.addEventListener(transitionEnd, stopMoving, false);

    // move the new tile into position
    target.setAttribute('class','map-tile current entering');
    console.log('started moving - map-tile current entering');
    
    // move the old tile out - it will stay in that direction
    current.setAttribute('class','map-tile leaving ' + backcoords[direction]);
    console.log('start moving - map-tile leaving ' + backcoords[direction]);

    // grab a tile that just went out of reach and recycle it
    recycle.setAttribute('class', 'map-tile ' + direction);
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
    
    if (currents.length != 1 || norths.length != 1 || souths.length != 1 || wests.length != 1 || easts.length != 1 ) {
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
        northSVG.setAttribute('class', map[currentX][currentY - 1]);
    } catch (error) {
        console.log('error setting northSVG class to map[' + currentX + '][' + currentY-1 + ']')
        northSVG.setAttribute('class', 'tile-000');
    }

    south.setAttribute('data-x-coord', currentX);
    south.setAttribute('data-y-coord', 1*currentY + 1);

    try {
        southSVG.setAttribute('class', map[currentX][1*currentY + 1]);
    } catch (error) {
        console.log('error setting southSVG class to map[' + currentX + '][' + (1*currentY + 1) +']')
        southSVG.setAttribute('class', 'tile-000');
    }

    east.setAttribute('data-x-coord', 1*currentX + 1);
    east.setAttribute('data-y-coord', currentY);

    try {
        eastSVG.setAttribute('class', map[1*currentX + 1][currentY]);
    } catch (error) {
        console.log('error setting eastSVG class to map[' + (1*currentX + 1) + '][' + currentY +']')
        eastSVG.setAttribute('class', 'tile-000');
    }

    west.setAttribute('data-x-coord', currentX - 1);
    west.setAttribute('data-y-coord', currentY);

    try {
        westSVG.setAttribute('class', map[currentX - 1][currentY]);
    } catch (error) {
        console.log('error setting westSVG class to map[' + (currentX - 1) + '][' + currentY +']')
        westSVG.setAttribute('class', 'tile-000');
    }
}

// listen for user to hit a direction key
document.addEventListener('keydown', logKey, {passive:false});

document.addEventListener('mousedown', lock);
document.addEventListener('touchstart', lock, {passive:false});

// just prevents default swipe behaviour
document.addEventListener('mousemove', detectDrag);
document.addEventListener('touchmove', detectDrag, {passive:false});

document.addEventListener('mouseup', detectMove);
document.addEventListener('touchend', detectMove, {passive:false});


// try to move in the indicated direction
function logKey(e) {
    if (locked) return 0;

	locked = true;  // will be unlocked after new coords calculate
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyI':
            e.preventDefault();
            canIMoveNorth();
            break;
        case 'ArrowDown':
        case 'KeyM':
            e.preventDefault();
            canIMoveSouth();
            break;
        case 'ArrowRight':
        case 'KeyK':
            e.preventDefault();
            canIMoveEast();
            break;
        case 'ArrowLeft':
        case 'KeyJ':
            e.preventDefault();
            canIMoveWest();
            break;
    }
}

/**
 * Thank you @thebabydino https://codepen.io/thebabydino/pen/PRWqMg/
 * @param {} e 
 */
var x0 = null, locked = false;

function unify(e) {	return e.changedTouches ? e.changedTouches[0] : e };

// get the starting coords and lock the screen
function lock(e) {
    e.preventDefault();
    let unifiedEvent = unify(e);
    x0 = unifiedEvent.clientX;
    y0 = unifiedEvent.clientY;
};

function detectDrag(e) {
  e.preventDefault();
};

// work out which way the swipe went and move that way
function detectMove(e) {
  if(!locked) {
    locked = true;
    let unifiedEvent = unify(e);
    let dx = unifiedEvent.clientX - x0, 
        sx = Math.sign(dx),
        absX = dx*sx;

    let dy = unifiedEvent.clientY - y0, 
        sy = Math.sign(dy),
        absY = dy*sy;
    
    if (absY/absX < 1.2 && absX/absY < 1.2) {
        locked = false;
        return("no clear direction");
    } else if (absX/absY > 1) {
        // this was a horizontal move
        return (sx > 0) ? canIMoveWest() : canIMoveEast()
    } else if (absY/absX > 1) {
        // this was a vertical move
        return (sy > 0) ? canIMoveNorth() : canIMoveSouth();
    }
    
    x0 = null;
    locked = false;
  }
};


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

/**
 * Check if it's possible to move North from the current tile. (based on available exits)
 */
function canIMoveNorth() {

    let tileNumber = getCurrentTileNumber();

    switch (tileNumber) {
        case 'tile-000':
        case 'tile-002':
        case 'tile-004':
        case 'tile-006':
        case 'tile-008':
        case 'tile-010':
        case 'tile-012':
        case 'tile-014':
            bump('north');
            break;
        case 'tile-001':
        case 'tile-003':
        case 'tile-005':
        case 'tile-007':
        case 'tile-009':
        case 'tile-011':
        case 'tile-013':
        case 'tile-015':
            move('north');
            break;
    }
} 

function canIMoveSouth() {
    let tileNumber = getCurrentTileNumber();

    switch (tileNumber) {
        case 'tile-000':
        case 'tile-001':
        case 'tile-002':
        case 'tile-003':
        case 'tile-004':
        case 'tile-005':
        case 'tile-006':
        case 'tile-007':
            bump('south');
            break;
        case 'tile-008':
        case 'tile-009':
        case 'tile-010':
        case 'tile-011':
        case 'tile-012':
        case 'tile-013':
        case 'tile-014':
        case 'tile-015':
            move('south');
            break;
    }
} 

function canIMoveEast() {

    let tileNumber = getCurrentTileNumber();

    switch (tileNumber) {
        case 'tile-000':
        case 'tile-001':
        case 'tile-004':
        case 'tile-005':
        case 'tile-008':
        case 'tile-009':
        case 'tile-012':
        case 'tile-013':
            bump('east');
            break;
        case 'tile-002':
        case 'tile-003':
        case 'tile-006':
        case 'tile-007':
        case 'tile-010':
        case 'tile-011':
        case 'tile-014':
        case 'tile-015':
            move('east');
            break;
    }
}

function canIMoveWest() {

    let tileNumber = getCurrentTileNumber();

    switch (tileNumber) {
        case 'tile-000':
        case 'tile-001':
        case 'tile-002':
        case 'tile-003':
        case 'tile-008':
        case 'tile-009':
        case 'tile-010':
        case 'tile-011':
            bump('west');
            break;
        case 'tile-004':
        case 'tile-005':
        case 'tile-006':
        case 'tile-007':
        case 'tile-012':
        case 'tile-013':
        case 'tile-014':
        case 'tile-015':
            move('west');
            break;
    }
} 