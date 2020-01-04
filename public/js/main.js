import { canIMove, newMap, initMap } from './maze.js';
import { welcome } from './messages.js';

var inputLocked = false;

/**
 * Onload - set up the map and show a welcome message
 */
window.onload = function () {
    window.setTimeout(welcome, 1000);
    window.addEventListener('devicemotion', whatsShakin);
};


// listen for user to hit a direction key
document.addEventListener('keydown', logKey, { passive: false });

document.addEventListener('mousedown', lock);
document.addEventListener('touchstart', lock, { passive: false });

// just prevents default swipe behaviour
document.addEventListener('mousemove', detectDrag);
document.addEventListener('touchmove', detectDrag, { passive: false });

document.addEventListener('mouseup', detectMove);
document.addEventListener('touchend', detectMove, { passive: false });


/**
 * log keyboard input and trigger appropriate move
 */
function logKey(e) {
    if (inputLocked) return 0;

    inputLocked = true;  // will be unlocked after new coords calculate

    let input = (e.code || e.key);

    switch (input) {
        case 'ArrowUp':
        case 'KeyI':
            e.preventDefault();
            canIMove('north');
            break;

        case 'ArrowDown':
        case 'KeyM':
            e.preventDefault();
            canIMove('south');
            break;

        case 'ArrowRight':
        case 'KeyK':
            e.preventDefault();
            canIMove('east');
            break;

        case 'ArrowLeft':
        case 'KeyJ':
            e.preventDefault();
            canIMove('west');
            break;

        case 'KeyR':
            // abort and restart
            initMap();
            break;

        case 'Escape':
        case 'KeyX':
            // restart  on a new 
            newMap();
            break;
    }
    
    inputLocked = false;
}

/**
 * Thank you @thebabydino https://codepen.io/thebabydino/pen/PRWqMg/
 * @param {} e 
 */
var x0 = null,
    y0 = null;


/**
 * maybe this belongs better in browser-specific..?
 * @param {*} e 
 */
function unify(e) { 
    return e.changedTouches ? e.changedTouches[0] : e; 
}

/**
 * lock the app to user input before a move starts
 * @param {*} e 
 */
function lock(e) {
    e.preventDefault();
    let unifiedEvent = unify(e);
    x0 = unifiedEvent.clientX;
    y0 = unifiedEvent.clientY;
};

/**
 * (touch devices only) prevent the default screen-drag response
 * @param {*} e 
 */
function detectDrag(e) {
    e.preventDefault();
};

/**
 * Work out which direction a swipe went in, and trigger appropriate movement
 * @param {*} e 
 */
function detectMove(e) {
    if (!inputLocked) {
        inputLocked = true;
        let unifiedEvent = unify(e);
        let dx = unifiedEvent.clientX - x0,
            sx = Math.sign(dx),
            absX = dx * sx;

        let dy = unifiedEvent.clientY - y0,
            sy = Math.sign(dy),
            absY = dy * sy;

        if (absY / absX < 1.2 && absX / absY < 1.2) {
            inputLocked = false;
            return ("no clear direction");
        } else if (absX / absY > 1) {
            // this was a horizontal move
            (sx > 0) ? canIMove('west') : canIMove('east')
        } else if (absY / absX > 1) {
            // this was a vertical move
            (sy > 0) ? canIMove('north') : canIMove('south');
        }

        x0 = null;
        inputLocked = false;
    }
};


let shakes = 0;

function whatsShakin(ev) {
    let xmotion = ev.acceleration.x;

    if (xmotion > 10) {
        shakes++;

        window.setTimeout( function() { shakes--; }, 1000 );

        if (shakes > 20) {
            // that's a biig shake
            return newMap();
        } else if (shakes > 10) {
            // just a normal shake
            return initMap();
        }
    }
}