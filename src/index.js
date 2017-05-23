'use strict';

(function(canvas){

    let ctx = canvas.getContext('2d');

    let b = new Ball(0, 50, 'blue');
    b.paint(ctx, {x: 75, y: 75});
    let c = new Ball(1, 35, 'blue');
    c.paint(ctx, {x: 75, y: 75});
    let d = new Ball(2, 25, 'blue');
    d.paint(ctx, {x: 75, y: 75});
    // ctx.clearRect(0, 0, 600, 60);


})(document.getElementById('canvas'));
