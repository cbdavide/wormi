'use strict';

let movement_middlewares = [
    check_backards,
    check_collision,
    collect_ball
];

function check_backards(x, y) {
    return new Promise((resolve, reject) => {
        let tx = this.balls[0].x + x;
        let ty = this.balls[0].y + y;

        if(this.balls[1] && this.balls[1].x == tx
            && this.balls[1].y == ty) {
            reject({code: 0, err: 'Wrong position.'})
        }else resolve();
    });
}

function check_collision(x, y) {
    return new Promise((resolve, reject) => {
        let tx = this.balls[0].x + x;
        let ty = this.balls[0].y + y;

        if(this.positions[[tx, ty]] <= this.balls.length) {
            reject({code: 1, err: 'A collision has occurred.'})
        }else resolve();
    });
}

function collect_ball(x, y) {
    return new Promise((resolve, reject) => {

        let tx = this.balls[0].x + x;
        let ty = this.balls[0].y + y;

        if(this.positions[[tx, ty]] > this.balls.length) {
            console.log('Encontre una bola :v');
        }

        resolve();
    })
}
