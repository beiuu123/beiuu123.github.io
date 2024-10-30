const para = document.querySelector('p');
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function randomColor() {
    const color = 'rgb(' +
        random(0, 255) + ',' +
        random(0, 255) + ',' +
        random(0, 255) + ')';
    return color;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
        if (this!== balls[j]) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size && balls[j].exists) {
                balls[j].color = this.color = randomColor();
            }
        }
    }
};
function ParticleSystem() {
    this.particles = [];
}

ParticleSystem.prototype.addParticle = function(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = new Particle(
            x,
            y,
            Math.random() * 3 + 1,
            randomColor(),
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            200
        );
        this.particles.push(particle);
    }
};

ParticleSystem.prototype.update = function() {
    this.particles.forEach(particle => {
        particle.x += particle.velX;
        particle.y += particle.velY;
        particle.life--;
    });
    this.particles = this.particles.filter(particle => particle.life > 0);
};

ParticleSystem.prototype.draw = function() {
    ctx.beginPath();
    this.particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
        ctx.fill();
    });
    ctx.closePath();
};


function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);

    this.color = 'white';
    this.size = 10;
    this.accelerationFactor = 2; // 加速度因子
    this.isAccelerated = false; // 标记是否加速
}


EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};

EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
        this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y += this.size;
    }
};


EvilCircle.prototype.setControls = function() {
    window.onkeydown = e => {
        if (e.key === 'Control') {
            this.isAccelerated = true;
        }
        switch (e.key) {
            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.x -= this.isAccelerated? this.velX * this.accelerationFactor : this.velX;
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.x += this.isAccelerated? this.velX * this.accelerationFactor : this.velX;
                break;
            case 'w':
            case 'W':
            case 'ArrowUp':
                this.y -= this.isAccelerated? this.velY * this.accelerationFactor : this.velY;
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                this.y += this.isAccelerated? this.velY * this.accelerationFactor : this.velY;
                break;
        }
    };

    window.onkeyup = e => {
        if (e.key === 'Control') {
            this.isAccelerated = false;
        }
    };
};

EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                count--;
                para.textContent = '剩余彩球数：' + count;
            }
        }
    }
};

const balls = [];

while (balls.length < 25) {
    const size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        randomColor(),
        size
    );
    balls.push(ball);
    count++;
    para.textContent = '剩余彩球数：' + count;
}

let evil = new EvilCircle(random(0, width), random(0, height), true);
evil.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    requestAnimationFrame(loop);
}

loop();
