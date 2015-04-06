window.onload = function(){
  var width = 1000;
  var height = 500;

  var canvas = document.getElementById("game");
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  var keysDown = {};
  var levels = [level1];
  var currentLevel = 0;
  var colWidth = 50;
  var levelWidth = 2000;

  var player = new Player(levels[currentLevel].spawnX, levels[currentLevel].spawnY);
  var camera = new Camera();

  //handles animation of each frame
  var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000/60) };

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
    if(char.x >= this.width/2 - char.width/2 - char.maxSpeed && char.x <= this.width/2 - char.width/2 + char.maxSpeed){
      this.x += char.velocityX;
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
    this.width = 30;
    this.height = 30;
    this.maxSpeed = 7;
    this.maxHeight = 6;
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = .9;
    this.gravity = .6;
  }

  function Obstacle(x, y, wid, height){
   this.x=x;
    this.y=y;
    this.width=wid;
    this.height=height;
  }

  Obstacle.prototype.render = function(){
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

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

    //check collision with edges (this will go away when we
    //properly do collisions
    //when the player is at the center of the screen and is moving right or left they should stay in the center of the screen
    //and the background should move with them.
    if(cam.x == 0){
      if(this.x + this.velocityX >= 0){
        this.x += this.velocityX;
      }
    }
    if(cam.x == levels[currentLevel].cols * colWidth - cam.width){
      if(this.x + this.velocityX <= 1000 - this.width){
        this.x += this.velocityX;
      }
    }
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
  };

  Player.prototype.checkcollision = function(objects){
    for(var obj in objects){
      if(this.x+this.width+this.velocityX>obj.x){
        if(this.x+this.velocityX<obj.x+obj.width){
          if(this.y+this.velocityY+this.height>obj.y){
            if(this.y+this.velocityY<obj.y+obj.height){
              this.x=obs.x-this.width;
              console.log("collides");
            }
          }
        }
      }
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
    roundRect(this.x, this.y, this.width, this.height, 10, true, false);
    ctx.fillStyle = "white";
    roundRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4, 10, true, false);
    ctx.fillStyle = "#000000";
    roundRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6, 10, true, false);

  };

  /*TODO: this should really just be rendering objects instead of
          actually filling in rects. Once we have our obstacle objects
          up and running this should be calling the obstacle.prototype.render
          method*/
<<<<<<< HEAD
  var renderLevel = function(levels, currentLevel){
    for(var i = 0; i < levels[currentLevel].layout.length; i++){
      for(var j = 0; j < levels[currentLevel].layout[i].length; j++){
        switch(levels[currentLevel].layout[i][j]){
          case 1:
            var wall = new Obstacle(50 * j - camera.x, 50*i, 50, 50);
            wall.render();
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
