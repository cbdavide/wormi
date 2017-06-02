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

    this.state = {
        score: 0,
        state: false,
        food: undefined
    };

    this.wormi = new Worm(this.state);
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

    this.baller.dispatch()
    .then(ball => {
        this.state.food = ball;
        console.log(this.state.food);
    });

    this.interval = setInterval(loop.bind(this), 120);
};

function rollback() {
    console.log('ROLLBACK!!!')
    console.log('ESTO NO ES UN SIMULACRO');
    this.actual_direction = this.safe_direction;
}

function loop() {
    if(this.state.state === false) {
        console.log('GAME OVER!!!');
        clearInterval(this.interval);

        send('guest', this.state.score)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));

        return;
    }

    let dir = this.directions[this.actual_direction];
    this.wormi.move(dir[1] * 20, dir[0] * 20);
    this.ctx.clearRect(0, 0, conf.WIDTH, conf.HEIGHT);
    this.wormi.paint(this.ctx);

    if(this.state.food === undefined) {
        //REMOVE THIS FROM HERE
        //Generar una nueva bola después de un segundo
        setTimeout(() => {
            this.baller.dispatch()
            .then(ball => {
                this.state.food = ball;
            });
        }, 1000);

    } else {
        this.state.food.paint(this.ctx);
    }

}

function send(name, score) {
    return fetch('/arcade', {
        method: 'POST',
        body: {name, score}
    })
}

let game = new Game(canvas);
window.addEventListener('keydown', move.bind(game), false);
