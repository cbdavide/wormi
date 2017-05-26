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
    move(middlewares, x, y) {

        let f = movement_middlewares;
        Promise.all([
            f[0](this.balls, this.positions, x ,y),
            f[1](this.balls, this.positions, x ,y),
        ])
        .then(() => {
            console.log('Buena perro');
            //Move motherfucker, move
            let tx = this.balls[0].x;
            let ty = this.balls[0].y;
            this.balls[0].move(x, y);
            for(let i=1; i<this.balls.length; i++) {
                let xx = this.balls[i].x;
                let yy = this.balls[i].y;
                this.positions[[x, y]] = undefined;
                this.positions[[tx, ty]] = true;
                this.balls[i].setPos(tx, ty);
                tx = xx; ty = yy;
            }
        })
        .catch((err) => {
            console.log('What happened ?')
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
