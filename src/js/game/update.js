setInterval(function () {
    players.ally.selector.style.left = "".concat(absolutePosition.ally.x - cameraPosition.x, "px");
    players.ally.selector.style.top = "".concat(-absolutePosition.ally.y - cameraPosition.y, "px");
    players.enemy.selector.style.left = "".concat(absolutePosition.enemy.x - cameraPosition.x, "px");
    players.enemy.selector.style.top = "".concat(-absolutePosition.enemy.y - cameraPosition.y, "px");
    body.style.backgroundPositionX = "".concat(-1 * cameraPosition.x, "px");
    body.style.backgroundPositionY = "".concat(-1 * cameraPosition.y, "px");
    var position = {
        x: parseFloat(players.ally.selector.style.left),
        y: parseFloat(players.ally.selector.style.top)
    };
    if ((keyDown.d) && (keyDown.w)) {
        players.ally.selector.style.left = "".concat(position.x + (players.ally.moveSpd / Math.SQRT2), "px");
        players.ally.selector.style.top = "".concat(position.y - (players.ally.moveSpd / Math.SQRT2), "px");
        absolutePosition.ally.x += players.ally.moveSpd / Math.SQRT2;
        absolutePosition.ally.y += players.ally.moveSpd / Math.SQRT2;
    }
    else if ((keyDown.d) && (keyDown.s)) {
        players.ally.selector.style.left = "".concat(position.x + (players.ally.moveSpd / Math.SQRT2), "px");
        players.ally.selector.style.top = "".concat(position.y + (players.ally.moveSpd / Math.SQRT2), "px");
        absolutePosition.ally.x += players.ally.moveSpd / Math.SQRT2;
        absolutePosition.ally.y -= players.ally.moveSpd / Math.SQRT2;
    }
    else if ((keyDown.a) && (keyDown.w)) {
        players.ally.selector.style.left = "".concat(position.x - (players.ally.moveSpd / Math.SQRT2), "px");
        players.ally.selector.style.top = "".concat(position.y - (players.ally.moveSpd / Math.SQRT2), "px");
        absolutePosition.ally.x -= players.ally.moveSpd / Math.SQRT2;
        absolutePosition.ally.y += players.ally.moveSpd / Math.SQRT2;
    }
    else if ((keyDown.a) && (keyDown.s)) {
        players.ally.selector.style.left = "".concat(position.x - (players.ally.moveSpd / Math.SQRT2), "px");
        players.ally.selector.style.top = "".concat(position.y + (players.ally.moveSpd / Math.SQRT2), "px");
        absolutePosition.ally.x -= players.ally.moveSpd / Math.SQRT2;
        absolutePosition.ally.y -= players.ally.moveSpd / Math.SQRT2;
    }
    else if (keyDown.w) {
        players.ally.selector.style.top = "".concat(position.y - players.ally.moveSpd, "px");
        absolutePosition.ally.y += players.ally.moveSpd;
    }
    else if (keyDown.s) {
        players.ally.selector.style.top = "".concat(position.y + players.ally.moveSpd, "px");
        absolutePosition.ally.y -= players.ally.moveSpd;
    }
    else if (keyDown.a) {
        players.ally.selector.style.left = "".concat(position.x - players.ally.moveSpd, "px");
        absolutePosition.ally.x -= players.ally.moveSpd;
    }
    else if (keyDown.d) {
        players.ally.selector.style.left = "".concat(position.x + players.ally.moveSpd, "px");
        absolutePosition.ally.x += players.ally.moveSpd;
    }
    checkCollide(position);
    gameObjects.forEach(function (e) {
        e.position = { x: e.INIT.position.x - cameraPosition.x, y: e.INIT.position.y - cameraPosition.y };
    });
    if (keyDown.space) {
        cameraPosition.x = absolutePosition.ally.x - window.innerWidth * 0.5 + players.ally.size / 2;
        cameraPosition.y = -absolutePosition.ally.y - window.innerHeight * 0.5 + players.ally.size;
    }
    if (keyDown.arrowright)
        cameraPosition.x += cameraSpd;
    if (keyDown.arrowleft)
        cameraPosition.x -= cameraSpd;
    if (keyDown.arrowup)
        cameraPosition.y -= cameraSpd;
    if (keyDown.arrowdown)
        cameraPosition.y += cameraSpd;
    if (absolutePosition.ally.x < 0) {
        absolutePosition.ally.x = 0;
        // players.ally.selector.style.left = `${  }px`;
    }
    if (absolutePosition.ally.y > 1606) {
        absolutePosition.ally.y = 1606;
        players.ally.selector.style.top = "1606px";
    }
    if (absolutePosition.ally.y < -668) {
        absolutePosition.ally.y = -668;
        players.ally.selector.style.top = "668px";
    }
    if (cameraPosition.x < 0)
        cameraPosition.x = 0;
    if (cameraPosition.x > 2480)
        cameraPosition.x = 2480;
    if (cameraPosition.y < -900)
        cameraPosition.y = -900;
    if (cameraPosition.y > 0)
        cameraPosition.y = 0;
}, 16);
function checkCollide(position) {
    gameObjects.forEach(function (e, i) {
        if (e.isCollide(players.ally.selector)) {
            if ((keyDown.d) && (keyDown.w)) {
                players.ally.selector.style.left = "".concat(position.x - (players.ally.moveSpd / Math.SQRT2) - players.ally.moveSpd, "px");
                players.ally.selector.style.top = "".concat(position.y + (players.ally.moveSpd / Math.SQRT2) + players.ally.moveSpd, "px");
                absolutePosition.ally.x -= 2 * players.ally.moveSpd / Math.SQRT2;
                absolutePosition.ally.y -= 2 * players.ally.moveSpd / Math.SQRT2;
                return;
            }
            else if ((keyDown.d) && (keyDown.s)) {
                players.ally.selector.style.left = "".concat(position.x - (players.ally.moveSpd / Math.SQRT2) - players.ally.moveSpd, "px");
                players.ally.selector.style.top = "".concat(position.y - (players.ally.moveSpd / Math.SQRT2) - players.ally.moveSpd, "px");
                absolutePosition.ally.x -= 2 * players.ally.moveSpd / Math.SQRT2;
                absolutePosition.ally.y += 2 * players.ally.moveSpd / Math.SQRT2;
                return;
            }
            else if ((keyDown.a) && (keyDown.w)) {
                players.ally.selector.style.left = "".concat(position.x + (players.ally.moveSpd / Math.SQRT2) + players.ally.moveSpd, "px");
                players.ally.selector.style.top = "".concat(position.y + (players.ally.moveSpd / Math.SQRT2) + players.ally.moveSpd, "px");
                absolutePosition.ally.x += 2 * players.ally.moveSpd / Math.SQRT2;
                absolutePosition.ally.y -= 2 * players.ally.moveSpd / Math.SQRT2;
                return;
            }
            else if ((keyDown.a) && (keyDown.s)) {
                players.ally.selector.style.left = "".concat(position.x + (players.ally.moveSpd / Math.SQRT2) + players.ally.moveSpd, "px");
                players.ally.selector.style.top = "".concat(position.y - (players.ally.moveSpd / Math.SQRT2) - players.ally.moveSpd, "px");
                absolutePosition.ally.x += 2 * players.ally.moveSpd / Math.SQRT2;
                absolutePosition.ally.y += 2 * players.ally.moveSpd / Math.SQRT2;
                return;
            }
            else if (keyDown.w) {
                players.ally.selector.style.top = "".concat(e.position.y + e.size.height + players.ally.moveSpd, "px");
                absolutePosition.ally.y -= players.ally.moveSpd;
                return;
            }
            else if (keyDown.s) {
                players.ally.selector.style.top = "".concat(e.position.y - players.ally.size - players.ally.moveSpd, "px");
                absolutePosition.ally.y += players.ally.moveSpd;
                return;
            }
            else if (keyDown.a) {
                players.ally.selector.style.left = "".concat(e.position.x + e.size.width + players.ally.moveSpd, "px");
                absolutePosition.ally.x += players.ally.moveSpd;
                return;
            }
            else if (keyDown.d) {
                players.ally.selector.style.left = "".concat(e.position.x - players.ally.size - players.ally.moveSpd, "px");
                absolutePosition.ally.x -= players.ally.moveSpd;
                return;
            }
        }
    });
}
// function checkCollide(position: Position) {
//     gameObjects.forEach((e, i) => {
//         e.position = {x: e.INIT.position.x - cameraPosition.x, y: e.INIT.position.y - cameraPosition.y}
//         const PI = Math.PI;
//         if (e.isCollide(players.ally.selector)) {
//             if (angle < -PI * 2 / 3 || angle > PI * 3 / 4) {
//                 //위쪽 충돌 (w)
//                 players.ally.selector.style.top = `${ e.position.y + e.size.height + 2}px`;
//                 absolutePosition.ally.y -= players.ally.moveSpd;
//                 console.log('W');
//             } else if (angle < PI * 3 / 4 && angle > PI / 4) {
//                 // 좌측 충돌 (a)
//                 players.ally.selector.style.top = `${ e.position.y - players.ally.size - 2}px`;
//                 absolutePosition.ally.y += players.ally.moveSpd;
//                 console.log('A');
//             } else if ((angle < PI / 4 && angle > 0) || (angle < 0 && angle > PI / -4)) {
//                 // 하단 충돌 (s)
//                 players.ally.selector.style.left = `${ e.position.x + e.size.width + 2}px`;
//                 absolutePosition.ally.x += players.ally.moveSpd;
//                 console.log('S');
//             } else if (angle < -PI / 4 && angle > -PI * 2 / 3) {
//                 // 우측 충돌 (d)
//                 players.ally.selector.style.left = `${ e.position.x - players.ally.size - 2 }px`;
//                 absolutePosition.ally.x -= players.ally.moveSpd;
//                 console.log('D');
//             }
//         }
//     })
// }
