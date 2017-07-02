'use strict';

class Baller {
    constructor(generator) {
        this.positions = {};
        this.generador = generator;
    }
    dispatch() {
        let res = this.generador.next();
        return new Promise((resolve, reject) =>{
            if(res.done) reject({code: 2, err: 'No hay más bolas :v'});
            else  {
                let x = util.random(20, conf.WIDTH);
                let y = util.random(20, conf.HEIGHT);
                res.value.setPos(x, y);
                resolve(res.value);
            }
        });
    }
}
