'use strict';

class Ball {
    constructor(idx, radix, color ) {
        this.idx = idx;
        this.color = color;
        this.radix = radix;
        this.x = 0;
        this.y = 0;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    move(x, y) {
        console.log(typeof(x), typeof(y));
        this.x = util.mod((this.x + x), 600);
        this.y = util.mod((this.y + y), 600);
    }
    paint(ctx) {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radix, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}

class Worm {
    constructor() {
        this.balls = [];
    }
    add(ball) {
        this.balls.push(ball);
    }
    move(x, y) {
        let tempx = this.balls[0].x;
        let tempy = this.balls[0].y;
        this.balls[0].move(x, y);

        for(let i=1; i<this.balls.length; i++) {
            let xx = this.balls[i].x;
            let yy = this.balls[i].y;
            this.balls[i].setPos(tempx, tempy);
            tempx = xx;
            tempy = yy;
        }
    }
    paint(ctx) {
        for(let ball of this.balls)
            ball.paint(ctx)
    }
}

function* generate_balls(n, radix) {
    for(let i=1; i<=n; i++) {
        let color = util.rgb(i);
        yield(new Ball(i, radix, color));
    }
    return undefined;
}
