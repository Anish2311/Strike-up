let dests = []
let hero;
let f = false
let c = false
let count = 0
let score = 0
let highScore = 0
const lvl = document.getElementById('lvl')
if(JSON.parse(localStorage.getItem('high')) != null){
    highScore = JSON.parse(localStorage.getItem('high'))
}
let coins = 0
if(JSON.parse(localStorage.getItem('coin')) != null){
    coins = JSON.parse(localStorage.getItem('coin'))
}
let level = 0
if(JSON.parse(localStorage.getItem('lvl')) != null){
    level = JSON.parse(localStorage.getItem('lvl'))
}
const retry = document.getElementById('retry')
const menu = document.getElementById('menu')
const lvlup = document.getElementById('lvlup')
lvl.innerText = (level + 1) * 10

class Dest{
    constructor(x,y,r){
        this.coin = false
        if(random(1) < 0.2){
            this.coin = true
        }
        this.x = x
        this.y = y
        this.r = r
        this.guards = []
        let l = floor(2*this.r / 20)
        for(let i = 0; i < l; i++){
            this.guards.push(new Guard(this.x,this.y,this.r,random([1,-1])*random(0.05,0.1),floor(random(20,25))))
        }
    }
    show(){
        fill(20)
        noStroke()
        circle(this.x,this.y,15)
        this.guards.forEach(e => {
            e.show()
        });
        if(this.coin){
            fill(255,150,0)
            stroke(100,50,0)
            strokeWeight(1)
            circle(this.x,this.y,25)
        }
    }
}

class Guard{
    constructor(x,y,r,s,rad){
        this.x = x
        this.y = y
        this.r = r
        this.rad = rad
        this.angle = 0
        this.speed = s
        if(this.speed == 0){
            this.speed = 0.1
        }
        this.ax = this.x + this.r
        this.ay = this.y + this.r
    }
    show(){
        // console.log('SHOWING',this.speed);
        this.ax = this.x + this.r * cos(this.angle);
        this.ay = this.y + this.r * sin(this.angle);
        noStroke()
        fill(200,map(this.y,0,height,0,255),50)
        ellipse(this.ax, this.ay, this.rad, this.rad);
        this.angle = this.angle + this.speed;
    }
}

class Hero{
    constructor(x,y){
        this.x = x
        this.y = y
        this.r = 12 - level
        this.sp = 7 - level
    }
    show(){
        fill(200,50,50)
        noStroke()
        circle(this.x,this.y,this.r*2)
    }
    move(x,y){
        if(x != this.x || y != this.y){
            if(abs(this.x - x) < 1 && abs(this.y - y) < 1){
                f = false
                console.log(f);
            }
            else{
                if(this.x <= x){
                    this.x += abs(this.x - x)/this.sp
                }
                else {
                    this.x -= abs(this.x - x)/this.sp
                }
                if(this.y <= y){
                    this.y += abs(this.y - y)/this.sp
                }
                else {
                    this.y -= abs(this.y - y)/this.sp
                }
            }
        }
    }
    hit(){
        dests.forEach(e => {
            e.guards.forEach(el => {
                if(collideCircleCircle(this.x,this.y,this.r*2,el.ax,el.ay,el.rad)){
                    // console.log('HIT');
                    noLoop()
                }
            });
        });
    }
    lvluped(){
        this.sp -= 1
        this.r -= 1
    }
}

function setup(){
    createCanvas(window.innerWidth - 50,window.innerHeight - 20)
    dests.push(new Dest(floor(random(80,width - 80)),height/2 + 20,65))
    dests.push(new Dest(floor(random(80,width - 80)),80,65))
    // dests.push(new Dest(floor(random(80,width - 80)),height - 80,65))
    hero = new Hero(width/2,height - 60)
    
}

function draw(){
    background(0,130)
    stroke(20)
    strokeWeight(3)
    line(hero.x,hero.y,dests[0].x,dests[0].y)
    dests.forEach(e => {
        e.show()
    });
    hero.show()
    hero.hit()
    if(f){
        hero.move(dests[0].x,dests[0].y)
    }
    if(!f && c){
        // console.log(dests);
        dests[0].guards = []
        if(dests[0].coin){
            coins += 1
            localStorage.setItem('coin',JSON.stringify(coins))
            dests[0].coin = false
        }
        shift()
    }
    menu.innerHTML = `<p>Score: ${score}</p>
    <p style="margin-left: 0.8rem;">HScore: ${highScore}</p>
    <p style="width: 1.6rem; padding: 0.4rem 0rem 0rem 0rem; height: 1.2rem; border-radius: 1rem; background-color: rgb(170, 120, 0); font-weight: 600; margin: 0.8rem 0rem 0rem 1.2rem; color: rgb(20,20,20); text-align: center; font-size: 0.8rem;">${coins}</p>`
}

function mouseClicked(){
    if(mouseY < height - (16*3.2)){
        f = true
        c = true
        if(dests.length == 2){
            dests.push(new Dest(floor(random(80,width - 80)),160 - floor(height/2),65))
        }
        // background(0)
    }
    
}

function shift(){
    if(count < floor(height/2) - 80){
        dests.forEach(e => {
            e.guards.forEach(el => {
                el.y += 10
            });
            e.y += 10
        });
        hero.y += 10
        count += 10
    }
    else{
        dests.splice(0,1)
        count = 0
        score += 1
        if(score > highScore){
            highScore = score
        }
        localStorage.setItem('high',JSON.stringify(highScore))
        c = false
    }
}

retry.addEventListener('click',() => {
    location.reload();
})

lvlup.addEventListener('click',()=>{
    if(level <= 4){
        if(coins >= JSON.parse(lvl.innerText)){
            coins -= JSON.parse(lvl.innerText)
            lvl.innerText = JSON.parse(lvl.innerText) + 10
            level += 1
            hero.lvluped()
            localStorage.setItem('lvl',JSON.stringify(level))
            localStorage.setItem('coin',JSON.stringify(coins))
        }
    }
    if(level == 5){
        lvl.innerText = 'MAX'
    }
})