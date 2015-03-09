function Player(x,y){
  this.x = x;
  this.y = y;
  this.speed = 0;
}

Player.prototype.update = function(){
};

Player.prototype.render = function(){
  ctx.fillStyle = "#000000";
  console.log(this.x);
  ctx.fillRect(this.x, this.y, 500, 500);
};

