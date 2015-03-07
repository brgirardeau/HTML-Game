window.onload = function(){
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext('2d');

  var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60) };

  function Player(x,y){
  this.x;
  this.y;
  this.speed;
  }

  Player.prototype.update = function(){

  };

  Player.prototype.render = function(){
    ctx.fillStyle = "#000000";
    console.log(this.x);
    ctx.fillRect(this.x, this.y, 500, 500);
  };

  var player = new Player(5,5);

  var keysdown = {};

  var render = function() {
    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(10, 10, 100, 100);
    player.render();
  };

  var update = function() {
    player.update();
  };

  var step = function(){
    update();
    render();
    animate(step);
  }

  animate(step);

  window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
  });
}
