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

        var newhome;
        if (oldClass.includes('north')) newhome = 'south';
        if (oldClass.includes('south')) newhome = 'north';
        if (oldClass.includes('east')) newhome = 'west';
        if (oldClass.includes('west')) newhome = 'east';
        
        tileEl.setAttribute('class','map-tile ' + newhome);

        return;
    } 
}



var tiles = document.getElementsByClassName('map-tile');
for ( let tile of tiles) {
    tile.addEventListener(transitionEnd, stopMoving, false)
};

/**
 * Move the current tile out of view and bring the next one in
 * @param {} direction 
 */
function move(direction) {
    targets = document.getElementsByClassName(direction);
    currents = document.getElementsByClassName('current');

    if (targets.length != 1 || currents.length != 1) {
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
    target = targets[0];//.cloneNode(true);
    //document.body.appendChild(target);
    
    target.addEventListener(transitionEnd, stopMoving, false);
    current.addEventListener(transitionEnd, stopMoving, false);

    target.setAttribute('class','map-tile current entering');
    console.log('started moving - map-tile current entering');
    current.setAttribute('class','map-tile leaving ' + backcoords[direction]);
    console.log('start moving - map-tile leaving ' + backcoords[direction]);
}

document.addEventListener('keydown', logKey);

function logKey(e) {
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyI':
            move('north');
            break;
        case 'ArrowDown':
        case 'KeyM':
            move('south');
            break;
        case 'ArrowRight':
        case 'KeyK':
            move('east');
            break;
        case 'ArrowLeft':
        case 'KeyJ':
            move('west');
            break;
  }
}