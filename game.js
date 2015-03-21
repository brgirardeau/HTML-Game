window.onload = function(){
  var width = 500;
  var height = 500;

  var canvas = document.getElementById("game");
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var keysDown = {};
  var levels = [level1, level2, level3, level4, level5];

  var player = new Player(0, canvas.height - 10);
  var camera = new Camera();

  //handles animation of each frame
  var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60) };

  //viewport
  function Camera(){
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  Camera.prototype.update = function(char){
    this.x += char.velocityX;
    if(this.x < 0){
      this.x = 0;
    }
    if(this.x > 1000){
      this.x = 1000;
    }
  };

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
  Player.prototype.update = function(cam){

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
    //when the player is at the center of the screen and is moving right or left they should stay in the center of the screen
    //and the background should move with them.
    if(this.velocityX > 0){
      if(cam.x >= 1000){
        if(this.x >= canvas.width-this.width){
          this.x = canvas.width - this.width;
        }
      }
      else if(this.x >= canvas.width/2 - this.width/2){
        this.x = canvas.width/2-this.width/2;
      }
    }
    else if(this.velocityX < 0){
      if(!cam.x <= 0){
        if(this.x <= canvas.width/2 - this.width/2){
          this.x = canvas.width/2 - this.width/2;
        }
      }
    }
    if (this.x <= 0){
      this.x = 0;
    }
    if(this.y >= height-this.height){
      this.y = height - this.height;
      this.jumping = false;
    }
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

  /*TODO: this should really just be rendering objects instead of
          actually filling in rects. Once we have our obstacle objects
          up and running this should be calling the obstacle.prototype.render
          method*/
  var renderLevel = function(levels, currentLevel){
    for(var i = 0; i < levels[currentLevel].length; i++){
      for(var j = 0; j < levels[currentLevel][i].length; j++){
        switch(levels[currentLevel][i][j]){
          case 1:
            if(j % 2 == 0){
              ctx.fillStyle = "green";
            }
            else {
              ctx.fillStyle = "blue";
            }
            ctx.fillRect(300 * j - camera.x, 100 * i, 300, 100);
            break;
          case 0:
            break;
        }
      }
    }
  };

  //draw everything to the canvas
  var render = function() {
    //when the player is at the center of the screen and is moving right or left they should stay in the center of the screen
    //and the background should move with them.
    ctx.clearRect(0,0, canvas.width, canvas.height);
    renderLevel(levels, 0, camera);
    player.render();
  };

  //updates positions of game elements
  var update = function() {
    player.update(camera);
    camera.update(player);
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
