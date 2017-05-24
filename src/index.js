'use strict';

function Game(canvas){
    console.log(window);
    this.ctx = canvas.getContext('2d');
    window.addEventListener('keydown', move.bind(this), false);

    this.wormi = new Worm();
    let b = new Ball(0, 25, 'blue');
    let c = new Ball(1, 25, 'green');
    this.wormi.add(b);
    this.wormi.paint(this.ctx, {x: 25, y: 25});
    // ctx.clearRect(0, 0, 600, 60);
    this.wormi.add(c);
    // wormi.paint(ctx, {x: 50, y: 0});

    // let c = new Ball(1, 35, 'blue');
    // c.paint(ctx, {x: 75, y: 75});
    // let d = new Ball(2, 25, 'blue');
    // d.paint(ctx, {x: 75, y: 75});

};

new Game(document.getElementById('canvas'));
