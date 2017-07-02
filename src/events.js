'use strict';

function move(e) {
    this.safe_direction = this.actual_direction;
    if(e.keyCode == 37) { // Right
        this.actual_direction = 'E';
    } else if(e.keyCode == 38) { // Up
        this.actual_direction = 'N';
    } else if(e.keyCode == 39) { // Left
        this.actual_direction = 'W';
    } else if (e.keyCode == 40) { // Down
        this.actual_direction = 'S';
    }
}
