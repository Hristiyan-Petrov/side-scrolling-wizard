// Separation of concerns is a principle used in programming to separate an application into units,
// with minimal overlapping between the functions of the individual units. 
// The separation of concerns is achieved using modularization, encapsulation and arrangement in software layers.

// Include only logic, operatoins, calculations and exclude any visualization and DOM manipulations
// That means - Positioning, collision detecting
// Good practise to follow this method - devide different part from one another - leads to great code scaling
// Avoid spaghetti code - everything is mixed - as it is as of starting this Refactoring (everything is in one file)

let keys = {};

const initialState = () => ({ // Outer brackets in return are required for short-hand syntax for directly object returning
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
        lastBugSpawn: 0
    },
    clouds: [],
    attacks: [],
    bugs: []
});

const nextPlayer = state => state.player; // Function for rerendering the following
const nextScene = s => s.scene; // Function for rerendering the following
const nextClouds = s => s.clouds; // Function for rerendering the following
const nextAttacks = s => s.attacks; // Function for rerendering the following
const nextBugs = s => s.bugs; // Function for rerendering the following

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
