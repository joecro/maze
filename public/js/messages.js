import { initMap } from './maze.js';
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
}


function showFinishedMessage() {
    let messageHolder = document.querySelector('#message-holder');
    let resetButton = document.querySelector('.finished.message button');

    messageHolder.setAttribute('class', 'shown');
    document.querySelector('.finished.message').setAttribute('class', 'finished message shown');

    resetButton.addEventListener('click', initMap);
    resetButton.addEventListener('click', hideMessages);
    resetButton.addEventListener('touchstart', initMap);
    resetButton.addEventListener('touchstart', hideMessages);
}

/**
* hide message-holder and all messages
*/
function hideMessages() {
    document.querySelector('#message-holder').setAttribute('class', 'hidden');
    document.querySelector('.welcome.message').setAttribute('class', 'welcome message hidden');
    document.querySelector('.finished.message').setAttribute('class', 'finished message hidden');
}

export { welcome, showFinishedMessage, hideMessages };