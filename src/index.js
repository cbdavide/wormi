'use strict';

function Game(canvas){
    this.ctx = canvas.getContext('2d');
    window.addEventListener('keydown', move.bind(this), false);

    this.wormi = new Worm();

    let generador = generate_balls(100, 15);

    let b = generador.next().value;
    console.log(b);
    let c = generador.next().value;
    let d = generador.next().value;
    let e = generador.next().value;
    let f = generador.next().value;

    this.wormi.add(b);
    this.wormi.add(c);
    this.wormi.add(d);
    this.wormi.add(e);

    // this.wormi.paint(this.ctx);
    setInterval(loop.bind(this), 30);

};

function loop() {
    this.ctx.clearRect(0, 0, 600, 600);
    this.wormi.paint(this.ctx);
}

new Game(document.getElementById('canvas'));
