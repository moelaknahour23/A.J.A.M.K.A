
function bubble_setup(){
    console.log('Setting up bubbles ... ');
    var mainBubble = getClass('main-bubble')[0];
    var bubbleContainer = getClass('bubble-container')[0];
    var bubbles = getClass('expand-bubble');
    var bubble;
    for(var i = 0; i < bubbles.length; i++){
        bubble = bubbles[i];
        bubble.addEventListener('mouseover', function(){
            switch(this.dataset.position){
                case "top-left": setOffset(mainBubble, "45%", "45%"); break;
                case "top-right": setOffset(mainBubble, "45%", "55%"); break;
                case "bottom-left": setOffset(mainBubble, "55%", "45%"); break;
                case "bottom-right": setOffset(mainBubble, "55%", "55%"); break;
            }
            var style = getComputedStyle(this);
            mainBubble.style.borderColor = style.borderColor;
            mainBubble.style.color = style.borderColor;
            //mainBubble.getElementsByClassName('main-bubble-slug')[0].textContent = this.getElementsByClassName('bubble-slug')[0].textContent;
            //mainBubble.getElementsByClassName('bubble-title')[0].style.display = 'none';
        });
        bubble.addEventListener('mouseout', function(){
            setOffset(mainBubble, "50%", "50%");
            mainBubble.style.borderColor = 'transparent';
            mainBubble.style.color = 'white';
            //mainBubble.getElementsByClassName('bubble-title')[0].style.display = 'inline-block';
            //mainBubble.getElementsByClassName('main-bubble-slug')[0].textContent = "Share Together";
        });
    }
}

function setOffset(elm, top, left){
    elm.style.top = top;
    elm.style.left = left;
    return elm;
}

//DOM Helper methods
function getClass(className){
    return document.getElementsByClassName(className);
}