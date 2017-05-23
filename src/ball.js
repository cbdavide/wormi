'use strict';

class Ball {
    constructor(idx, radix, color) {
        this.idx = idx;
        this.color = color;
        this.radix = radix;
    }
    paint(ctx, pos) {
        console.log(typeof(pos.y));
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radix, 0, Math.PI * 2, true);
        ctx.stroke();
        console.log(this);
    }
}

function* generate_balls(n, radix) {
    for(let i=0; i<n; i++)
        yield(new Ball(i, 'blue', radix));
    return undefined;
}
