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

let state = initialState({
    areaWidth: gameArea.offsetWidth,
    attackWidth: 40,
    bugWidth: 60,
    bugHeight: 60
});

function onGameStart(e) {
    e.currentTarget.classList.add('hide');

    const wizard = document.createElement('div');
    wizard.classList.add('wizard');
    wizard.style.top = state.player.y + 'px';
    wizard.style.left = state.player.x + 'px';
    gameArea.appendChild(wizard);

    // These 2 must be set at initialState! - refactor later
    state.player.width = wizard.offsetWidth;
    state.player.heigth = wizard.offsetHeight;

    state.player.w = wizard.offsetWidth;
    state.player.h = wizard.offsetHeight;

    window.requestAnimationFrame(frame(0));
}

// Curring explanation for current context - Analogues
// const draw = (t1) => (t1) {
//     // Code...
//     return ...
// }
// ------------- OR -------------
// function draw(t1) {
//     return function (t2) {
//         // Code...
//     }
// }
// ------------- OR-------------
// let returnedFunc = draw(0);
// returnedFunc(100)
// ------------- OR-------------
// draw(0)(100)

// const draw = (t1) => function (timestamp) { // Or this
const frame = t1 => timestamp => { // t1 is the last time at which the game frame was updated; timestapm is the current time; everything is in ms
    if (timestamp - t1 > game.frameLength) {
        // Render (draw) the new frame
        state = next(state); // Update the state on every frame draw
        draw(timestamp, state);
        // if (state.scene.isActiveGame) return;
        state.scene.isActiveGame && window.requestAnimationFrame(frame(timestamp)); // If the first is true, then execute the after '&&'
    } else {
        // Call the next frame without calling anything
        window.requestAnimationFrame(frame(t1));
    }
}


function draw(timestamp, state) { // Game loop; get the new state as param

    const wizard = document.querySelector('.wizard');

    state.scene.score++;

    // Add bugs - antagonists (bad guys)
    if (timestamp - state.scene.lastBugSpawn > game.bugSpawnInterval + 10 * Math.random()) {
        let bug = document.createElement('div');
        bug.classList.add('bug');
        bug.x = gameArea.offsetWidth - (60);
        bug.style.left = bug.x + 'px';
        bug.style.top = (gameArea.offsetHeight - 60) * Math.random() + 'px'; // Spawn bugs at different hight levels - more natural looking

        gameArea.appendChild(bug);
        state.scene.lastBugSpawn = timestamp;

        state.bugs.push({
            x: gameArea.offsetWidth - 60,
            y: (gameArea.offsetHeight - 60) * Math.random(),
            w: bug.offsetWidth, 
            h: bug.offsetHeight,
            el: bug
        });
    }

    // Add clouds in background - imitate forward player movement
    if (timestamp - state.scene.lastCloudSpawn > game.cloudSpawnInterval + 10 * Math.random()) {
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        cloud.x = gameArea.offsetWidth - (200);
        cloud.style.left = cloud.x + 'px';
        cloud.style.top = (gameArea.offsetHeight - 200) * Math.random() + 'px'; // Spawn clouds at different hight levels - more natural looking

        gameArea.appendChild(cloud);
        state.scene.lastCloudSpawn = timestamp;
        
        state.clouds.push({
            x: gameArea.offsetWidth - (200),
            y: (gameArea.offsetHeight - 200) * Math.random() + 'px',
            w: cloud.offsetWidth,
            h: cloud.offsetHeight,
            el: cloud
        });
    }

    // Modify bug positions
    let bugs = document.querySelectorAll('.bug');
    // bugs.forEach(bug => {
    //     bug.x -= game.speed * 6;
    //     bug.style.left = bug.x + 'px';

    //     if (bug.x + bug.offsetWidth <= 0) {
    //         bug.remove();
    //     }
    // });

    state.bugs.forEach(b => b.el.style.left = b.x + 'px');

    // Modify cloud positions
    let clouds = document.querySelectorAll('.cloud');
    // clouds.forEach(cloud => {
    //     cloud.x -= game.speed;
    //     cloud.style.left = cloud.x + 'px';

    //     if (cloud.x + cloud.offsetWidth <= 0) {
    //         cloud.remove();
    //     }
    // });
    state.clouds.forEach(c => c.el.style.left = c.x + 'px');

    // Modify fireballs positions
    let fireballs = document.querySelectorAll('.fireball');
    // fireball.x += game.speed * game.fireballMultiplier;
    // fireball.style.left = fireball.x + 'px';

    // fireballs.forEach(fireball => {
    //     if (fireball.x + fireball.offsetWidth > gameArea.offsetWidth) {
    //         fireball.remove();
    //     }
    // });
    state.attacks.forEach(a => a.el.style.left = a.x + 'px');

    // Apply gravitation
    let isInAir = state.player.y + state.player.heigth <= gameArea.offsetHeight;
    if (isInAir) {
        state.player.y += game.speed;
    }

    // Register user inpput
    if (keys.ArrowUp && state.player.y > 0) {
        state.player.y -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowDown && isInAir) {
        state.player.y += game.speed * game.movingMultiplier;
    }

    if (keys.ArrowLeft && state.player.x > 0) {
        state.player.x -= game.speed * game.movingMultiplier;
    }

    if (keys.ArrowRight && state.player.x + state.player.width < gameArea.offsetWidth) {
        state.player.x += game.speed * game.movingMultiplier;
    }

    // Fire with space
    if (keys.Space && timestamp - state.player.lastTimeFiredFireball > game.fireInterval) {
        wizard.classList.add('wizard-fire');
        // Add fireball
        addFireball(state);
        state.player.lastTimeFiredFireball = timestamp;
        isCollision(wizard, wizard);
    } else {
        wizard.classList.remove('wizard-fire');
    }


    // ! Collision detection !
    bugs.forEach(bug => {
        // if (isCollision(wizard, bug)) {
        //     gameOverAction();
        // }

        fireballs.forEach(fireball => {
            if (isCollision(fireball, bug)) {
                state.scene.score += game.bugKillBonus;
                bug.remove();
                fireball.remove();
            }
        })
    });

    // Apply movement
    wizard.style.top = state.player.y + 'px';
    wizard.style.left = state.player.x + 'px';

    //Apply score
    gamePoints.textContent = state.scene.score;
}