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

    keyDown.arrowright = false;
    keyDown.arrowdown = false;
    keyDown.arrowleft = false;
    keyDown.arrowup = false;

    if (e.clientX < window.innerWidth * 0.1) keyDown.arrowleft = true;
    if (e.clientX > window.innerWidth * 0.9) keyDown.arrowright = true;
    if (e.clientY < window.innerHeight * 0.13) keyDown.arrowup = true;
    if (e.clientY > window.innerHeight * 0.8) keyDown.arrowdown = true;
});

body.addEventListener('mousedown', (e) => {
    keyDown.mouse[e.button] = true;
    isMove = true;

    playersHopePosition = {x: absolutePointerPosition.x - players.ally.size / 2, y: absolutePointerPosition.y + players.ally.size / 2};

    if (e.button == 2) {
        angle = Math.atan2(absolutePosition.ally.x - playersHopePosition.x, absolutePosition.ally.y - playersHopePosition.y);
        console.log(angle);
    }
});


body.addEventListener('mouseup', (e) => {
    keyDown.mouse[e.button] = false;
});