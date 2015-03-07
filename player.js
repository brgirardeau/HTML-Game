function Player(x,y){
  this.x;
  this.y;
  this.speed;
}

Player.prototype.update = function(){

};

Player.prototype.render = function(){
  ctx.fillStyle = "#FF00FF";
  ctx.fillRect(x, y, 500, 500);
};
