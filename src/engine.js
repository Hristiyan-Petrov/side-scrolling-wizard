// Separation of concerns is a principle used in programming to separate an application into units,
// with minimal overlapping between the functions of the individual units. 
// The separation of concerns is achieved using modularization, encapsulation and arrangement in software layers.

// Include only logic, operatoins, calculations and exclude any visualization and DOM manipulations
// That means - Positioning, collision detecting
// Good practise to follow this method - devide different part from one another - leads to great code scaling
// Avoid spaghetti code - everything is mixed - as it is as of starting this Refactoring (everything is in one file)

let keys = {};

const initialState = options => ({ // Outer brackets in return are required for short-hand syntax for directly object returning
    player: {
        x: 150,
        y: 150,
        width: 0,
        heigth: 0,
        lastTimeFiredFireball: 0
    },
    scene: scene = {
        isActiveGame: true,
        score: 0,
        lastCloudSpawn: 0, // time
        lastBugSpawn: 0,
        ...options

    },
    clouds: [],
    attacks: [],
    bugs: []
});

// Functions for rerendering the each of following
const nextPlayer = state => state.player;
const nextScene = s => s.scene;
const nextClouds = s => s.clouds;
const nextAttacks = s => s.attacks
    .filter(a => {
        // Remove out of boundaries or hit fireballs 
        if (a.x + s.scene.attackWidth > s.scene.areaWidth - 30) { // Same as (fireball.x + fireball.offsetWidth > gameArea.offsetWidth)
            removeEl(a.el);
            return false; // So it can be removed from the array
        }
        return true;
    })
    .map(a => ({ ...a, x: a.x + game.speed * game.fireballMultiplier })); // Create new object the same as a, but modified property 'x' 

const nextBugs = s => s.bugs
    .filter(b => {
        if (b.x + s.scene.bugWidth <= 0) {
            removeEl(b.el);
            return false;
        }
        return true;
    })
    .map(b => {
        b.x -= game.speed * 6;
        return b;
    });

const next = (state) => ({ // Outer brackets in return are required for short-hand syntax for directly object returning
    player: nextPlayer(state),
    scene: nextScene(state),
    clouds: nextClouds(state),
    attacks: nextAttacks(state),
    bugs: nextBugs(state)
});

function isCollision(firstElement, secondElement) {
    let firstRect = firstElement.getBoundingClientRect();
    let secondRect = secondElement.getBoundingClientRect();

    return !(firstRect.top > secondRect.bottom ||
        firstRect.bottom < secondRect.top ||
        firstRect.right < secondRect.left ||
        firstRect.left > secondRect.right);
}

function gameOverAction() {
    state.scene.isActiveGame = false;
    gameOver.classList.remove('hide');
}

function addFireball(state) {
    let fireball = document.createElement('div');

    // Set starting (spawning) position based on player position
    fireball.classList.add('fireball');
    fireball.style.top = (state.player.y + state.player.heigth / 3 - 5) + 'px';
    fireball.x = state.player.x + state.player.width;
    fireball.style.left = fireball.x + 'px';

    state.attacks.push({
        x: state.player.x, // + state.player.width;
        y: state.player.y + state.player.heigth / 3 - 5,
        el: fireball // Not good practise to include DOM element in the state but will do for now to save time. Can optimize it later
    });

    gameArea.appendChild(fireball);
}

function onKeyDown(e) {
    keys[e.code] = true;
}

function onKeyUp(e) {
    keys[e.code] = false;
}
