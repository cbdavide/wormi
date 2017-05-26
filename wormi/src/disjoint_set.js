'use strict';

class DisjointSet {
    constructor(n) {
        this.set = new Array(n);
        for(let i=0; i<this.set.length; i++)
            this.set[i] = i;
    }
    find(x) {
        if(this.set[x] == x) return x;
        this.set[x] = this.find(this.set[x]);
        return this.set[x];
    }
    union(x, y) {
        let px = this.find(x), py = this.find(y);
        if(px == py) return false;
        this.set[px] = py;
        return true;
    }
}
