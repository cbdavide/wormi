'use strict';

function Game(canvas){
    this.ctx = canvas.getContext('2d');
    window.addEventListener('keydown', move.bind(this), false);
    this.movement_middlewares = movement_middlewares;
    // console.log(this.movement_middlewares);
    this.generador = generate_balls(100, 10);
    this.wormi = new Worm();
    this.state = true;

    this.wormi.add(this.generador.next().value);
    this.wormi.balls[0].setPos(10, 10);

    for(let i=0; i<20; i++) {
        this.wormi.add(this.generador.next().value);
    }

    this.interval = setInterval(loop.bind(this), 30);
};

function loop() {
    if(this.state === false) {
        console.log('GAME OVER!!!');
        clearInterval(this.interval);
        return;
    }
    this.ctx.clearRect(0, 0, 600, 600);
    this.wormi.paint(this.ctx);
}

new Game(document.getElementById('canvas'));
