import { initMap, newMap, canIMove, tryToMove } from './maze.js';


let updateIndex = 0;

/**
 * Display welcome message
 */
function welcome() {
    initMap();

    try {
        // gap of 50ms is just noticeable
        window.navigator.vibrate([100, 80, 80, 150]);
    } catch (error) {
        console.log("Edge doesn't ignore vibrate");
    }

    let messageHolder = document.querySelector('#message-holder');
    let gotit = document.querySelector('.welcome.message button');

    messageHolder.setAttribute('class', 'shown');
    document.querySelector('.welcome.message').setAttribute('class', 'welcome message shown');

    gotit.addEventListener('click', function(){
        window.setTimeout(showStuckMessage, 15000);

        let pointers = document.querySelectorAll('.pointer');

        pointers.forEach(pointer => (pointer.style['display'] = 'block'));
        hideMessages();
    });
    gotit.addEventListener('touchstart', function(){
        window.setTimeout(showStuckMessage, 15000);
        
        let pointers = document.querySelectorAll('.pointer');

        pointers.forEach(pointer => (pointer.style['display'] = 'block'));
        hideMessages();
    });

}


/**
 * 
 */
function showStuckMessage() {
    
    let messageHolder = document.querySelector('#message-holder');
    let gotit = document.querySelector('.reset.message button');

    messageHolder.setAttribute('class', 'shown');
    document.querySelector('.reset.message').setAttribute('class', 'reset message shown');

    gotit.addEventListener('click', hideMessages);
    gotit.addEventListener('touchstart', hideMessages);
}


function showResettingMessage() {
    
    let messageHolder = document.querySelector('#message-holder');

    messageHolder.setAttribute('class', 'shown');
    document.querySelector('.resetting.message').setAttribute('class', 'resetting message shown');

    window.setTimeout(hideMessages, 600);
}


function showNewMapMessage() {
    
    let messageHolder = document.querySelector('#message-holder');

    messageHolder.setAttribute('class', 'shown');
    document.querySelector('.newmap.message').setAttribute('class', 'newmap message shown');

    window.setTimeout(hideMessages, 600);
}

/**
 * 
 */
function showFinishedMessage() {
    let messageHolder = document.querySelector('#message-holder');
    let resetButton = document.querySelector('.finished.message button.reset');
    let newmapButton = document.querySelector('.finished.message button.newmap');

    messageHolder.setAttribute('class', 'shown');
    document.querySelector('.finished.message').setAttribute('class', 'finished message shown');

    resetButton.addEventListener('click', initMap);
    resetButton.addEventListener('click', hideMessages);
    resetButton.addEventListener('touchstart', initMap);
    resetButton.addEventListener('touchstart', hideMessages);

    newmapButton.addEventListener('click', newMap);
    newmapButton.addEventListener('click', hideMessages);
    newmapButton.addEventListener('touchstart', newMap);
    newmapButton.addEventListener('touchstart', hideMessages);
}

/**
* hide message-holder and all messages
*/
function hideMessages() {
    document.querySelector('#message-holder').setAttribute('class', 'hidden');
    document.querySelector('.welcome.message').setAttribute('class', 'welcome message hidden');
    document.querySelector('.finished.message').setAttribute('class', 'finished message hidden');
    document.querySelector('.reset.message').setAttribute('class', 'reset message hidden');
    document.querySelector('.resetting.message').setAttribute('class', 'resetting message hidden');
    document.querySelector('.newmap.message').setAttribute('class', 'newmap message hidden');
}


/**
 * w
 */
function updateAriaMessages () {
    // PROBLEM:  NVDA reads the whole alert section for each sub-element that has been changed
    let ariaMsg = document.querySelector('.direction.direction-north');
    
    canIMove('north') ? 
        ariaMsg.innerHTML = 'You can move North' : 
        ariaMsg.innerHTML = 'You can not move North';
    
    ariaMsg.addEventListener('click',function(){ tryToMove('north'); });
    
    ariaMsg = document.querySelector('.direction.direction-south');
    
    canIMove('south') ? 
        ariaMsg.innerHTML = 'You can move South' : 
        ariaMsg.innerHTML = 'You can not move South';
    
    ariaMsg.addEventListener('click',function(){ tryToMove('south'); });
    
    ariaMsg = document.querySelector('.direction.direction-east');
    
    canIMove('east') ? 
        ariaMsg.innerHTML = 'You can move East' : 
        ariaMsg.innerHTML = 'You can not move East';
    
    ariaMsg.addEventListener('click',function(){ tryToMove('east'); });
    
    ariaMsg = document.querySelector('.direction.direction-west');
    
    canIMove('west') ? 
        ariaMsg.innerHTML = 'You can move West' : 
        ariaMsg.innerHTML = 'You can not move West';
    
    ariaMsg.addEventListener('click',function(){ tryToMove('west'); });
    
}


export { welcome, showFinishedMessage, showResettingMessage, showNewMapMessage, hideMessages, updateAriaMessages };