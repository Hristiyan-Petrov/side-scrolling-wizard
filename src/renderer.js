// Separation of concerns is a principle used in programming to separate an application into units,
// with minimal overlapping between the functions of the individual units. 
// The separation of concerns is achieved using modularization, encapsulation and arrangement in software layers.

// Include visualization, DOM manipulations and exclude logic, operations, calculations (positioning, collision detecting)


const gameStart = document.querySelector('.game-start');
const gameArea = document.querySelector('.game-area');
const gameOver = document.querySelector('.game-over');
const gameScore = document.querySelector('.game-score');
const gamePoints = gameScore.querySelector('.points');

gameStart.addEventListener('click', onGameStart);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);



function onGameStart(e) {
    e.currentTarget.classList.add('hide');

    const wizard = document.createElement('div');
    wizard.classList.add('wizard');
    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';
    gameArea.appendChild(wizard);
    player.width = wizard.offsetWidth;
    player.heigth = wizard.offsetHeight;

    window.requestAnimationFrame(gameAction);

}

function gameAction(timestamp) { // Game loop
    const wizard = document.querySelector('.wizard');

    scene.score++;

    // Add bugs - antagonists (bad guys)
    if (timestamp - scene.lastBugSpawn > game.bugSpawnInterval + 10 * Math.random()) {
        let bug = document.createElement('div');
        bug.classList.add('bug');
        bug.x = gameArea.offsetWidth - (60);
        bug.style.left = bug.x + 'px';
        bug.style.top = (gameArea.offsetHeight - 60) * Math.random() + 'px'; // Spawn bugs at different hight levels - more natural looking

        gameArea.appendChild(bug);
        scene.lastBugSpawn = timestamp;
    }

    // Add clouds in background - imitate forward player movement
    if (timestamp - scene.lastCloudSpawn > game.cloudSpawnInterval + 10 * Math.random()) {
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.x = gameArea.offsetWidth - (200);
        cloud.style.left = cloud.x + 'px';
        cloud.style.top = (gameArea.offsetHeight - 200) * Math.random() + 'px'; // Spawn clouds at different hight levels - more natural looking

        gameArea.appendChild(cloud);
        scene.lastCloudSpawn = timestamp;
    }

    // Modify bug positions
    let bugs = document.querySelectorAll('.bug');
    bugs.forEach(bug => {
        bug.x -= game.speed * 6;
        bug.style.left = bug.x + 'px';

        if (bug.x + bug.offsetWidth <= 0) {
            bug.remove();
        }
    });

    // Modify cloud positions
    let clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
        cloud.x -= game.speed;
        cloud.style.left = cloud.x + 'px';

        if (cloud.x + cloud.offsetWidth <= 0) {
            cloud.remove();
        }
    });

    // Modify fireballs positions
    let fireballs = document.querySelectorAll('.fireball');
    fireballs.forEach(fireball => {
        fireball.x += game.speed * game.fireballMultiplier;
        fireball.style.left = fireball.x + 'px';

        if (fireball.x + fireball.offsetWidth > gameArea.offsetWidth) {
            fireball.remove();
        }
    });

    // Apply gravitation
    let isInAir = player.y + player.heigth <= gameArea.offsetHeight;
    if (isInAir) {
        player.y += game.speed;
    }

    // Register user inpput
    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowDown && isInAir) {
        player.y += game.speed * game.movingMultiplier;
    }

    if (keys.ArrowLeft && player.x > 0) {
        player.x -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowRight && player.x + player.width < gameArea.offsetWidth) {
        player.x += game.speed * game.movingMultiplier;
    }

    // Fire with space
    if (keys.Space && timestamp - player.lastTimeFiredFireball > game.fireInterval) {
        wizard.classList.add('wizard-fire');
        // Add fireball
        addFireball(player);
        player.lastTimeFiredFireball = timestamp;
        isCollision(wizard, wizard);
    } else {
        wizard.classList.remove('wizard-fire');
    }


    // ! Collision detection !
    bugs.forEach(bug => {
        if (isCollision(wizard, bug)) {
            gameOverAction();
        }

        fireballs.forEach(fireball => {
            if (isCollision(fireball, bug)) {
                scene.score += game.bugKillBonus;
                bug.remove();
                fireball.remove();
            }
        })
    });

    // Apply movement
    wizard.style.top = player.y + 'px';
    wizard.style.left = player.x + 'px';

    //Apply score
    gamePoints.textContent = scene.score;

    if (scene.isActiveGame) {
        window.requestAnimationFrame(gameAction);
    }
}

