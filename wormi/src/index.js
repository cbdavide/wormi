'use strict';

function Game(canvas){
    this.ctx = canvas.getContext('2d');
    window.addEventListener('keydown', move.bind(this), false);
    this.generador = generate_balls(100, 10);
    this.wormi = new Worm();
    this.state = true;
    this.directions = {
        'N': [-1, 0],
        'W': [0, 1],
        'S': [1, 0],
        'E': [0, -1]
    };

    this.actual_direction = 'W';
    this.safe_direction = 'W';
    this.wormi.rollback = rollback.bind(this);
    this.wormi.add(this.generador.next().value);
    this.wormi.balls[0].setPos(10, 10);

    for(let i=0; i<15; i++) {
        this.wormi.add(this.generador.next().value);
    }

    this.test = this.generador.next().value;
    this.test.setPos(70, 70);
    this.wormi.positions[[70, 70]] = this.test.idx;

    this.interval = setInterval(loop.bind(this), 60);
};

function rollback() {
    console.log('ROLLBACK!!!')
    console.log('ESTO NO ES UN SIMULACRO');
    this.actual_direction = this.safe_direction;
}

function loop() {
    if(this.state === false) {
        console.log('GAME OVER!!!');
        clearInterval(this.interval);
        return;
    }
    let dir = this.directions[this.actual_direction];
    this.wormi.move(dir[1] * 20, dir[0] * 20);
    this.ctx.clearRect(0, 0, 600, 600);
    this.wormi.paint(this.ctx);
    this.test.paint(this.ctx);

}

new Game(document.getElementById('canvas'));
