let util = {};

util.mod = function(x,  N){
    return (x % N + N) % N;
}

util.rgb = function(i) {
    let g = Math.floor(255 - 3 * i) % 255;
    let b = Math.floor(255 - 42.5 * 3) % 255;
    return `rgb(0, ${g}, ${b})`;
}
