'use strict';

function move(e) {

    if(e.keyCode == 37) { // Left
        this.wormi.paint(this.ctx, {
            x: conf.rate_of_change,
            y: 0
        });
    } else if(e.keyCode == 38) { // Up
        this.wormi.paint(this.ctx, {
            x: 0,
            y: -conf.rate_of_change
        });
    } else if(e.keyCode == 39) { // Right
        this.wormi.paint(this.ctx, {
            x: -conf.rate_of_change,
            y: 0
        });
    } else if (e.keyCode == 40) { // Down
        this.wormi.paint(this.ctx, {
            x: 0,
            y: conf.rate_of_change
        });
    }
}
