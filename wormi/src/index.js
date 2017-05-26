'use strict';

function Game(canvas){
    this.ctx = canvas.getContext('2d');
    window.addEventListener('keydown', move.bind(this), false);
    this.generador = generate_balls(100, 10);
    this.wormi = new Worm();
    this.state = true;

    this.wormi.add(this.generador.next().value);
    this.wormi.balls[0].setPos(10, 10);

    for(let i=0; i<50; i++) {
        this.wormi.add(this.generador.next().value);
    }

    this.test = this.generador.next().value;
    this.test.setPos(70, 70);
    this.wormi.positions[[70, 70]] = this.test.idx;

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
    this.test.paint(this.ctx);

}

new Game(document.getElementById('canvas'));
