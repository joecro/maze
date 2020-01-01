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
let transitionEnd = whichTransitionEvent();

export default transitionEnd;