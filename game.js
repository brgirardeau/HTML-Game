window.onload = function(){
  var width = 1000;
  var height = 500;

  var canvas = document.getElementById("game");
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var keysDown = {};
  var objectsInLevel = [];
  var levels = [level1];
  var currentLevel = 0;
  var colWidth = 50;
  var levelWidth = 2000;

  var player = new Player(levels[currentLevel].spawnX, levels[currentLevel].spawnY);
  var camera = new Camera();

  var lastUpdateTime;

  function roundRect(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined" ) {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }
  }

  //viewport
  function Camera(){
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  Camera.prototype.update = function(char){
    //current time
    var now = new Date();
    //number of miliseconds elapsed since Jan 1, 1970
    var updateTick = now.getTime();
    var vX = LinearMovement(char.velocityX, updateTick);
    if(char.x + char.maxSpeedX/60 >= this.width/2 - char.width/2 && char.x - char.maxSpeedX/60 <= this.width/2 - char.width/2){
      this.x += vX;
    }
    if(this.x < 0){
      this.x = 0;
    }
    if(this.x > levels[currentLevel].cols * colWidth - this.width){
      this.x = levels[currentLevel].cols * colWidth - this.width;
    }
  };

  function Player(x,y){
    this.x = x;
    this.y = y;
    this.jumping = false;
    this.moveRequest = false;
    //optimal frame rate 60fps
    this.mScale = 60;
    this.width = 30;
    this.height = 30;
    this.maxSpeedX = 8 * this.mScale;
    this.maxSpeedY = 10 * this.mScale;
    this.jumpStartSpeedY = 8 * this.mScale;
    this.accelY = .5 * this.mScale;
    this.maxHeight = 6;
    this.velocityX = 0;
    this.velocityY = 0;
    this.accelX = .6 * this.mScale;
    this.deccelX = .4 * this.mScale;
  }

  function Obstacle(x, y, width, height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
  }

  Obstacle.prototype.render = function(){
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  //update the state of the player
  Player.prototype.update = function(cam){
    //slow down if nothing pressed during frame
    this.moveRequest = false;

    //current time
    var now = new Date();
    //number of miliseconds elapsed since Jan 1, 1970
    var updateTick = now.getTime();

    //update player position
    var amountToMoveX = LinearMovement(this.velocityX, updateTick);
    var amountToMoveY = LinearMovement(this.velocityY, updateTick);
   /*
    if(this.x){
      this.x += amountToMoveX;
    }
    else {
      this.x = levels[currentLevel].spawnX;
    }
    */
    //when the player is at the center of the screen and is moving right or left they should stay in the center of the screen
    //and the background should move with them.
    if(cam.x == 0){
      if(this.x + amountToMoveX >= 0){
        this.x += amountToMoveX;
      }
    }
    if(cam.x == levels[currentLevel].cols * colWidth - cam.width){
      if(this.x + amountToMoveX <= levels[currentLevel].cols * colWidth - this.width){
        this.x += amountToMoveX;
      }
    }

    if(this.y){
      this.y += amountToMoveY;
    }
    else {
      this.y = levels[currentLevel].spawnY;
    }

    //make player move based off of key strokes
    this.interpretInputs();

    //limit sideways acceleration of player
    if(this.velocityX > this.maxSpeedX){
      this.velocityX = this.maxSpeedX;
    }
    if(this.velocityX < -this.maxSpeedX){
      this.velocityX = -this.maxSpeedX;
    }

    //limit the upward accel of gravity
    if(this.velocityY < -this.maxSpeedY){
      this.velocityY = -this.maxSpeedY;
    }

    //apply gravity
    this.velocityY += this.accelY;

    //slow down if nothing pressed
    if(!this.moveRequest){
      if(this.velocityX < 0){
        this.velocityX += this.deccelX;
      }
      if(this.velocityX > 0){
        this.velocityX -= this.deccelX;
      }
      if(this.velocityX > 0 && this.velocityX < this.deccelX) this.velocityX = 0;
      if(this.velocityY < 0 && this.velocityX > -this.deccelX) this.velocityX = 0;
    }

    //DELETE LATER
    if(this.x <= 0){
      this.x = 0;
    }
    if(this.x >= canvas.width - this.width){
      this.x = canvas.width  - this.width;
    }
    if(this.y >= height-this.height){
      this.y = height - this.height;
      this.jumping = false;
    }
    //END DELETE
    this.checkCollisions(objectsInLevel);
  };

  /* Ideally this is called 60 times in one second, so each frame the
    player will move 1/60 th of the velocity. If the player is lagging
    it will take more than that amount of time and this will adjust
    based off of seconds between when render is called and player
    movement is processed */
  function LinearMovement(pixelsPerSecond, tickCount){
    if(!tickCount){
      var date = new Date();
      tickCount = date.getTime();
    }
    //elapsed time since render function called in seconds
    var secsElapsed = (tickCount - lastUpdateTime) / 1000;
    return secsElapsed * pixelsPerSecond;
  }
  //check collisions with array of objects in the level and
  //adjust position accordingly
  Player.prototype.checkCollisions = function(objects){
    var play = this;
    var positionX;
    var positionY;
    objects.forEach(function(obj){
      //is colliding if true
      if(collides(play, obj.x, obj.y, obj.width, obj.height)){
        console.log("hi");
      };
    });
  };

  //check to see if player object collides with obstacle at x,y of size
  //width height
  var collides = function(play,x,y,width,height){
    if(play.x + play.velocityX + play.width >= x &&
       play.x + play.velocityX <= x + width &&
       play.y + play.velocityY + play.height >= y &&
       play.y + play.velocityY <= y + height){
      return true;
    }
    else{
      return false;
    }
  };

  //adjust velocity based off of keyboard inputs from human
  Player.prototype.interpretInputs = function(){
    for (var key in keysDown) {
      var value = Number(key);
      //left
      if (value == 37) {
        this.velocityX -= this.accelX;
        this.moveRequest = true;
      }
      //right
      else if (value == 39) {
        this.velocityX += this.accelX;
        this.moveRequest = true;
      }
      //up
      else if (value == 32) {
        if(!this.jumping){
          this.jumping = true;
          this.velocityY = -this.jumpStartSpeedY;
        }
      }
    }
  };

  //draw the player to the canvas
  Player.prototype.render = function(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(this.x, this.y, this.width, this.height);
 //   roundRect(this.x, this.y, this.width, this.height, 10, true, false);
 //   ctx.fillStyle = "white";
 //   roundRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4, 10, true, false);
 //   ctx.fillStyle = "#000000";
 //   roundRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6, 10, true, false);

  };


  //render all of the objects in the level by iterating
  //through the array of objects in each level
  //TODO: optimize by not drawing every object when not necessary?
  var renderLevel = function(levels, currentLevel){
    objectsInLevel = [];
    for(var i = 0; i < levels[currentLevel].layout.length; i++){
      for(var j = 0; j < levels[currentLevel].layout[i].length; j++){
        switch(levels[currentLevel].layout[i][j]){
          case 1:
            var wall = new Obstacle(50 * j - camera.x, 50*i, 50, 50);
            wall.render();
            objectsInLevel.push(wall);
            break;
          case 0:
            break;
        }
      }
    }
  };

  //draw everything to the canvas
  var render = function() {
    //get the miliseconds every time the render function is called
    //in order to be able to calculate lag -> decide how much player
    //moves each frame
    var date = new Date();
    lastUpdateTime = date.getTime();

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

  //handles animation of each frame
  var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60) };


  //start the game loop
  animate(step);

  window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
  });
}
