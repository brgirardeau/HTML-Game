window.onload = function(){
  var width = 500;
  var height = 500;

  var canvas = document.getElementById("game");
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var keysDown = {};

  var player = new Player(0, canvas.height - 10);

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
    this.maxHeight = 6;
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = .9;
    this.gravity = .5;
  }

  //update the state of the player
  Player.prototype.update = function(){

    //make player move based off of key strokes
    this.interpretInputs();

    //cause player to skid to stop
    this.velocityX *= this.friction;

    //implement gravity
    this.velocityY += this.gravity;

    //console.log(this.velocityX);

    this.y += this.velocityY;
    this.x += this.velocityX;

    //check collision with edges (this will go away when we
    //properly do collisions
    if (this.x >= canvas.width-this.width) {
      this.x = canvas.width-this.width;
    }
    else if (player.x <= 0) {
      player.x = 0;
    }
    if(this.y >= height-this.height){
      this.y = height - this.height;
      this.jumping = false;
    }
//    ctx.translate(-this.velocityX, 0);

  };

  Player.prototype.interpretInputs = function(){
    for (var key in keysDown) {
      var value = Number(key);
      //left
      if (value == 37) {
        if(this.velocityX > -this.maxSpeed){
          this.velocityX -= 1;
        }
      }
      //right
      else if (value == 39) {
        if(this.velocityX < this.maxSpeed){
          this.velocityX += 1;
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
  };

  //draw the player to the canvas
  Player.prototype.render = function(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  //draw everything to the canvas
  var render = function() {
    //when the player is at the center of the screen and is moving right or left they should stay in the center of the screen
    //and the background should move with them.
    ctx.fillStyle = "blue";
    ctx.fillRect(0,0,500,500);
    ctx.fillStyle = "green";
    ctx.fillRect(500,0, 500,500);
    ctx.fillStyle = "red";
    ctx.fillRect(1000,0,500,500);
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
