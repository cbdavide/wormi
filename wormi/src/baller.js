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
                res.value.setPos(49 * 20, 300);
                resolve(res.value);
            }
        });
    }
}
