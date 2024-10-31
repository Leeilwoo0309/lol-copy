function move(position) {
    if (!checkCollide(position) && readyStatus[getEnemyTeam()] && canMove) {
        if ((keyDown.d) && (keyDown.w)) {
            // players[team].selector.style.left = `${ position.x + (players[team].spec.moveSpd / Math.SQRT2) }px`;
            // players[team].selector.style.top = `${ position.y - (players[team].spec.moveSpd / Math.SQRT2) }px`;
            absolutePosition[team].x += players[team].spec.moveSpd / Math.SQRT2;
            absolutePosition[team].y += players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x += players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y += players[team].spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.d) && (keyDown.s)) {
            // players[team].selector.style.left = `${ position.x + (players[team].spec.moveSpd / Math.SQRT2) }px`;
            // players[team].selector.style.top = `${ position.y + (players[team].spec.moveSpd / Math.SQRT2) }px`;
            absolutePosition[team].x += players[team].spec.moveSpd / Math.SQRT2;
            absolutePosition[team].y -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x += players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y -= players[team].spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.a) && (keyDown.w)) {
            // players[team].selector.style.left = `${ position.x - (players[team].spec.moveSpd / Math.SQRT2) }px`;
            // players[team].selector.style.top = `${ position.y - (players[team].spec.moveSpd / Math.SQRT2) }px`;
            absolutePosition[team].x -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePosition[team].y += players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y += players[team].spec.moveSpd / Math.SQRT2;
        }
        else if ((keyDown.a) && (keyDown.s)) {
            // players[team].selector.style.left = `${ position.x - (players[team].spec.moveSpd / Math.SQRT2) }px`;
            // players[team].selector.style.top = `${ position.y + (players[team].spec.moveSpd / Math.SQRT2) }px`;
            absolutePosition[team].x -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePosition[team].y -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.x -= players[team].spec.moveSpd / Math.SQRT2;
            absolutePointerPosition.y -= players[team].spec.moveSpd / Math.SQRT2;
        }
        else if (keyDown.w) {
            // players[team].selector.style.top = `${ position.y - players[team].spec.moveSpd }px`;
            absolutePosition[team].y += players[team].spec.moveSpd;
            absolutePointerPosition.y += players[team].spec.moveSpd;
        }
        else if (keyDown.s) {
            // players[team].selector.style.top = `${ position.y + players[team].spec.moveSpd }px`;
            absolutePosition[team].y -= players[team].spec.moveSpd;
            absolutePointerPosition.y -= players[team].spec.moveSpd;
        }
        else if (keyDown.a) {
            // players[team].selector.style.left = `${ position.x - players[team].spec.moveSpd }px`;
            absolutePosition[team].x -= players[team].spec.moveSpd;
            absolutePointerPosition.x -= players[team].spec.moveSpd;
        }
        else if (keyDown.d) {
            // players[team].selector.style.left = `${ position.x + players[team].spec.moveSpd }px`;
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var enemyTeam = _team === 'blue' ? 'red' : 'blue';
    if (char[enemyTeam] === 'sniper') {
        if ((_a = players[_team].marker) === null || _a === void 0 ? void 0 : _a.sniper)
            players[_team].selector.style.boxShadow = "rgb(13, 68, 168) 0px 0px 10px 10px";
        else
            players[_team].selector.style.boxShadow = "";
    }
    else if (char[enemyTeam] === 'ezreal') {
        if (((_b = players[_team].marker) === null || _b === void 0 ? void 0 : _b.ezreal) == true) {
            players[_team].selector.style.boxShadow = "rgb(235, 201, 54) 0px 0px 10px";
            players[_team].selector.style.border = "3px solid rgb(235, 201, 54)";
        }
        else if (((_c = players[_team].marker) === null || _c === void 0 ? void 0 : _c.ezreal) == false) {
            players[_team].selector.style.boxShadow = "";
            players[_team].selector.style.border = "";
        }
    }
    else if (char[enemyTeam] === 'vayne') {
        if (((_d = players[_team].marker) === null || _d === void 0 ? void 0 : _d.vayne) == 1) {
            players[_team].selector.style.boxShadow = "rgb(0, 128, 255) 0px 0px 10px";
        }
        else if (((_e = players[_team].marker) === null || _e === void 0 ? void 0 : _e.vayne) == 2) {
            players[_team].selector.style.boxShadow = "rgb(255, 0, 0) 0px 0px 10px";
        }
        else if (((_f = players[_team].marker) === null || _f === void 0 ? void 0 : _f.vayne) == 0) {
            players[_team].selector.style.boxShadow = "";
            players[_team].selector.style.border = "";
        }
    }
    else if (char[enemyTeam] === 'aphelios') {
        if (((_h = (_g = players[_team].marker) === null || _g === void 0 ? void 0 : _g.aphelios) === null || _h === void 0 ? void 0 : _h.Calibrum) === true) {
            players[_team].selector.style.boxShadow = "darkturquoise 0px 0px 10px 5px";
        }
        else if (((_k = (_j = players[_team].marker) === null || _j === void 0 ? void 0 : _j.aphelios) === null || _k === void 0 ? void 0 : _k.Gravitum) === true) {
            players[_team].selector.style.boxShadow = "purple 0px 0px 10px 5px";
        }
        else if (((_m = (_l = players[_team].marker) === null || _l === void 0 ? void 0 : _l.aphelios) === null || _m === void 0 ? void 0 : _m.Gravitum) === false && ((_p = (_o = players[_team].marker) === null || _o === void 0 ? void 0 : _o.aphelios) === null || _p === void 0 ? void 0 : _p.Calibrum) === false && char[_team == 'blue' ? 'red' : 'blue'] === 'aphelios') {
            players[_team].selector.style.boxShadow = "";
            players[_team].selector.style.border = "";
        }
    }
    else if (char[enemyTeam] === 'ashe') {
        if (players[_team].marker.ashe !== 0) {
            players[_team].selector.style.boxShadow = "rgb(48, 131, 175) 0px 0px 10px 5px";
        }
        else if (players[_team].marker.ashe === 0) {
            players[_team].selector.style.boxShadow = "";
        }
    }
    else if (char[enemyTeam] === 'kaisa') {
        var color = ['', 'rgb(57, 188, 221) 0px 0px 10px 5px', 'rgb(52, 228, 75) 0px 0px 10px 5px', 'rgb(219, 188, 12) 0px 0px 10px 5px', 'red 0px 0px 10px 5px'];
        players[_team].selector.style.boxShadow = "".concat(color[players[_team].marker.kaisa]);
    }
    else if (char[enemyTeam] === 'talon') {
        var color = ['', 'rgb(0, 128, 255) 0px 0px 10px 5px', 'rgb(255, 0, 0) 0px 0px 10px 5px'];
        players[_team].selector.style.boxShadow = "".concat(color[players[_team].marker.talon.stack]);
    }
    if (players[_team].marker.zhonya) {
        players[_team].selector.style.backgroundColor = 'yellow';
    }
    else {
        players[_team].selector.style.backgroundColor = _team;
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
        true: 'white',
        heal: 'rgb(0, 180, 0)'
    };
    var damageCoefficient = {
        melee: (1 / (1 + (players[target].spec.armor * (1 - players[target === 'blue' ? 'red' : 'blue'].spec.ignoreArmorPercent / 100) - players[target === 'blue' ? 'red' : 'blue'].spec.ignoreArmor) * 0.01)),
        magic: (1 / (1 + players[target].spec.magicRegist * 0.01)),
        true: 1,
        heal: 1
    };
    dmg *= damageCoefficient[type];
    if (Math.round(dmg) == 0)
        return;
    alerter.innerHTML = "".concat(Math.round(dmg));
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
        alerter.innerHTML = "".concat(Math.round(dmg), "!");
        alerter.style.fontSize = "".concat(Math.log2(dmg * 4) + 20, "px");
    }
    if (dmg == 9999 && type == 'true' && target != team) {
        players[team].gold += findItem('3_collector').body.extra[2];
    }
    else if (dmg == 9999 && type == 'true' && target == team) {
        death();
        socket.send(JSON.stringify({ body: { msg: "death" } }));
    }
    damageAmount[target] += dmg;
    var totalDamageSum = dmg;
    if (target == team) {
        if (players[team].barrier.length > 0 && type !== 'heal') {
            var index = 0;
            while (true) {
                if (players[team].barrier.length < index)
                    break;
                var barrierMax = players[team].barrier[index][0];
                players[team].barrier[index][0] -= totalDamageSum;
                if (players[team].barrier[index][0] < 0) {
                    totalDamageSum -= barrierMax;
                    index += 1;
                }
                else {
                    totalDamageSum = 0;
                    break;
                }
            }
            players[team].hp[1] -= totalDamageSum;
        }
        else {
            players[team].hp[1] -= totalDamageSum;
        }
        if (type === 'heal') {
            players[team].hp[1] += dmg;
            players[team].hp[1] += dmg;
        }
    }
    // socket.send(JSON.stringify({    
    //     body: {
    //         msg: 'damageAlert',
    //         info: [
    //             type,
    //             dmg,
    //             isCritical,
    //             team
    //         ]
    //     }
    // }));
    parent.appendChild(alerter);
    setTimeout(function () {
        alerter.style.opacity = '0%';
    }, 300);
    setTimeout(function () {
        alerter.style.display = 'none';
        parent.removeChild(alerter);
    }, 1000);
}
;
function checkCollideFromChampion(position, angle, dash) {
    var collideChecker = document.querySelector('.checker-dash.player');
    var ret = false;
    collideChecker.style.position = 'absolute';
    collideChecker.style.backgroundColor = 'green';
    collideChecker.style.left = "".concat(absolutePosition[team].x - 35 - cameraPosition.x - 5 * Math.cos(angle), "px");
    collideChecker.style.top = "".concat(-absolutePosition[team].y - 35 - cameraPosition.y + 5 * Math.sin(angle), "px");
    collideChecker.style.height = '80px';
    collideChecker.style.width = '80px';
    gameObjects.forEach(function (e, i) {
        if (e.isCollide(collideChecker) && e.extra.canCollide) {
            ret = true;
            clearInterval(dash);
            return;
        }
    });
    return ret;
}
function skillUse() {
    if ((hasItem('2_sheen') || hasItem('3_tfo') || hasItem('3_lich_bane')) && !cooldownItem.sheen.isActive) {
        console.log('hi');
        aaA.ad += players[team].spec.ad;
        if (hasItem('3_lich_bane')) {
            aaA.ad += players[team].spec.ad * (findItem('3_lich_bane').body.extra[0] / 100) + players[team].spec.ap * (findItem('3_lich_bane').body.extra[2] / 100);
            aaA.damageType = 'magic';
        }
        cooldownItem.sheen.isActive = true;
    }
}
