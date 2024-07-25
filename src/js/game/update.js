var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
setInterval(function () {
    players.ally.selector.style.left = "".concat(absolutePosition.ally.x - cameraPosition.x, "px");
    players.ally.selector.style.top = "".concat(-absolutePosition.ally.y - cameraPosition.y, "px");
    players.enemy.selector.style.left = "".concat(absolutePosition.enemy.x - cameraPosition.x, "px");
    players.enemy.selector.style.top = "".concat(-absolutePosition.enemy.y - cameraPosition.y, "px");
    // body.style.backgroundPositionX = `${ -1 * cameraPosition.x }px`;
    // body.style.backgroundPositionY = `${ -1 * cameraPosition.y }px`;
    statusDiv.style.left = "".concat(window.innerWidth / 2 - 300, "px");
    itemsDiv.style.left = "".concat(window.innerWidth / 2 + 300, "px");
    itemsDiv.children[6].innerHTML = "<p id=\"gold\">G".concat(players.ally.gold, "</p>");
    specDiv.style.left = "".concat(window.innerWidth / 2 - 470, "px");
    specDiv.innerHTML = "\n        <p>\uACF5\uACA9\uB825: ".concat(players.ally.spec.ad, "</p>\n        <p>\uACF5\uACA9 \uC18D\uB3C4: ").concat(players.ally.spec.atkspd, "</p>\n        <p>\uBC29\uC5B4\uB825: ").concat(players.ally.spec.armor, "</p>\n        <p>\uC0AC\uAC70\uB9AC: ").concat(players.ally.spec.range, "</p>\n        <p>\uC774\uB3D9\uC18D\uB3C4: ").concat(players.ally.spec.moveSpd, "</p> \n        <p>\uCE58\uBA85\uD0C0 \uD655\uB960: ").concat(players.ally.spec.criticP, "%</p>\n        <p>\uC0DD\uBA85\uB825 \uD761\uC218: ").concat(players.ally.spec.vamp, "%</p>\n        <p>\uCD08\uB2F9 \uCCB4\uB825 \uD68C\uBCF5: ").concat(players.ally.spec.healthBoost, "</p>\n    ");
    players.ally.spec = {
        ad: players.ally.specINIT.ad + players.ally.specItem.ad,
        atkspd: Math.floor(players.ally.specINIT.atkspd * (1 + Math.floor(players.ally.specItem.atkspd) / 100) * 100) / 100,
        armor: players.ally.specINIT.armor + players.ally.specItem.armor,
        range: players.ally.specINIT.range + players.ally.specItem.range,
        moveSpd: players.ally.specINIT.moveSpd + players.ally.specItem.moveSpd,
        criticD: players.ally.specINIT.criticD + players.ally.specItem.criticD,
        criticP: players.ally.specINIT.criticP + players.ally.specItem.criticP,
        health: players.ally.specINIT.health + players.ally.specItem.health,
        healthBoost: players.ally.specINIT.healthBoost + players.ally.specItem.healthBoost,
        projectileSpd: players.ally.specINIT.projectileSpd,
        vamp: players.ally.specINIT.vamp + players.ally.specItem.vamp
    };
    document.querySelector('#now-hp').innerHTML = "".concat(Math.floor(players.ally.hp[1]), " / ").concat(players.ally.hp[0]);
    hpProgressBars.forEach(function (e) {
        if (e.className.indexOf('ally') >= 0) {
            e.style.width = "".concat(players.ally.hp[1] / players.ally.hp[0] * 100, "%");
        }
        else {
            e.style.width = "".concat(players.enemy.hp[1] / players.enemy.hp[0] * 100, "%");
        }
    });
    shopBtn.addEventListener('click', function () { shopOpen(); });
    players.ally.items.forEach(function (e, i) {
        if (e !== undefined) {
            var item = document.querySelector("#vault-".concat(i + 1));
            item.style.backgroundImage = "url(./assets/items/".concat(e.name[1], ".png)");
            item.style.backgroundSize = "40px";
        }
    });
    var position = {
        x: parseFloat(players.ally.selector.style.left),
        y: parseFloat(players.ally.selector.style.top)
    };
    if (!checkCollide(position)) {
        if ((keyDown.d) && (keyDown.w)) {
            players.ally.selector.style.left = "".concat(position.x + (players.ally.spec.moveSpd / Math.SQRT2), "px");
            players.ally.selector.style.top = "".concat(position.y - (players.ally.spec.moveSpd / Math.SQRT2), "px");
            absolutePosition.ally.x += players.ally.spec.moveSpd / Math.SQRT2;
            absolutePosition.ally.y += players.ally.spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x += players.ally.spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y += players.ally.spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.d) && (keyDown.s)) {
            players.ally.selector.style.left = "".concat(position.x + (players.ally.spec.moveSpd / Math.SQRT2), "px");
            players.ally.selector.style.top = "".concat(position.y + (players.ally.spec.moveSpd / Math.SQRT2), "px");
            absolutePosition.ally.x += players.ally.spec.moveSpd / Math.SQRT2;
            absolutePosition.ally.y -= players.ally.spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x += players.ally.spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y -= players.ally.spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.a) && (keyDown.w)) {
            players.ally.selector.style.left = "".concat(position.x - (players.ally.spec.moveSpd / Math.SQRT2), "px");
            players.ally.selector.style.top = "".concat(position.y - (players.ally.spec.moveSpd / Math.SQRT2), "px");
            absolutePosition.ally.x -= players.ally.spec.moveSpd / Math.SQRT2;
            absolutePosition.ally.y += players.ally.spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x -= players.ally.spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y += players.ally.spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.a) && (keyDown.s)) {
            players.ally.selector.style.left = "".concat(position.x - (players.ally.spec.moveSpd / Math.SQRT2), "px");
            players.ally.selector.style.top = "".concat(position.y + (players.ally.spec.moveSpd / Math.SQRT2), "px");
            absolutePosition.ally.x -= players.ally.spec.moveSpd / Math.SQRT2;
            absolutePosition.ally.y -= players.ally.spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x -= players.ally.spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y -= players.ally.spec.moveSpd / Math.SQRT2;
        }
        else if (keyDown.w) {
            players.ally.selector.style.top = "".concat(position.y - players.ally.spec.moveSpd, "px");
            absolutePosition.ally.y += players.ally.spec.moveSpd;
            absolutePointerPosition.y += players.ally.spec.moveSpd;
        }
        else if (keyDown.s) {
            players.ally.selector.style.top = "".concat(position.y + players.ally.spec.moveSpd, "px");
            absolutePosition.ally.y -= players.ally.spec.moveSpd;
            absolutePointerPosition.y -= players.ally.spec.moveSpd;
        }
        else if (keyDown.a) {
            players.ally.selector.style.left = "".concat(position.x - players.ally.spec.moveSpd, "px");
            absolutePosition.ally.x -= players.ally.spec.moveSpd;
            absolutePointerPosition.x -= players.ally.spec.moveSpd;
        }
        else if (keyDown.d) {
            players.ally.selector.style.left = "".concat(position.x + players.ally.spec.moveSpd, "px");
            absolutePosition.ally.x += players.ally.spec.moveSpd;
            absolutePointerPosition.x += players.ally.spec.moveSpd;
        }
    }
    gameObjects.forEach(function (e) {
        e.position = { x: e.INIT.position.x - cameraPosition.x, y: e.INIT.position.y - cameraPosition.y };
    });
    if (absolutePosition.ally.x < 0) {
        absolutePosition.ally.x = 0;
    }
    if (absolutePosition.ally.x > 4400 - players.ally.size) {
        absolutePosition.ally.x = 4400 - players.ally.size;
    }
    if (absolutePosition.ally.y > 1606) {
        absolutePosition.ally.y = 1606;
        players.ally.selector.style.top = "1606px";
    }
    if (absolutePosition.ally.y < -668) {
        absolutePosition.ally.y = -668;
        players.ally.selector.style.top = "668px";
    }
    cameraPosition.x = absolutePosition.ally.x - window.innerWidth * 0.5 + players.ally.size / 2;
    cameraPosition.y = -absolutePosition.ally.y - window.innerHeight * 0.5 + players.ally.size;
    if (cameraPosition.x < 0)
        cameraPosition.x = 0; // 2480
    if (cameraPosition.x > 4400 - window.innerWidth)
        cameraPosition.x = 4400 - window.innerWidth;
    if (cameraPosition.y < -900)
        cameraPosition.y = -900;
    if (cameraPosition.y > 0)
        cameraPosition.y = 0;
    if (players.ally.hp[1] > players.ally.hp[0])
        players.ally.hp[1] = players.ally.hp[0];
    if (keyDown.mouse[0] && atkWait === 0) {
        atkWait = 1 / players.ally.spec.atkspd * 100;
        var angle = Math.atan2(absolutePosition.ally.y - absolutePointerPosition.y, absolutePosition.ally.x - absolutePointerPosition.x);
        projectiles.a.push(new ProjectileBuilder()
            .setDamage(10)
            .setDegree(angle)
            .setReach(players.ally.spec.range)
            .setSpeed(players.ally.spec.projectileSpd)
            .build("ally"));
    }
    var newProjectiles = [];
    projectiles.a.forEach(function (e) {
        if (e.isArrive) {
            newProjectiles.push(e);
        }
    });
    projectiles.a = __spreadArray([], newProjectiles, true);
    var sendData = {
        pos: absolutePosition.ally,
        projectiles: projectiles.a,
        hp: players.ally.hp
    };
    socket.send(JSON.stringify({ body: sendData }));
    projectiles.a.forEach(function (e) {
        e.isSent = true;
    });
}, 16);
setInterval(function () {
    if (atkWait > 0)
        atkWait -= 1;
    if (atkWait < 0)
        atkWait = 0;
}, 10);
setInterval(function () {
    if (players.ally.hp[1] < players.ally.hp[0]) {
        players.ally.hp[1] += players.ally.spec.healthBoost;
    }
}, 1000);
function checkCollide(position) {
    var collideChecker = document.querySelector('.checker.player');
    var ret = false;
    collideChecker.style.position = 'absolute';
    collideChecker.style.backgroundColor = 'red';
    // collideChecker.style.height = `${ players.ally.size * 2 }px`;
    // collideChecker.style.width = `${ players.ally.size * 2 }px`;
    collideChecker.style.left = "".concat(position.x, "px");
    collideChecker.style.top = "".concat(position.y, "px");
    if ((keyDown.d) && (keyDown.w)) {
        collideChecker.style.left = "".concat(position.x + (players.ally.spec.moveSpd * 2), "px");
        collideChecker.style.top = "".concat(position.y - (players.ally.spec.moveSpd * 2), "px");
    }
    else if ((keyDown.d) && (keyDown.s)) {
        collideChecker.style.left = "".concat(position.x + (players.ally.spec.moveSpd * 2), "px");
        collideChecker.style.top = "".concat(position.y + (players.ally.spec.moveSpd * 2), "px");
    }
    else if ((keyDown.a) && (keyDown.w)) {
        collideChecker.style.left = "".concat(position.x - (players.ally.spec.moveSpd * 2), "px");
        collideChecker.style.top = "".concat(position.y - (players.ally.spec.moveSpd * 2), "px");
    }
    else if ((keyDown.a) && (keyDown.s)) {
        collideChecker.style.left = "".concat(position.x - (players.ally.spec.moveSpd * 2), "px");
        collideChecker.style.top = "".concat(position.y + (players.ally.spec.moveSpd * 2), "px");
    }
    else if (keyDown.w)
        collideChecker.style.top = "".concat(position.y - (players.ally.spec.moveSpd * 2), "px");
    else if (keyDown.s)
        collideChecker.style.top = "".concat(position.y + (players.ally.spec.moveSpd * 2), "px");
    else if (keyDown.a)
        collideChecker.style.left = "".concat(position.x - (players.ally.spec.moveSpd * 2), "px");
    else if (keyDown.d)
        collideChecker.style.left = "".concat(position.x + (players.ally.spec.moveSpd * 2), "px");
    gameObjects.forEach(function (e, i) {
        if (e.isCollide(collideChecker)) {
            ret = true;
        }
    });
    return ret;
}
// function checkCollide(position: Position) {
//     gameObjects.forEach((e, i) => {
//         e.position = {x: e.INIT.position.x - cameraPosition.x, y: e.INIT.position.y - cameraPosition.y}
//         const PI = Math.PI;
//         if (e.isCollide(players.ally.selector)) {
//             if (angle < -PI * 2 / 3 || angle > PI * 3 / 4) {
//                 //위쪽 충돌 (w)
//                 players.ally.selector.style.top = `${ e.position.y + e.size.height + 2}px`;
//                 absolutePosition.ally.y -= players.ally.spec.moveSpd;
//                 console.log('W');
//             } else if (angle < PI * 3 / 4 && angle > PI / 4) {
//                 // 좌측 충돌 (a)
//                 players.ally.selector.style.top = `${ e.position.y - players.ally.size - 2}px`;
//                 absolutePosition.ally.y += players.ally.spec.moveSpd;
//                 console.log('A');
//             } else if ((angle < PI / 4 && angle > 0) || (angle < 0 && angle > PI / -4)) {
//                 // 하단 충돌 (s)
//                 players.ally.selector.style.left = `${ e.position.x + e.size.width + 2}px`;
//                 absolutePosition.ally.x += players.ally.spec.moveSpd;
//                 console.log('S');
//             } else if (angle < -PI / 4 && angle > -PI * 2 / 3) {
//                 // 우측 충돌 (d)
//                 players.ally.selector.style.left = `${ e.position.x - players.ally.size - 2 }px`;
//                 absolutePosition.ally.x -= players.ally.spec.moveSpd;
//                 console.log('D');
//             }
//         }
//     })
// }
