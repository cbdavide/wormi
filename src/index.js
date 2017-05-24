'use strict';

function Game(canvas){
    this.ctx = canvas.getContext('2d');
    window.addEventListener('keydown', move.bind(this), false);

    this.wormi = new Worm();
    let b = new Ball(0, 15, 'blue');
    let c = new Ball(1, 15, 'blue');
    let d = new Ball(2, 15, 'blue');
    let e = new Ball(3, 15, 'blue');
    let f = new Ball(4, 15, 'blue');
    let g = new Ball(5, 15, 'blue');
    this.wormi.add(b);
    this.wormi.add(c);
    this.wormi.add(d);
    this.wormi.add(e);
    this.wormi.add(f);
    this.wormi.add(g);
    // this.wormi.paint(this.ctx);
    setInterval(loop.bind(this), 30);

};

function loop() {
    this.ctx.clearRect(0, 0, 600, 600);
    this.wormi.paint(this.ctx);
}

new Game(document.getElementById('canvas'));
