'use strict';

let movement_middlewares = [
    check_backards,
    check_collision
];

function check_backards(balls, positions, x, y) {
    console.log(x, y);
    return new Promise((resolve, reject) => {
        let tx = balls[0].x + x;
        let ty = balls[0].y + y;

        if(balls[1] && balls[1].x == tx
            && balls[1].y == ty) {
            reject({code: 0, err: 'Wron position.'})
        }else resolve();
    });
}

function check_collision(balls, positions, x, y) {
    return new Promise((resolve, reject) => {
        let tx = balls[0].x + x;
        let ty = balls[0].y + y;

        if(positions[[tx, ty]]) {
            reject({code: 1, err: 'A collision has occurred.'})
        }else resolve();
    });
}
