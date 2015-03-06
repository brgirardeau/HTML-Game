window.onload = function(){
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext('2d');

  var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60) };

  var render = function() {
    ctx.fillStyle = "#FF00FF";
    ctx.fillRect(10, 10, 100, 100);
  };

  var update = function() {
  };

  var step = function(){
    update();
    render();
    animate(step);
  }

  animate(step);

}
