var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOverImg, restartImg
var score=0;
var ground1;
var nightImg, dayImg;
var gameOver, restart;
var current, non_current;
var dayNightButton;
var starsGroup;
var starImage;
var textColor = 0;
var hearts, heartImage;
var visibility = 255;
var sound;

backgroundColor = "cyan"
localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  sound = loadSound("pop.mp3");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  dayImg = loadImage("day.png")
  nightImg = loadImage("night.png");

  starImage = loadImage("starImage.png");
  heartImage = loadImage("heart.png");
}

function setup() {
  createCanvas(600, 200);
  heartsArray = []
  for (var x=20; x < 150; x+=40)
  {
    heartsArray.push(createSprite(camera.position.x + x - 50, 20, 20, 20));
  }

  trex = createSprite(80,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  starsGroup = new Group();
  
  ground = createSprite(1200,180,2400,20);
  ground.addImage(groundImage);
  //ground.velocityX = -(6 + 3*score/100);

  ground1 = createSprite(3000,180,2400,20);
  ground1.addImage(groundImage);
  // ground1.x = ground.width /2;
  gameOver = createSprite(300,60);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(1200,190,2400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  current = "day";
  non_current = "night";
  score = 0;

  dayNightButton = createSprite(trex.x + 200, 20, 10, 10);
}

function draw() {
  background(backgroundColor);
  var location = 80
  // console.log(heartsArray)
  // heartsArray[1].x = camera.position.x - 160;
  // heartsArray[2].x = camera.position.x  - 120;
  // heartsArray[3].x = camera.position.x - 80;

  
dayNightButton.x = trex.x + 300
  if (trex.x % 1200 == 0)
  {
    new Ground();
  }
  if (current == "day")
  { 
    dayNightButton.addImage(dayImg);
  }
  else
  {
    dayNightButton.addImage(nightImg)
  }

  if (mousePressedOver(dayNightButton) || keyDown("enter"))
  {
    sound.play();
    if (current == "day")
    {
      current = "night"
    }
    else
    {
      current = "day";
    }
  }
  dayNightButton.scale = 0.09;
  restart.x = trex.x + 200;
  gameOver.x = trex.x + 200;
  camera.position.x = trex.x + 200
  invisibleGround.x = trex.x
  //trex.debug = true;
  fill(textColor);
  text("Score: "+ score, camera.position.x - 20,20);
  
  if (gameState===PLAY){
    for (var y = 0; y < heartsArray.length; y ++)
    {
      heartsArray[y].x = camera.position.x - location;
      location += 40;
    }
  for (var y=0; y < heartsArray.length; y++)
  {
    heartsArray[y].addImage(heartImage);
    heartsArray[y].scale = 0.1;
  }  
    // console.log(ground1.x - trex.x)
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
    trex.velocityX = 5;
    //ground.x = camera.position.x + 200;

    if (current == "day")
    {
      backgroundColor = "cyan"
      textColor = 0;
      starsGroup.destroyEach();
      spawnClouds();
    }
    else
    {
      backgroundColor = "black"
      textColor = 255;
      cloudsGroup.destroyEach();
      spawnStars();
    }
    if(keyDown("space") && trex.y >= 161) {
      sound.play();
      trex.velocityY = -13;
    }
    trex.velocityY += 0.8
  
    trex.collide(invisibleGround);
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      sound.play();
      // gameState = END;
      if (heartsArray.length <= 1)
      {
        heartsArray[heartsArray.length - 1].destroy();
        heartsArray.pop();
        gameState = END;
      }
      else
      {
        obstaclesGroup.destroyEach();
        heartsArray[heartsArray.length - 1].destroy();
        heartsArray.pop();
      }
    }
  }
  else if (gameState === END) {
    // for (var x = 0; x < heartsArray.length; x ++)
    // {
    //   heartsArray[heartsArray.length - 1].destroy();
    //   heartsArray.pop();
    // }
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || keyDown("space")) {
      sound.play();
      reset();
    }
  }
  
  
  drawSprites();
  textSize(15);
  textFont("Tw Cen MT Condensed Extra Bold")
  text("LIVES: ", camera.position.x -275, 25);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x + 500,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    gameOver.depth += cloud.depth;
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnStars()
{
  if (frameCount % 60 === 0) {
    var star = createSprite(trex.x + 500,120,40,10);
    star.y = Math.round(random(80,120));
    star.addImage(starImage);
    star.scale = 0.01;
    //cloud.velocityX = -3;
    
     //assign lifetime to the variable
    star.lifetime = 1000;
    
    //adjust the depth
    star.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    starsGroup.add(star);
  }
}

function spawnObstacles() {
  if(trex.x % 250 === 0) {
    var obstacle = createSprite(trex.x + 800,165,10,40);
    //obstacle.debug = true;
    //obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  for (var x=20; x < 150; x+=40)
  {
    heartsArray.push(createSprite(camera.position.x + x - 50, 20, 20, 20));
  }
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  trex.x = 60
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}

function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        trex.velocityX = 5
          currentDate = Date.now();
      } while (currentDate - date < milliseconds);
  }
