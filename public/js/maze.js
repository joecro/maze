var backcoords = {};
backcoords['north'] = 'south';
backcoords['south'] = 'north';
backcoords['east'] = 'west';
backcoords['west'] = 'east';

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

//
var transitionEnd = whichTransitionEvent();



function resetTileTo(tileEl, direction) {
    let od = backcoords[direction];
    var oc = tileElement.getAttribute('class');

    tileElement.setAttribute('class', 'hidden');
    tileElement.setAttribute('class', oc.replace(od, direction));
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
            oldClass.replace('entering','').trim()
        );
        console.log('  just removed class-=entering');
    } else if (oldClass.includes('leaving')) {
        tileEl.setAttribute('class', 
            oldClass.replace('leaving','').trim()
        );
        console.log('  just removed class-=leaving');
    } 
}



var tiles = document.getElementsByClassName('map-tile');
for ( let tile of tiles) {
    tile.addEventListener(transitionEnd, stopMoving, false)
};


function hideBorderBump(ev) {
    let borderElement = ev.target;
    let bumpClass = borderElement.getAttribute('class');

    borderElement.setAttribute('class', bumpClass.replace('bump','').trim());
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

    target.setAttribute('class','map-tile current entering');
    console.log('started moving - map-tile current entering');
    
    current.setAttribute('class','map-tile leaving ' + backcoords[direction]);
    console.log('start moving - map-tile leaving ' + backcoords[direction]);

    recycle.setAttribute('class', 'map-tile ' + direction);
}

document.addEventListener('keydown', logKey);

function logKey(e) {
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyI':
            canIMoveNorth();
            break;
        case 'ArrowDown':
        case 'KeyM':
            canIMoveSouth();
            break;
        case 'ArrowRight':
        case 'KeyK':
            canIMoveEast();
            break;
        case 'ArrowLeft':
        case 'KeyJ':
            canIMoveWest();
            break;
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