import { initMap, newMap, canIMove } from './maze.js';
/**
 * Display welcome message
 */
function welcome() {

    let messageHolder = document.querySelector('#message-holder');
    let gotit = document.querySelector('.welcome.message button');

    messageHolder.setAttribute('class', 'shown');
    document.querySelector('.welcome.message').setAttribute('class', 'welcome message shown');

    gotit.addEventListener('click', initMap);
    gotit.addEventListener('touchstart', initMap);
    gotit.addEventListener('click', hideMessages);
    gotit.addEventListener('touchstart', hideMessages);

    window.setTimeout(showStuckMessage, 15000);
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
 * 
 */
function updateAriaMessages () {
    
    let ariaMsg = document.querySelector('#not-north');
    
    canIMove('north') ? 
        ariaMsg.innerHTML = 'can' : 
        ariaMsg.innerHTML = 'can not' 
    
    ariaMsg = document.querySelector('#not-south');
    
    canIMove('south') ? 
        ariaMsg.innerHTML = 'can' : 
        ariaMsg.innerHTML = 'can not' 
    
    ariaMsg = document.querySelector('#not-east');
    
    canIMove('east') ? 
        ariaMsg.innerHTML = 'can' : 
        ariaMsg.innerHTML = 'can not' 
    
    ariaMsg = document.querySelector('#not-west');
    
    canIMove('west') ? 
        ariaMsg.innerHTML = 'can' : 
        ariaMsg.innerHTML = 'can not' ;
    
}


export { welcome, showFinishedMessage, showResettingMessage, showNewMapMessage, hideMessages, updateAriaMessages };