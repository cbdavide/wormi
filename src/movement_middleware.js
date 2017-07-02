'use strict';

let movement_middlewares = [
    check_backards,
    check_collision,
    collect_ball
];

function check_backards(x, y) {
    return new Promise((resolve, reject) => {
        let tx = util.mod(this.balls[0].x + x, conf.WIDTH);
        let ty = util.mod(this.balls[0].y + y, conf.HEIGHT);

        if(this.balls[1] && this.balls[1].x == tx
            && this.balls[1].y == ty) {
            reject({code: 0, msg: 'Wrong position.'})
        }else resolve();
    });
}

function check_collision(x, y) {
    return new Promise((resolve, reject) => {
        let tx = util.mod(this.balls[0].x + x, conf.WIDTH);
        let ty = util.mod(this.balls[0].y + y, conf.HEIGHT);
        if(this.positions[[tx, ty]] !== undefined) {
            reject({code: 1, msg: 'A collision has occurred.'})
        }else resolve();
    });
}

function collect_ball(x, y) {
    return new Promise((resolve, reject) => {
        let obj = {};
        let tx, ty;

        if(this.game_state.food === undefined) {
            resolve(obj);
        }

        tx = util.mod(this.balls[0].x + x, conf.WIDTH);
        ty = util.mod(this.balls[0].y + y, conf.HEIGHT);

        if(Math.abs(tx - this.game_state.food.x) < 20
        && Math.abs(ty - this.game_state.food.y) < 20) {
            obj = {code: 'red', msg: 'Encontre una bola :v'};
        }

        resolve(obj);
    })
}
