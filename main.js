// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape{
    constructor(x, y, xVel, yVel){
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
    }
}

class Ball extends Shape{
    constructor(x, y, xVel, yVel, color, size){
        super(x, y, xVel, yVel);
        this.color = color;
        this.size = size;
        this.exists = true;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fill();
    }
    update(){
        if(this.x + this.size >= width || this.x - this.size <= 0){
            this.xVel = -this.xVel;
        }
        if(this.y + this.size >= height || this.y - this.size <= 0){
            this.yVel = -this.yVel;
        }
        this.x += this.xVel;
        this.y += this.yVel;
    }
    collisionDetect(){
        for(const ball of balls){
            if(this != ball && ball.exists){
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                if(distance < this.size + ball.size){
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }
}

class evilCircle extends Shape{
    constructor(x, y){
        super(x, y, 20, 20);
        this.size = 20;
        this.color = "white";
        window.addEventListener("keydown", (e) => {
            switch(e.key){
                case "a":
                    this.x -= this.xVel;
                    break;
                case "d":
                    this.x += this.xVel;
                    break;
                case "w":
                    this.y -= this.yVel;
                    break;
                case "s":
                    this.y += this.yVel;
                    break;
            }
        })
    }
    draw(){
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.stroke();
    }
    checkBounds(){
        if(this.x + this.size >= width){
            this.x -= this.size; 
        }
        if(this.x - this.size <= 0){
            this.x += this.size;
        }
        if(this.y + this.size >= height){
            this.y -= this.size;
        }
        if(this.y - this.size <= 0){
            this.y += this.size;
        }
    }
    collisionDetect(){
        for(const ball of balls){
            if(ball.exists){
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                if(distance < this.size + ball.size){
                    ball.exists = false;
                    totalBalls -= 1;
                    count.textContent = ` ${totalBalls}`;
                }
            }
        }
    }
}

let totalBalls = 25;
const counter = document.querySelector('p');
const count = document.createElement("span");
count.textContent = ` ${totalBalls}`;
counter.appendChild(count);

const evil = new evilCircle(50, 50);
const balls = [];
while(balls.length < 25){
    const size = random(10, 20);
    const ball = new Ball(random(size, width-size), random(size, height-size), random(-7,7), random(-7,7), randomRGB(), size);
    balls.push(ball);
}

function loop(){
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0,0,width,height);
    for(const ball of balls){
        if(ball.exists){
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
        evil.draw();
        evil.checkBounds();
        evil.collisionDetect();
    }
    requestAnimationFrame(loop);
}
loop();