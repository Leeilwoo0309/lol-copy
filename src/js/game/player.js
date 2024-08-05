function move(position) {
    if (!checkCollide(position) && readyStatus[getEnemyTeam()] && canMove) {
        if ((keyDown.d) && (keyDown.w)) {
            players[team].selector.style.left = "".concat(position.x + (players[team].spec.moveSpd / Math.SQRT2), "px");
            players[team].selector.style.top = "".concat(position.y - (players[team].spec.moveSpd / Math.SQRT2), "px");
            absolutePosition[team].x += players[team].spec.moveSpd / Math.SQRT2;
            absolutePosition[team].y += players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x += players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y += players[team].spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.d) && (keyDown.s)) {
            players[team].selector.style.left = "".concat(position.x + (players[team].spec.moveSpd / Math.SQRT2), "px");
            players[team].selector.style.top = "".concat(position.y + (players[team].spec.moveSpd / Math.SQRT2), "px");
            absolutePosition[team].x += players[team].spec.moveSpd / Math.SQRT2;
            absolutePosition[team].y -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x += players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y -= players[team].spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.a) && (keyDown.w)) {
            players[team].selector.style.left = "".concat(position.x - (players[team].spec.moveSpd / Math.SQRT2), "px");
            players[team].selector.style.top = "".concat(position.y - (players[team].spec.moveSpd / Math.SQRT2), "px");
            absolutePosition[team].x -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePosition[team].y += players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y += players[team].spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.a) && (keyDown.s)) {
            players[team].selector.style.left = "".concat(position.x - (players[team].spec.moveSpd / Math.SQRT2), "px");
            players[team].selector.style.top = "".concat(position.y + (players[team].spec.moveSpd / Math.SQRT2), "px");
            absolutePosition[team].x -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePosition[team].y -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y -= players[team].spec.moveSpd / Math.SQRT2;
        }
        else if (keyDown.w) {
            players[team].selector.style.top = "".concat(position.y - players[team].spec.moveSpd, "px");
            absolutePosition[team].y += players[team].spec.moveSpd;
            absolutePointerPosition.y += players[team].spec.moveSpd;
        }
        else if (keyDown.s) {
            players[team].selector.style.top = "".concat(position.y + players[team].spec.moveSpd, "px");
            absolutePosition[team].y -= players[team].spec.moveSpd;
            absolutePointerPosition.y -= players[team].spec.moveSpd;
        }
        else if (keyDown.a) {
            players[team].selector.style.left = "".concat(position.x - players[team].spec.moveSpd, "px");
            absolutePosition[team].x -= players[team].spec.moveSpd;
            absolutePointerPosition.x -= players[team].spec.moveSpd;
        }
        else if (keyDown.d) {
            players[team].selector.style.left = "".concat(position.x + players[team].spec.moveSpd, "px");
            absolutePosition[team].x += players[team].spec.moveSpd;
            absolutePointerPosition.x += players[team].spec.moveSpd;
        }
    }
}
function checkCollide(position) {
    var collideChecker = document.querySelector('.checker.player');
    var ret = false;
    collideChecker.style.position = 'absolute';
    collideChecker.style.backgroundColor = 'red';
    collideChecker.style.left = "".concat(position.x, "px");
    collideChecker.style.top = "".concat(position.y, "px");
    if ((keyDown.d) && (keyDown.w)) {
        collideChecker.style.left = "".concat(position.x + (players[team].spec.moveSpd * 2), "px");
        collideChecker.style.top = "".concat(position.y - (players[team].spec.moveSpd * 2), "px");
    }
    else if ((keyDown.d) && (keyDown.s)) {
        collideChecker.style.left = "".concat(position.x + (players[team].spec.moveSpd * 2), "px");
        collideChecker.style.top = "".concat(position.y + (players[team].spec.moveSpd * 2), "px");
    }
    else if ((keyDown.a) && (keyDown.w)) {
        collideChecker.style.left = "".concat(position.x - (players[team].spec.moveSpd * 2), "px");
        collideChecker.style.top = "".concat(position.y - (players[team].spec.moveSpd * 2), "px");
    }
    else if ((keyDown.a) && (keyDown.s)) {
        collideChecker.style.left = "".concat(position.x - (players[team].spec.moveSpd * 2), "px");
        collideChecker.style.top = "".concat(position.y + (players[team].spec.moveSpd * 2), "px");
    }
    else if (keyDown.w)
        collideChecker.style.top = "".concat(position.y - (players[team].spec.moveSpd * 2), "px");
    else if (keyDown.s)
        collideChecker.style.top = "".concat(position.y + (players[team].spec.moveSpd * 2), "px");
    else if (keyDown.a)
        collideChecker.style.left = "".concat(position.x - (players[team].spec.moveSpd * 2), "px");
    else if (keyDown.d)
        collideChecker.style.left = "".concat(position.x + (players[team].spec.moveSpd * 2), "px");
    gameObjects.forEach(function (e, i) {
        if (e.isCollide(collideChecker) && e.extra.canCollide) {
            ret = true;
        }
    });
    return ret;
}
function animation(_team) {
    var _a, _b, _c, _d, _e;
    if (((_a = players[_team].marker) === null || _a === void 0 ? void 0 : _a.ezreal) == true) {
        players[_team].selector.style.boxShadow = "rgb(235, 201, 54) 0px 0px 10px";
        players[_team].selector.style.border = "3px solid rgb(235, 201, 54)";
    }
    else if (((_b = players[_team].marker) === null || _b === void 0 ? void 0 : _b.ezreal) == false) {
        players[_team].selector.style.boxShadow = "";
        players[_team].selector.style.border = "";
    }
    if (((_c = players[_team].marker) === null || _c === void 0 ? void 0 : _c.vayne) == 1) {
        players[_team].selector.style.boxShadow = "rgb(0, 128, 255) 0px 0px 10px";
    }
    else if (((_d = players[_team].marker) === null || _d === void 0 ? void 0 : _d.vayne) == 2) {
        players[_team].selector.style.boxShadow = "rgb(255, 0, 0) 0px 0px 10px";
    }
    else if (((_e = players[_team].marker) === null || _e === void 0 ? void 0 : _e.vayne) == 0) {
        players[_team].selector.style.boxShadow = "";
        players[_team].selector.style.border = "";
    }
    if (players[_team].status.invisible && _team == team) {
        players[_team].selector.style.opacity = '20%';
    }
    else if (players[_team].status.invisible && _team !== team) {
        players[_team].selector.style.opacity = '0%';
    }
    else {
        players[_team].selector.style.opacity = '100%';
    }
    if (nexusHp[_team][1] <= 0 && isNexusAlive[_team]) {
        var nexusIndex_1 = { blue: [7, 8], red: [9, 10] };
        isNexusAlive[_team] = false;
        gameObjects[nexusIndex_1[_team][0]].objSelector.style.opacity = '0%';
        gameObjects[nexusIndex_1[_team][1]].objSelector.style.opacity = '0%';
        setTimeout(function () {
            gameObjects[nexusIndex_1[_team][0]].objSelector.style.display = 'none';
            gameObjects[nexusIndex_1[_team][1]].objSelector.style.display = 'none';
        }, 1000);
    }
}
function damageAlert(type, dmg, isCritical, target) {
    var parent = document.querySelector(".".concat(target, "-d"));
    var alerter = document.createElement('div');
    var textColor = {
        melee: 'rgb(227, 106, 14)',
        magic: 'rgb(14, 124, 227)',
        true: 'white'
    };
    if (Math.floor(dmg) == 0)
        return;
    alerter.innerHTML = "".concat(Math.floor(dmg));
    alerter.style.opacity = '100%';
    alerter.style.marginTop = "-".concat(Math.random() * 20 + 30, "px");
    alerter.style.marginLeft = "".concat(Math.random() * 50 - 20, "px");
    alerter.style.color = "".concat(textColor[type]);
    alerter.style.fontSize = "".concat(Math.log2(dmg * 4) + 15, "px");
    alerter.style.transition = 'opacity 700ms';
    alerter.style.position = 'fixed ';
    alerter.style.textShadow = "0px 0px 2px ".concat(textColor[type]);
    if (type === 'true')
        alerter.style.textShadow = '0px 0px 2px black';
    if (isCritical) {
        alerter.style.fontWeight = '800';
        alerter.innerHTML = "".concat(Math.floor(dmg), "!");
        alerter.style.fontSize = "".concat(Math.log2(dmg * 4) + 20, "px");
    }
    if (dmg == 9999 && type == 'true' && target != team) {
        players[team].gold += findItem('3_collector').body.extra[2];
        console.log("".concat(findItem('3_collector').body.extra[2], "\uC6D0 \uB4E4\uC5B4\uC634\u3145\u3145"));
    }
    else if (dmg == 9999 && type == 'true' && target == team) {
        death();
        socket.send(JSON.stringify({ body: { msg: "death" } }));
    }
    damageAmount[target] += dmg;
    parent.appendChild(alerter);
    setTimeout(function () {
        alerter.style.opacity = '0%';
    }, 300);
    setTimeout(function () {
        alerter.style.display = 'none';
        parent.removeChild(alerter);
    }, 1000);
}
