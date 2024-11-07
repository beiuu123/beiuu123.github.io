const gameContainer = document.getElementById('game-container');
const resultDiv = document.getElementById('result');
let character;
let monster;
let library;
let temple = null;
let treasure;
let cave = null;
let characterX = 0;
let characterY = 0;
let libraryTriggered = false;
let monsterTriggered = false;
let templeTriggered = false;
let treasureTriggered = false;
let caveTriggered = false;

async function setupGame() {
    // 清除之前的小球、图书馆、神庙、宝藏和洞穴
    if (character) character.remove();
    if (monster) monster.remove();
    if (library) library.remove();
    if (temple) {
        temple.remove();
        temple = null;
    }
    if (treasure) {
        treasure.remove();
        treasureTriggered = false;
    }
    if (cave) cave.remove();

    character = document.createElement('div');
    character.classList.add('character');
    // 设置初始位置
    character.style.left = 0;
    character.style.top = 0;
    gameContainer.appendChild(character);

    monster = document.createElement('div');
    monster.classList.add('monster');
    monster.style.left = Math.random() * (gameContainer.clientWidth - 20) + 'px';
    monster.style.top = Math.random() * (gameContainer.clientHeight - 20) + 'px';
    gameContainer.appendChild(monster);

    library = document.createElement('div');
    library.classList.add('library');
    library.style.left = Math.random() * (gameContainer.clientWidth - 40) + 'px';
    library.style.top = Math.random() * (gameContainer.clientHeight - 40) + 'px';
    gameContainer.appendChild(library);

    resultDiv.innerHTML = '';

    // 重置触发状态和位置变量
    libraryTriggered = false;
    monsterTriggered = false;
    templeTriggered = false;
    treasureTriggered = false;
    caveTriggered = false;
    characterX = 0;
    characterY = 0;
}

async function handleKeydown(event) {
    if (!character) return;

    switch (event.key) {
        case 'ArrowUp':
            if (characterY > 0) characterY -= 5;
            break;
        case 'ArrowDown':
            if (characterY < gameContainer.clientHeight - 20) characterY += 5;
            break;
        case 'ArrowLeft':
            if (characterX > 0) characterX -= 5;
            break;
        case 'ArrowRight':
            if (characterX < gameContainer.clientWidth - 20) characterX += 5;
            break;
    }
    character.style.left = characterX + 'px';
    character.style.top = characterY + 'px';

    if (await isColliding(character, monster) && !monsterTriggered) {
        resultDiv.innerHTML = '<p style="color: red;">糟糕！遇到了神庙守卫！任务失败。</p>';
        monsterTriggered = true;
        await delay(2000);
        return setupGame();
    } else if (await isColliding(character, library) && !libraryTriggered) {
        resultDiv.innerHTML = '<p>在古老的图书馆里找到了第一个线索...</p>';
        libraryTriggered = true;
        const random = Math.random();
        if (random < 0.1) {
            resultDiv.innerHTML += '<p style="color: red;">没有线索可以解码!</p>';
        } else {
            resultDiv.innerHTML += '<p>解码成功!宝藏在一座古老的神庙中...</p>';
            const caveChance = Math.random();
            if (caveChance < 0.3) {
                generateCave();
            }
            generateTemple();
        }
    } else if (temple && await isColliding(character, temple) && !templeTriggered) {
        const random = Math.random();
        if (random < 0.1) {
            resultDiv.innerHTML += '<p style="color: red;">糟糕!遇到了神庙守卫!</p>';
            resultDiv.innerHTML += '<p style="color: red;">任务失败。</p>';
            templeTriggered = true;
            temple.remove();
            await delay(2000);
            return setupGame();
        } else {
            resultDiv.innerHTML += '<p>找到了一个神秘的箱子...</p>';
            generateTreasure();
            // 设置神庙已被触发标志，防止再次触发
            templeTriggered = true;
        }
    } else if (await isColliding(character, treasure) && !treasureTriggered) {
        resultDiv.innerHTML += '<p>恭喜!你找到了传说中的宝藏!</p>';
        treasureTriggered = true;
        if (treasure) {
            treasure.style.display = 'none';
        }
        const showImageChance = Math.random();
        if (showImageChance < 0.9) {
            const treasureImage = document.createElement('img');
            treasureImage.classList.add('treasure-image');
            treasureImage.src = 'your-treasure-image-url.jpg';
            gameContainer.appendChild(treasureImage);
        }
    } else if (await isColliding(character, cave) && !caveTriggered) {
        resultDiv.innerHTML += '<p>发现了一个神秘洞穴...</p>';
        caveTriggered = true;
        const caveChance = Math.random();
        if (caveChance < 0.1) {
            resultDiv.innerHTML += '<p>在洞穴中找到了额外的宝藏线索！</p>';
        } else {
            resultDiv.innerHTML += '<p>洞穴中什么也没有。</p>';
        }
    }
}

function isColliding(element1, element2) {
    return new Promise((resolve) => {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        // 计算两个元素的半径（对于圆形和方形的简单处理）
        const radius1 = element1.offsetWidth / 2;
        const radius2 = element2.offsetWidth / 2;
        // 计算两个元素中心的坐标
        const centerX1 = rect1.left + radius1;
        const centerY1 = rect1.top + radius1;
        const centerX2 = rect2.left + radius2;
        const centerY2 = rect2.top + radius2;
        // 计算两个元素中心之间的距离
        const distance = Math.sqrt((centerX2 - centerX1) ** 2 + (centerY2 - centerY1) ** 2);
        // 如果距离小于两个半径之和，则发生碰撞
        resolve(distance < radius1 + radius2);
    });
}

function generateTemple() {
    if (!templeTriggered && !temple) {
        temple = document.createElement('div');
        temple.classList.add('temple');
        temple.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
        temple.style.top = Math.random() * (gameContainer.clientHeight - 30) + 'px';
        gameContainer.appendChild(temple);
    }
}

function generateTreasure() {
    if (!treasureTriggered) {
        treasure = document.createElement('div');
        treasure.classList.add('treasure');
        treasure.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
        treasure.style.top = Math.random() * (gameContainer.clientHeight - 30) + 'px';
        gameContainer.appendChild(treasure);
    }
}

function generateCave() {
    if (!caveTriggered && !cave) {
        cave = document.createElement('div');
        cave.classList.add('cave');
        cave.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
        cave.style.top = Math.random() * (gameContainer.clientHeight - 30) + 'px';
        gameContainer.appendChild(cave);
    }
}

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

document.addEventListener('keydown', handleKeydown);
document.getElementById('startButton').addEventListener('click', setupGame);
