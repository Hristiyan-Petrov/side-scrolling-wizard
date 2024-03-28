// Separation of concerns is a principle used in programming to separate an application into units,
// with minimal overlapping between the functions of the individual units. 
// The separation of concerns is achieved using modularization, encapsulation and arrangement in software layers.

// Include only logic, operatoins, calculations and exclude any visualization and DOM manipulations
// That means - Positioning, collision detecting
// Good practise to follow this method - devide different part from one another - leads to great code scaling
// Avoid spaghetti code - everything is mixed - as it is as of starting this Refactoring (everything is in one file)

let keys = {};

let player = {
    x: 150,
    y: 150,
    width: 0,
    heigth: 0,
    lastTimeFiredFireball: 0
};

let game = {
    speed: 2,
    movingMultiplier: 4,
    fireballMultiplier: 5,
    fireInterval: 1000, // 1000 ms
    cloudSpawnInterval: 2500,
    bugSpawnInterval: 500,
    bugKillBonus: 2000
};

let scene = {
    isActiveGame: true,
    score: 0,
    lastCloudSpawn: 0, // time
    lastBugSpawn: 0
};

function isCollision(firstElement, secondElement) {
    let firstRect = firstElement.getBoundingClientRect();
    let secondRect = secondElement.getBoundingClientRect();

    return !(firstRect.top > secondRect.bottom ||
        firstRect.bottom < secondRect.top ||
        firstRect.right < secondRect.left ||
        firstRect.left > secondRect.right);
}

function gameOverAction() {
    scene.isActiveGame = false;
    gameOver.classList.remove('hide');
}

function addFireball(player) {
    let fireball = document.createElement('div');
    fireball.classList.add('fireball');

    // Set starting (spawning) position based on player position
    fireball.style.top = (player.y + player.heigth / 3 - 5) + 'px';
    fireball.x = player.x + player.width;
    fireball.style.left = fireball.x + 'px';
    gameArea.appendChild(fireball);
}

function onKeyDown(e) {
    keys[e.code] = true;
}

function onKeyUp(e) {
    keys[e.code] = false;
}
