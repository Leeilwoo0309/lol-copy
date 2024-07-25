game.style.cursor = 'pointer';

body.addEventListener('keydown', (e) => {
    if (keyDown[e.key.toLowerCase()] === false) {
        keyDown[e.key.toLowerCase()] = true;
    } else if (e.key == ' ') keyDown.space = true;
});

body.addEventListener('keyup', (e) => {
    if (keyDown[e.key.toLowerCase()] === true)
        keyDown[e.key.toLowerCase()] = false;
    else if (e.key == ' ') keyDown.space = false;
});

body.addEventListener('mousemove', e => {
    absolutePointerPosition.x = e.clientX + cameraPosition.x;
    absolutePointerPosition.y = -e.clientY - cameraPosition.y;

    // keyDown.arrowright = false;
    // keyDown.arrowdown = false;
    // keyDown.arrowleft = false;
    // keyDown.arrowup = false;

    // if (e.clientX < window.innerWidth * 0.1) keyDown.arrowleft = true;
    // if (e.clientX > window.innerWidth * 0.9) keyDown.arrowright = true;
    // if (e.clientY < window.innerHeight * 0.13) keyDown.arrowup = true;
    // if (e.clientY > window.innerHeight * 0.8) keyDown.arrowdown = true;
});

body.addEventListener('mousedown', (e) => {
    keyDown.mouse[e.button] = true;
});

body.addEventListener('mouseup', (e) => {
    keyDown.mouse[e.button] = false;
});

async function getCharInfo() {
    return await fetch(`http://localhost:1973/getChar?char=teacher`)
        .then(r => r.json())
        .then(result => result.body.defaultSpec);
}

async function setCharInfo() {
    players.ally.specINIT = await getCharInfo();
    players.ally.hp[0] = players.ally.specINIT.health;
    players.ally.hp[1] = players.ally.specINIT.health;
}

setCharInfo();