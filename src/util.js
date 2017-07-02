let util = {};

util.mod = function mod(x,  N){
    return (x % N + N) % N;
};

util.rgb = function rgb(i) {
    let g = Math.floor(255 - 3 * i) % 255;
    let b = Math.floor(255 - 42.5 * 3) % 255;
    return `rgb(0, ${g}, ${b})`;
};

util.random = function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
