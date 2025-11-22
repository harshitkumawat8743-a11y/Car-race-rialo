// Rialo Car Racing - web game with coins + logo
const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");
const scoreVal = document.getElementById("scoreVal");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let player = { speed:6, score:0, start:false };
let keys = { ArrowLeft:false, ArrowRight:false, a:false, d:false };

document.addEventListener("keydown", e => {
  if(e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "a" || e.key === "d"){
    keys[e.key] = true;
  }
});
document.addEventListener("keyup", e => {
  if(e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "a" || e.key === "d"){
    keys[e.key] = false;
  }
});

// Touch controls
leftBtn.addEventListener("touchstart", (e)=>{ e.preventDefault(); keys["ArrowLeft"]=true; });
leftBtn.addEventListener("touchend", (e)=>{ e.preventDefault(); keys["ArrowLeft"]=false; });
rightBtn.addEventListener("touchstart", (e)=>{ e.preventDefault(); keys["ArrowRight"]=true; });
rightBtn.addEventListener("touchend", (e)=>{ e.preventDefault(); keys["ArrowRight"]=false; });

startBtn.addEventListener("click", startGame);

function startGame(){
  startBtn.style.display = "none";
  gameArea.innerHTML = "";
  player.start = true;
  player.score = 0;
  scoreVal.innerText = 0;

  // create player car
  const car = document.createElement("div");
  car.classList.add("car");
  car.style.left = (gameArea.clientWidth/2 - 29) + "px"; // center
  car.innerHTML = ""; // can add small emblem later
  gameArea.appendChild(car);

  // spawn enemies
  for(let i=0;i<3;i++){
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = -200 * (i+1) - Math.floor(Math.random()*300);
    enemy.style.top = enemy.y + "px";
    enemy.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 70)) + "px";
    gameArea.appendChild(enemy);
  }

  // spawn coins
  for(let i=0;i<4;i++){
    const coin = document.createElement("div");
    coin.classList.add("coin");
    coin.y = -150 * (i+1) - Math.floor(Math.random()*400);
    coin.style.top = coin.y + "px";
    coin.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 50)) + "px";
    // add logo img inside coin (logo.png needs to be in folder)
    const img = document.createElement("img");
    img.src = "logo.png";
    img.alt = "logo";
    coin.appendChild(img);
    gameArea.appendChild(coin);
  }

  window.requestAnimationFrame(gameLoop);
}

function isCollide(a,b){
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function gameLoop(){
  if(!player.start) return;
  const car = document.querySelector(".car");
  const enemies = document.querySelectorAll(".enemy");
  const coins = document.querySelectorAll(".coin");

  // Move enemies
  enemies.forEach(enemy => {
    if(isCollide(car, enemy)){
      // crash
      player.start = false;
      gameOver();
    }

    enemy.y += player.speed;
    enemy.style.top = enemy.y + "px";
    // when enemy goes below
    if(enemy.y > gameArea.clientHeight + 50){
      enemy.y = -200 - Math.floor(Math.random()*300);
      enemy.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 70)) + "px";
    }
  });

  // Move coins and check collect
  coins.forEach(coin => {
    // small rotation pulse (visual)
    const t = Date.now()/200;
    coin.style.transform = `translateZ(0) rotate(${Math.sin(t)*6}deg)`;

    if(isCollide(car, coin)){
      // collected
      player.score += 50;
      scoreVal.innerText = player.score;
      // respawn coin
      coin.y = -100 - Math.floor(Math.random()*500);
      coin.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 50)) + "px";
      coin.style.top = coin.y + "px";
      // small pop effect
      coin.style.transition = "transform 0.2s";
      coin.style.transform = "scale(1.2)";
      setTimeout(()=> coin.style.transform = "", 140);
    } else {
      coin.y += player.speed * 0.9; // coins move a bit slower
      coin.style.top = coin.y + "px";
      if(coin.y > gameArea.clientHeight + 50){
        coin.y = -100 - Math.floor(Math.random()*500);
        coin.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 50)) + "px";
      }
    }
  });

  // Player left/right
  const moveAmount = player.speed * 2;
  const left = car.offsetLeft;
  if((keys["ArrowLeft"] || keys["a"]) && left > 6){
    car.style.left = (left - moveAmount) + "px";
  }
  if((keys["ArrowRight"] || keys["d"]) && left < (gameArea.clientWidth - car.clientWidth - 6)){
    car.style.left = (left + moveAmount) + "px";
  }

  // increase base score slowly
  player.score += 1;
  scoreVal.innerText = player.score;

  requestAnimationFrame(gameLoop);
}

function gameOver(){
  startBtn.style.display = "flex";
  startBtn.innerHTML = '<img src="logo.png" class="btnLogo" alt=""> RESTART';
}
