'use strict';

class Ball {
    constructor(idx, radix, color ) {
        this.idx = idx;
        this.color = color;
        this.radix = radix;
        this.x = 0;
        this.y = 0;
    }
    paint(ctx, pos) {
        this.x = pos.x;
        this.y = pos.y;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radix, 0, Math.PI * 2, true);
        ctx.stroke();
    }
}

class Worm {
    constructor() {
        this.balls = [];
    }
    add(ball) {
        this.balls.push(ball);
    }
    paint(ctx, pos) {
        let tempx = this.balls[0].x;
        let tempy = this.balls[0].y;

        this.balls[0].paint(ctx, {
            x: tempx + pos.x,
            y: tempx + pos.y
        });

        for(let i=1; i<this.balls.length; i++) {
            this.balls[0].paint(ctx, {x: tempx, y: tempx});
            tempx = this.balls[i].x;
            tempy = this.balls[i].y;
        }
    }
}

function* generate_balls(n, radix) {
    for(let i=0; i<n; i++)
        yield(new Ball(i, 'blue', radix));
    return undefined;
}
