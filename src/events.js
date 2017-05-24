'use strict';

function move(e) {

    if(e.keyCode == 37) { // Right
        this.wormi.move(-30, 0);
    } else if(e.keyCode == 38) { // Up
        this.wormi.move(0, -30);
    } else if(e.keyCode == 39) { // Left
        this.wormi.move(30, 0);
    } else if (e.keyCode == 40) { // Down
        this.wormi.move(0, 30);
    }
}
