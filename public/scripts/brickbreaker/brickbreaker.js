var bb = bb || {};
const brickBreaker ={} || brickBreaker;

bb.WIDTH = 0;
bb.HEIGHT = 0;
brickBreaker.password=""; //to be overwritten by main
//functions to convert from gameplay coordinates to display coordinates, this allows the size of the viewing box to change with screen size
function realX(x){
  return x/100*bb.WIDTH;
}
function realY(y){
  return y/100*bb.HEIGHT;
}
//model object for the paddle
bb.Paddle = class {
  constructor(){
    this.x = 50;
    this.y = 90;
    this.realx = realX(this.x);
    this.realy = realY(this.y);
    this.width = 10;
    this.height = 1;
    this.realwidth = realX(this.width);
    this.realheight = realY(this.height);
  }

  updateReal(){
    this.realx = realX(this.x);
    this.realy = realY(this.y);
    this.realwidth = realX(this.width);
    this.realheight = realY(this.height);
  }
  
  moveLeft(){
    if (this.x>0){
      this.x--;
    }
  }
  moveRight(){
    if (this.x+this.width<100){
      this.x++;
    }
  }

  drawSelf(){
    this.updateReal();
    fill(0);
    rect(this.realx,this.realy,this.realwidth,this.realheight);
  }

}
//ball model object
bb.Ball = class {
  constructor(){
    this.x=50;
    this.y=50;
    this.realx=0;
    this.realy=0;
    this.realwidth=0;
    this.realheight=0;
    this.width=3;
    this.height=3;

    this.xVel=0.5;
    this.yVel=0.5;
  }

  update(){
    this.x+=this.xVel;
    this.y+=this.yVel;
    this.drawSelf();
  }
  updateReal(){
    this.realx = realX(this.x);
    this.realy = realY(this.y);
    this.realwidth = realX(this.width);
    this.realheight = realY(this.height);
  }

  drawSelf(){
    this.updateReal();
    fill(0);
    rect(this.realx,this.realy,this.realwidth,this.realheight);
  }

}
//brick model object.
bb.Brick = class{
  constructor(x, y){
    this.x=x;
    this.y=y;
    this.realx=0;
    this.realy=0;
    this.realwidth=0;
    this.realheight=0;
    this.width=25;
    this.height=10;
  }
  updateReal(){
    this.realx = realX(this.x);
    this.realy = realY(this.y);
    this.realwidth = realX(this.width);
    this.realheight = realY(this.height);
  }
  drawSelf(){
    this.updateReal();
    fill(0);
    rect(this.realx,this.realy,this.realwidth,this.realheight);
  }
}
testPaddle = new bb.Paddle();
testBall = new bb.Ball();
balls=3;
bricks=[]
function setBricks(){
  bricks = []
  for(let i =0; i<4; i++){
    for (let j=0; j<4; j++){
      bricks.push(new bb.Brick(i*25,j*10));
    }
  }
}
setBricks();

//returns true if a collision has occurred
bb.checkCollideBrick = function(brick, ball){
  let xBall;
  let yBall;
  let xBrick;
  let yBrick;
  let ycol = 0;
  let xcol = 0;
  let col =0;
  if (ball.yVel>0){
    yBall=ball.y+ball.height;
    yBrick=brick.y;
    if (yBall>yBrick&&yBall<yBrick+brick.height){
      ycol=1;
    }
  }
  else{
    yBall=ball.y;
    yBrick=brick.y+brick.height;
    if (yBall<yBrick&&yBall>yBrick-brick.height){
      ycol=1;
    }
  }
  if (ball.xVel>0){
    xBall=ball.x+ball.width;
    xBrick=brick.x;
    if (xBall>xBrick&&xBall<xBrick+brick.width){
      xcol=1;
    }
  }
  else{
    xBall=ball.x;
    xBrick=brick.x+brick.width;
    if (xBall<xBrick&&xBall>xBrick-brick.width){
      xcol=1;
    }
  }
  col = xcol*ycol;
  return col;

}

//adjusts the ball's velocity and position depending on which side the collision happened on
bb.handleCol = function(brick, ball){
  ball.y-=ball.yVel; //undo movement in y direction
  if (bb.checkCollideBrick(brick,ball)){ //collision did not happen as result of movement on y axis
    ball.xVel*=-1;
    ball.y+=ball.yVel; //restore original position
  }
  else{ //colision happened as a result of movement on y axis (technically could be both, but corners are hard and this works fine)
    ball.y+=ball.yVel;
    ball.yVel*=-1;
  }
}

//processing functions, setup is called initially to setup the canvas element
function setup() {
  let parentDiv = document.getElementById("brickDiv");
  var testCanvas = createCanvas(window.innerWidth, window.innerHeight);
  testCanvas.parent("brickDiv");
  windowResized();
}
//called repeatedly as input loop and update
function draw() {
  //handle user input
  if (keyIsDown(LEFT_ARROW)){
    testPaddle.moveLeft();
  }
  else if (keyIsDown(RIGHT_ARROW)){
    testPaddle.moveRight();
  }
  //make sure ball is inbounds
  if (testBall.x+testBall.width>100){
    testBall.xVel=-testBall.xVel;
    testBall.x=100-testBall.width;
  }
  else if (testBall.x<0){
    testBall.xVel=-testBall.xVel;
    testBall.x=0;
  }
  if (testBall.y<0){
    testBall.yVel=0.5;
  }
  //check if ball needs to bounce off of paddle, we give a slight grace period where the ball can still bounce even if it has 
  //missed the paddle
  else if (testBall.y+testBall.height>=90){
    if (testBall.y>93){ //arbitrary grace period
      balls--;
      testBall = new bb.Ball();
      if (balls<0){
        balls=3;
        setBricks();
      }
    }
    //adjust the ball's y velocity if it hit the paddle
    else if (testBall.x<=(testPaddle.x+testPaddle.width) && testBall.x+testBall.width>=testPaddle.x){
      testBall.yVel=-0.5;
      //set the balls x velocity depending on which part of the paddle it hit
      testBall.xVel=((testBall.x+testBall.width/2)-(testPaddle.x+testPaddle.width/2))/8;
      //clamp the xVelocity of the ball so that the paddle can keep up.
      if (testBall.xVel>0.75){
        testBall.xVel=0.75;
      }
      else if (testBall.xVel<-0.75){
        testBall.xVel=-0.75;
      }
    }
  }



  background(255);
  textAlign(CENTER,TOP);
  textSize(bb.WIDTH/5);
  text(brickBreaker.password, realX(50),realY(0));

  for (let i=0; i<bricks.length; i++){
    let brick = bricks[i];
    if(bb.checkCollideBrick(brick, testBall)){
      bb.handleCol(brick,testBall);
      bricks.splice(i,1);
      i--;
    }
    brick.drawSelf();
  }
  if (bricks.length>0){
    testBall.update();
  }
  testPaddle.drawSelf();
  
}


function windowResized() {
  bb.WIDTH = window.innerWidth/2;
  bb.HEIGHT = window.innerHeight/2;
  resizeCanvas(bb.WIDTH, bb.HEIGHT);
}


