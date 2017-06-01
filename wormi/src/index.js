'use strict';

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

conf.WIDTH = canvas.width;
conf.HEIGHT = canvas.height;

function Game(canvas){
    this.ctx = canvas.getContext('2d');
    this.generador = generate_balls(100, 10);
    this.baller = new Baller(this.generador);
    this.wormi = new Worm(this.baller);
    this.state = true;
    this.directions = {
        'N': [-1, 0],
        'W': [0, 1],
        'S': [1, 0],
        'E': [0, -1]
    };

    this.actual_direction = 'W';
    this.safe_direction = 'W';

    //Rollback mechanism
    this.wormi.rollback = rollback.bind(this);

    //Setting up the head
    this.wormi.add(this.generador.next().value);
    this.wormi.balls[0].setPos(20, 0);

    this.food = undefined;
    this.baller.dispatch()
    .then(ball => {
        this.food = ball;
        console.log(this.food);
        this.wormi.positions[[this.food.x, this.food.y]] = this.food.idx;
    })

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
    this.ctx.clearRect(0, 0, conf.WIDTH, conf.HEIGHT);
    this.wormi.paint(this.ctx);

    if(this.food !== undefined)
        this.food.paint(this.ctx);
}

let game = new Game(canvas);
window.addEventListener('keydown', move.bind(game), false);
