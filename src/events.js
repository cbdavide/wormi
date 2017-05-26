'use strict';

function move(e) {

    if(e.keyCode == 37) { // Right
        this.wormi.move(-20, 0);
    } else if(e.keyCode == 38) { // Up
        this.wormi.move(0, -20);
    } else if(e.keyCode == 39) { // Left
        this.wormi.move(20, 0);
    } else if (e.keyCode == 40) { // Down
        this.wormi.move(0, 20);
    }
}
