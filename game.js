window.onload = function(){
  var width = 500;
  var height = 500;

  var canvas = document.getElementById("game");
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var keysDown = {};

  var player = new Player(canvas.width/2, canvas.height - 10);

  //handles animation of each frame
  var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60) };

  function Player(x,y){
    this.x = x;
    this.y = y;
    this.jumping = false;
    this.width = 10;
    this.height = 10;
    this.maxSpeed = 10;
    this.maxHeight = 5;
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = .85;
    this.gravity = .5;
  }

  //update the state of the player
  Player.prototype.update = function(){
      for (var key in keysDown) {
        var value = Number(key);
        //left
        if (value == 37) {
          if(this.velocityX > -this.maxSpeed){
            this.velocityX -= 2;
          }
        }
        //right
        else if (value == 39) {
          if(this.velocityX < this.maxSpeed){
            this.velocityX += 2;
          }
        }
        //up
        else if (value == 32) {
          if(!this.jumping){
            this.jumping = true;
            this.velocityY = -this.maxHeight * 2;
          }
        }
    }
    console.log(this.velocityX);
    //cause player to skid to stop
    this.velocityX *= this.friction;

    //implement gravity
    this.velocityY += this.gravity;

    this.y += this.velocityY;
    this.x += this.velocityX;

    //check collision with edges
    if (this.x >= width-this.width) {
      this.x = width-this.width;
    }
    else if (player.x <= 0) {
      player.x = 0;
    }
    if(this.y >= height-this.height){
      this.y = height - this.height;
      this.jumping = false;
    }
  };

  //draw the player to the canvas
  Player.prototype.render = function(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  //draw everything to the canvas
  var render = function() {
    ctx.clearRect(0,0,canvas.height, canvas.width);
    player.render();
  };

  //updates positions of game elements
  var update = function() {
    player.update();
  };

  //main game loop
  var step = function(){
    update();
    render();
    animate(step);
  }

  //start the game loop
  animate(step);

  window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
  });
}
