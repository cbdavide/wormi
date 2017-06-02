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
        this.x = util.mod((this.x + x), conf.WIDTH);
        this.y = util.mod((this.y + y), conf.HEIGHT);
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
    constructor(state) {
        this.balls = [];
        this.positions = {};
        this.game_state = state;
    }
    add(ball) {
        this.balls.push(ball);
    }
    move(x, y) {
        let f = movement_middlewares;

        Promise.all(f.map(func => {return func.call(this, x, y)}))
        .then((obj) => { // The worm can move
            // console.log(obj);
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

            if(obj[2].code === 'red') { //Encontro una bola
                console.log(obj[2]);
                this.add(this.game_state.food);
                this.game_state.food = undefined;
                this.game_state.score += 20;
                console.log(this.game_state.score);
            }
        })
        .catch((err) => {
            //TODO: Handle the error
            if(err.code === 0) {
                //The direction shouldn't be changed
                this.rollback();
            } else if(err.code === 1) {
                this.game_state.state = false;
            }
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
