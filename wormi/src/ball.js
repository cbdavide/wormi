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
        this.positions = {};
    }
    add(ball) {
        this.balls.push(ball);
    }
    move(x, y) {
        let f = movement_middlewares;

        Promise.all(f.map(func => {return func.call(this, x, y)}))
        .then(() => { // The worm can move
            let tx = this.balls[0].x;
            let ty = this.balls[0].y;
            this.balls[0].move(x, y);
            for(let i=1; i<this.balls.length; i++) {
                let xx = this.balls[i].x;
                let yy = this.balls[i].y;
                this.positions[[xx, yy]] = undefined;
                this.positions[[tx, ty]] = this.balls[i].idx;
                this.balls[i].setPos(tx, ty);
                tx = xx; ty = yy;
            }
        })
        .catch((err) => {
            //TODO: Handle the error
            console.log(err);
        })
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
