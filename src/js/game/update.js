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
    var _a;
    var legendItem = 0;
    var seosaItem = 0;
    var commonItem = 0;
    if (!readyStatus[getEnemyTeam()])
        socket.send(JSON.stringify({ body: { msg: "ready" } }));
    if (char[team] !== undefined && char[getEnemyTeam()] !== undefined && ((_a = players.blue.specINIT) === null || _a === void 0 ? void 0 : _a.range) === 0)
        getData();
    if (isOpen) {
        atkWait = 2;
    }
    if (!readyStatus[getEnemyTeam()])
        document.querySelector('#loading').innerHTML = "\uC0C1\uB300\uBC29 \uAE30\uB2E4\uB9AC\uB294 \uC911..";
    else if (deathCoolDown[team] > 0) {
        players[team].selector.style.display = 'none';
        document.querySelector('#loading').innerHTML = "\uB2F9\uC2E0\uC740 \uC0AC\uB9DD\uD588\uC2B5\uB2C8\uB2E4! (\uBD80\uD65C\uAE4C\uC9C0: ".concat(deathCoolDown[team], "\uCD08..)");
    }
    else if (deathCoolDown[getEnemyTeam()] > 0)
        document.querySelector('#loading').innerHTML = "\uC0C1\uB300\uBC29\uC774 \uC0AC\uB9DD\uD588\uC2B5\uB2C8\uB2E4! (\uBD80\uD65C\uAE4C\uC9C0: ".concat(deathCoolDown[getEnemyTeam()], "\uCD08..)");
    else
        document.querySelector('#loading').innerHTML = "";
    if (keyDown.tab) {
        var inf = document.querySelector('#information');
        inf.style.display = '';
        document.querySelector('#inf-blue>.inf-kda').innerHTML = "KILL: ".concat(kda.blue[0], " / DEATH: ").concat(kda.blue[1]);
        document.querySelector('#inf-red>.inf-kda').innerHTML = "KILL: ".concat(kda.red[0], " / DEATH: ").concat(kda.red[1]);
        document.querySelector("#inf-blue>h2").innerHTML = "BLUE (".concat(char.blue.toUpperCase(), ")");
        document.querySelector("#inf-red>h2").innerHTML = "(".concat(char.red.toUpperCase(), ") RED");
        players.blue.items.forEach(function (e, i) {
            if (e !== undefined) {
                var item = document.querySelector("#inf-item-b>#vault-".concat(i + 1));
                item.style.backgroundImage = "url(./assets/items/".concat(e === null || e === void 0 ? void 0 : e.name[1], ".png)");
            }
            else {
                var item = document.querySelector("#vault-".concat(i + 1));
                item.style.backgroundImage = "";
            }
        });
        players.red.items.forEach(function (e, i) {
            if (e !== undefined) {
                var item = document.querySelector("#inf-item-r>#vault-".concat(i + 1));
                item.style.backgroundImage = "url(./assets/items/".concat(e === null || e === void 0 ? void 0 : e.name[1], ".png)");
            }
            else {
                var item = document.querySelector("#vault-".concat(i + 1));
                item.style.backgroundImage = "";
            }
        });
    }
    else {
        var inf = document.querySelector('#information');
        inf.style.display = 'none';
    }
    players[team].items.forEach(function (e, i) {
        if (e !== undefined) {
            var item = document.querySelector("#vault-".concat(i + 1));
            item.style.backgroundImage = "url(./assets/items/".concat(e.name[1], ".png)");
            item.style.backgroundSize = "40px";
            if (e.name[1].includes("3_"))
                legendItem += 1;
            else if (e.name[1].includes("2_"))
                seosaItem += 1;
            else if (e.name[1].includes("1_"))
                commonItem += 1;
        }
        else {
            var item = document.querySelector("#vault-".concat(i + 1));
            item.style.backgroundImage = "";
            item.style.backgroundSize = "40px";
        }
    });
    players[team].hp[0] = players[team].specItem.health + players[team].specINIT.health + legendItem * 300 + seosaItem * 80 + commonItem * 30;
    // if (!isFocus) {
    //     keyDown.w = false;
    //     keyDown.a = false;
    //     keyDown.s = false;
    //     keyDown.d = false;
    //     keyDown.q = false;
    //     keyDown.e = false;
    //     keyDown.shift = false;
    //     keyDown.mouse = [false, false, false];
    // }
    try {
        charClass.cooldownINIT = calculateSkillHaste();
    }
    catch (err) {
    }
    players[team].selector.style.left = "".concat(absolutePosition[team].x - cameraPosition.x, "px");
    players[team].selector.style.top = "".concat(-absolutePosition[team].y - cameraPosition.y, "px");
    players[getEnemyTeam()].selector.style.left = "".concat(absolutePosition[getEnemyTeam()].x - cameraPosition.x, "px");
    players[getEnemyTeam()].selector.style.top = "".concat(-absolutePosition[getEnemyTeam()].y - cameraPosition.y, "px");
    playerDistance = Math.sqrt(Math.pow((absolutePosition.blue.x - absolutePosition.red.x), 2) + Math.pow((absolutePosition.blue.y - absolutePosition.red.y), 2));
    damageAlertDiv.forEach(function (e) {
        if (e.classList.contains('blue-d')) {
            e.style.left = "".concat(absolutePosition.blue.x - cameraPosition.x, "px");
            e.style.top = "".concat(-absolutePosition.blue.y - cameraPosition.y, "px");
        }
        else if (e.classList.contains('red-d')) {
            e.style.left = "".concat(absolutePosition.red.x - cameraPosition.x, "px");
            e.style.top = "".concat(-absolutePosition.red.y - cameraPosition.y, "px");
        }
    });
    // body.style.backgroundPositionX = `${ -1 * cameraPosition.x }px`;
    // body.style.backgroundPositionY = `${ -1 * cameraPosition.y }px`;
    players[team].spec = {
        ad: players[team].specINIT.ad + players[team].specItem.ad,
        ap: players[team].specINIT.ap + players[team].specItem.ap,
        atkspd: Math.floor(players[team].specINIT.atkspd * (1 + Math.floor(players[team].specItem.atkspd) / 100) * 100) / 100,
        armor: players[team].specINIT.armor + players[team].specItem.armor + legendItem * 25 + seosaItem * 6 + commonItem * 2,
        ignoreArmor: players[team].specINIT.ignoreArmor + players[team].specItem.ignoreArmor,
        magicRegist: players[team].specINIT.magicRegist + players[team].specItem.magicRegist + legendItem * 25 + seosaItem * 6 + commonItem * 2,
        skillHaste: players[team].specItem.skillHaste,
        range: players[team].specINIT.range + players[team].specItem.range,
        moveSpd: players[team].specINIT.moveSpd + players[team].specItem.moveSpd + alphaMoveSpd,
        criticD: players[team].specINIT.criticD + players[team].specItem.criticD,
        criticP: players[team].specINIT.criticP + players[team].specItem.criticP,
        health: players[team].specINIT.health + players[team].specItem.health,
        healthBoost: players[team].specINIT.healthBoost + players[team].specItem.healthBoost,
        projectileSpd: players[team].specINIT.projectileSpd,
        vamp: players[team].specINIT.vamp + players[team].specItem.vamp
    };
    if (cooldownItem.guinsu.time == 0)
        cooldownItem.guinsu.count = 0;
    if (cooldownItem.guinsu.time > 0) {
        players[team].spec.atkspd *= 1 + findItem('3_guinsu').body.extra[0] / 100 * cooldownItem.guinsu.count;
    }
    if (hasItem('3_decap'))
        players[team].spec.ap *= findItem('3_decap').body.extra[0];
    if (hasItem('3_riftmaker'))
        players[team].spec.ap += Math.floor(players[team].spec.health * findItem('3_riftmaker').body.extra[0] / 100);
    players[team].spec.atkspd = Math.floor(players[team].spec.atkspd * 100) / 100;
    document.querySelector('#now-hp').innerHTML = "".concat(Math.floor(players[team].hp[1]), " / ").concat(players[team].hp[0]);
    hpProgressBars.forEach(function (e) {
        if (e.className.indexOf('nexus') >= 0 && e.className.indexOf('blue') >= 0) {
            e.style.width = "".concat(nexusHp.blue[1] / nexusHp.blue[0] * 100, "%");
        }
        else if (e.className.indexOf('nexus') >= 0 && e.className.indexOf('red') >= 0) {
            e.style.width = "".concat(nexusHp.red[1] / nexusHp.red[0] * 100, "%");
        }
        else if (e.className.indexOf(team) >= 0) {
            e.style.width = "".concat(players[team].hp[1] / players[team].hp[0] * 100, "%");
        }
        else if (e.className.indexOf(getEnemyTeam()) >= 0) {
            e.style.width = "".concat(players[getEnemyTeam()].hp[1] / players[getEnemyTeam()].hp[0] * 100, "%");
        }
    });
    statusDiv.style.left = "".concat(window.innerWidth / 2 - 300, "px");
    itemsDiv.style.left = "".concat(window.innerWidth / 2 + 300, "px");
    itemsDiv.children[6].innerHTML = "<p id=\"gold\">G".concat(players[team].gold, "</p>");
    specDiv.style.left = "".concat(window.innerWidth / 2 - 470, "px");
    specDiv.innerHTML = "\n        <p>\uACF5\uACA9\uB825: ".concat(players[team].spec.ad, "</p>\n        <p>\uC8FC\uBB38\uB825: ").concat(players[team].spec.ap, "</p>\n        <p>\uACF5\uACA9 \uC18D\uB3C4: ").concat(players[team].spec.atkspd, "</p>\n        <p>\uBC29\uC5B4\uB825: ").concat(Math.floor(players[team].spec.armor), "</p>\n        <p>\uB9C8\uBC95 \uC800\uD56D\uB825: ").concat(Math.floor(players[team].spec.magicRegist), "</p>\n        <p>\uC0AC\uAC70\uB9AC: ").concat(players[team].spec.range, "</p>\n        <p>\uC774\uB3D9\uC18D\uB3C4: ").concat(Math.floor((players[team].spec.moveSpd) * 100) / 100, "</p>\n        <p>\uCE58\uBA85\uD0C0 \uD655\uB960: ").concat(players[team].spec.criticP, "%</p>\n        <p>\uC0DD\uBA85\uB825 \uD761\uC218: ").concat(players[team].spec.vamp, "%</p>\n        <p>\uBB3C\uB9AC \uAD00\uD1B5\uB825: ").concat(players[team].spec.ignoreArmor, "</p>\n        <p>\uC2A4\uD0AC \uAC00\uC18D: ").concat(players[team].spec.skillHaste, "%</p>\n        <p>\uCD08\uB2F9 \uCCB4\uB825 \uD68C\uBCF5: ").concat(Math.floor((players[team].specINIT.healthBoost + players[team].specINIT.healthBoost * players[team].spec.healthBoost / 100 - players[team].specINIT.healthBoost / 100) * 10) / 10, "</p>\n    ");
    shopBtn.addEventListener('click', function () { shopOpen(); });
    var position = {
        x: parseFloat(players[team].selector.style.left),
        y: parseFloat(players[team].selector.style.top)
    };
    move(position);
    gameObjects.forEach(function (e) {
        e.position = { x: e.INIT.position.x - cameraPosition.x, y: e.INIT.position.y - cameraPosition.y };
    });
    if (absolutePosition[team].x < 0) {
        absolutePosition[team].x = 0;
    }
    if (absolutePosition[team].x > 4400 - players[team].size) {
        absolutePosition[team].x = 4400 - players[team].size;
    }
    if (absolutePosition[team].y > 1606) {
        absolutePosition[team].y = 1606;
        players[team].selector.style.top = "1606px";
    }
    if (absolutePosition[team].y < -668) {
        absolutePosition[team].y = -668;
        players[team].selector.style.top = "668px";
    }
    cameraPosition.x = absolutePosition[team].x - window.innerWidth * 0.5 + players[team].size / 2;
    cameraPosition.y = -absolutePosition[team].y - window.innerHeight * 0.5 + players[team].size;
    if (cameraPosition.x < 0)
        cameraPosition.x = 0; // 2480
    if (cameraPosition.x > 4400 - window.innerWidth)
        cameraPosition.x = 4400 - window.innerWidth;
    if (cameraPosition.y < -900)
        cameraPosition.y = -900;
    if (cameraPosition.y > 0)
        cameraPosition.y = 0;
    if (players[team].hp[1] > players[team].hp[0])
        players[team].hp[1] = players[team].hp[0];
    if (players[team].hp[1] < 0 && deathCoolDown[team] == 0) {
        players[team].hp[1] = 0;
        death();
    }
    if (keyDown.p) {
        shopOpen();
        keyDown.p = false;
    }
    if (keyDown.mouse[0] && atkWait === 0 && readyStatus[getEnemyTeam()] && deathCoolDown[team] === 0) {
        atkWait = 1 / players[team].spec.atkspd * 100;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        players[team].status.invisible = false;
        if (players[team].specINIT.defaultAAType == "long") {
            if (char[team] == "graves") {
                for (var i = -1; i < 2; i++) {
                    projectiles[team].push(new ProjectileBuilder()
                        .setDamage((players[team].spec.ad + aaA.ad + cooldownItem.kraken.damage) * 0.7, aaA.damageType == 'magic' ? 'magic' : players[team].specINIT.damageType)
                        .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                        .setDegree(angle + i * 0.2)
                        .setReach(players[team].spec.range)
                        .setSpeed(players[team].spec.projectileSpd)
                        .setSize({ height: players[team].specINIT.projectileSize[0], width: players[team].specINIT.projectileSize[1] })
                        // .setStyle('gray')
                        .onHit("graves aa")
                        .build(team));
                }
            }
            else {
                projectiles[team].push(new ProjectileBuilder()
                    .setDamage(players[team].spec.ad + aaA.ad + cooldownItem.kraken.damage, aaA.damageType == 'magic' ? 'magic' : players[team].specINIT.damageType)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(players[team].spec.range)
                    .setSpeed(players[team].spec.projectileSpd)
                    .setSize({ height: players[team].specINIT.projectileSize[0], width: players[team].specINIT.projectileSize[1] })
                    .onHit("".concat(char[team], " aa"))
                    .setStyle(team == 'red' ? 'rgb(180, 0, 0)' : 'rgb(0, 0, 180)')
                    .build(team));
            }
        }
        else if (players[team].specINIT.defaultAAType === "short") {
            nonProjectiles[team].push(new NonProjectileBuilder()
                .setDamage(players[team].spec.ad + aaA.ad + cooldownItem.kraken.damage, players[team].specINIT.damageType)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(players[team].spec.range)
                .setSpeed(players[team].spec.projectileSpd)
                .setSize({ height: players[team].specINIT.projectileSize[0], width: players[team].specINIT.projectileSize[1] })
                .onHit("".concat(char[team], " aa"))
                .setStyle(team == 'red' ? 'rgb(180, 0, 0)' : 'rgb(0, 0, 180)')
                .build(team));
        }
    }
    if (keyDown.q && charClass.cooldown.q === 0 && deathCoolDown[team] === 0) {
        charClass.skillQ();
    }
    if (keyDown.e && charClass.cooldown.e === 0 && deathCoolDown[team] === 0) {
        charClass.skillE();
    }
    if (keyDown.shift && charClass.cooldown.shift === 0 && deathCoolDown[team] === 0) {
        charClass.skillLShift();
    }
    if (keyDown.mouse[1] && charClass.cooldown.wheel === 0 && deathCoolDown[team] === 0) {
        charClass.skillWheel();
    }
    function skillUpdate(skillKey, index) {
        if (charClass.isActive[skillKey]) {
            skillBtns[index].style.backgroundColor = 'yellow';
            skillBtns[index].style.color = 'black';
            skillBtns[index].style.border = '1px solid white';
            if (charClass.cooldown[skillKey] > 0)
                skillBtns[index].innerHTML = "".concat(Math.floor(charClass.cooldown[skillKey] / 10) / 10);
            else
                skillBtns[index].innerHTML = "".concat(skillKey.toUpperCase());
        }
        else if (charClass.cooldown[skillKey] > 0) {
            skillBtns[index].style.backgroundColor = 'black';
            skillBtns[index].style.color = 'white';
            skillBtns[index].style.border = '1px solid white';
            skillBtns[index].innerHTML = "".concat(Math.floor(charClass.cooldown[skillKey] / 10) / 10);
        }
        else if (charClass.cooldown[skillKey] == 0) {
            skillBtns[index].style.backgroundColor = 'rgb(144, 148, 167)';
            skillBtns[index].style.color = 'black';
            skillBtns[index].style.border = '';
            skillBtns[index].innerHTML = "".concat(skillKey.toUpperCase());
        }
    }
    if (charClass !== undefined) {
        skillUpdate('q', 0);
        skillUpdate('e', 1);
        skillUpdate('shift', 2);
        skillUpdate('wheel', 3);
    }
    animation(team);
    animation(getEnemyTeam());
    // 아이템
    if (hasItem("3_shieldbow") && cooldownItem.shieldbow == 0 && players[team].hp[1] / players[team].hp[0] <= 0.3 && players[team].hp[1] > 0) {
        players[team].hp[1] += players[team].hp[0] * (findItem("3_shieldbow").body.extra[0] / 100);
        cooldownItem.shieldbow = findItem("3_shieldbow").body.extra[1];
    }
    var newProjectiles = [];
    projectiles[team].forEach(function (e) {
        if (e.isArrive) {
            newProjectiles.push(e);
        }
    });
    projectiles[team] = __spreadArray([], newProjectiles, true);
    var sendData = {
        pos: absolutePosition[team],
        projectiles: projectiles[team],
        hp: players[team].hp,
        nexus: nexusHp[team],
        item: players[team].items,
        marker: players[team].marker,
        spec: players[team].spec,
        status: players[team].status
    };
    socket.send(JSON.stringify({ body: sendData }));
    projectiles[team].forEach(function (e) {
        e.isSent = true;
    });
}, 16);
setInterval(function () {
    if (atkWait > 0)
        atkWait -= 1;
    if (atkWait < 0)
        atkWait = 0;
    if (readyStatus[getEnemyTeam()] && charClass !== undefined) {
        if (charClass.cooldown.q > 0)
            charClass.cooldown.q -= 1;
        if (charClass.cooldown.e > 0)
            charClass.cooldown.e -= 1;
        if (charClass.cooldown.shift > 0)
            charClass.cooldown.shift -= 1;
        if (charClass.cooldown.wheel > 0)
            charClass.cooldown.wheel -= 1;
        if (charClass.cooldown.q < 0)
            charClass.cooldown.q = 0;
        if (charClass.cooldown.e < 0)
            charClass.cooldown.e = 0;
        if (charClass.cooldown.shift < 0)
            charClass.cooldown.shift = 0;
        if (charClass.cooldown.wheel < 0)
            charClass.cooldown.wheel = 0;
    }
    if (keyDown.space) {
        players[team].hp[1] = players[team].hp[0];
    }
    if (passiveActiveTime > 0) {
        passiveActiveTime -= 1;
        if (char[team] == 'sniper') {
            alphaMoveSpd = skillInfo.passive.moveSpd;
        }
    }
    else if (char[team] !== 'samira') {
        alphaMoveSpd = 0;
    }
    if (passiveActiveTime == 0 && char[team] == 'samira') {
        styleGrade = 0;
        alphaMoveSpd = 0;
        lastAttackType = '';
        try {
            charClass.isActive.wheel = false;
        }
        catch (err) { }
        styleGradePrint.style.display = 'none';
    }
    if (cooldownItem.guinsu.time > 0) {
        cooldownItem.guinsu.time -= 1;
    }
    if (cooldownItem.shieldbow > 0) {
        cooldownItem.shieldbow -= 1;
        players[team].items.forEach(function (e, i) {
            if (e === undefined) {
                var shieldbow = document.querySelector("#vault-".concat(i + 1));
                shieldbow.style.backgroundColor = '';
                shieldbow.innerHTML = "";
            }
            else if (e.name[1] == '3_shieldbow') {
                var shieldbow = document.querySelector("#vault-".concat(i + 1));
                shieldbow.style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
                shieldbow.style.color = 'white';
                shieldbow.style.textAlign = 'center';
                shieldbow.style.paddingTop = '10px';
                shieldbow.style.marginBottom = '-30px';
                shieldbow.style.height = '30px';
                shieldbow.innerHTML = "".concat(Math.floor(cooldownItem.shieldbow / 10) / 10);
            }
            else {
                var shieldbow = document.querySelector("#vault-".concat(i + 1));
                shieldbow.style.backgroundColor = '';
                shieldbow.innerHTML = "";
            }
        });
    }
    else {
        players[team].items.forEach(function (e, i) {
            if (e === undefined)
                return;
            if (e.name[1] == '3_shieldbow') {
                var shieldbow = document.querySelector("#vault-".concat(i + 1));
                shieldbow.style.backgroundColor = '';
                shieldbow.innerHTML = "";
            }
        });
    }
}, 10);
setInterval(function () {
    var nexusIndex = { blue: [7, 8], red: [9, 10] };
    if (gameObjects[nexusIndex[getEnemyTeam()][0]].isCollide(players[team].selector)) {
        players[team].hp[1] -= players[team].hp[0] / 25;
    }
    if (readyStatus[getEnemyTeam()]) {
        players[team].gold += 1;
    }
}, 200);
setInterval(function () {
    var nexusIndex = { blue: [7, 8], red: [9, 10] };
    if (players[team].hp[1] < players[team].hp[0])
        players[team].hp[1] += Math.floor((players[team].specINIT.healthBoost + players[team].specINIT.healthBoost * players[team].spec.healthBoost / 100 - players[team].specINIT.healthBoost / 100) * 10) / 10;
    if (gameObjects[nexusIndex[team][0]].isCollide(players[team].selector)) {
        players[team].hp[1] += players[team].hp[0] / 40;
    }
    ;
    if (deathCoolDown[team] > 0) {
        deathCoolDown[team] -= 1;
    }
    ;
    if (deathCoolDown[team] < 0)
        deathCoolDown[team] = 0;
    if (deathCoolDown[getEnemyTeam()] > 0)
        deathCoolDown[getEnemyTeam()] -= 1;
    if (deathCoolDown[getEnemyTeam()] < 0)
        deathCoolDown[getEnemyTeam()] = 0;
}, 1000);
// 내가 쏜걸 상대방이 맞았을 때
function onhit(type) {
    players[team].gold += 3;
    players[team].hp[1] += players[team].spec.ad * players[team].spec.vamp / 100;
    if (hasItem('0_cull')) {
        players[team].gold += findItem('0_cull').body.extra[0];
    }
    if (hasItem('3_guinsu')) {
        cooldownItem.guinsu.time = findItem('3_guinsu').body.extra[1];
        if (cooldownItem.guinsu.count < findItem('3_guinsu').body.extra[2])
            cooldownItem.guinsu.count += 1;
    }
    if (hasItem('3_kraken')) {
        if (cooldownItem.kraken.count < 3)
            cooldownItem.kraken.count += 1;
        if (cooldownItem.kraken.count == 2)
            cooldownItem.kraken.damage = findItem('3_kraken').body.extra[0] + players[team].spec.ad * findItem('3_kraken').body.extra[2];
        if (cooldownItem.kraken.count == 3) {
            cooldownItem.kraken.count = 0;
            cooldownItem.kraken.damage = 0;
        }
    }
    if (hasItem('3_navori')) {
        var decreasePercent = findItem('3_navori').body.extra[0] / 100;
        charClass.cooldown.q -= charClass.cooldownINIT.q * decreasePercent;
        charClass.cooldown.e -= charClass.cooldownINIT.e * decreasePercent;
        charClass.cooldown.shift -= charClass.cooldownINIT.shift * decreasePercent;
    }
    if ((hasItem('2_sheen') || hasItem('3_tfo') || hasItem('3_lich_bane')) && cooldownItem.sheen.isActive) {
        cooldownItem.sheen.isActive = false;
        aaA.ad = 0;
        aaA.damageType = undefined;
    }
    if ((hasItem('2_sheen') || hasItem('3_tfo') || hasItem('3_lich_bane')) && !cooldownItem.sheen.isActive && type == 'skill') {
        aaA.ad += players[team].spec.ad;
        if (hasItem('3_lich_bane')) {
            aaA.ad += players[team].spec.ad * (findItem('3_lich_bane').body.extra[0] / 100) + players[team].spec.ap * (findItem('3_lich_bane').body.extra[2] / 100);
            aaA.damageType = 'magic';
        }
        cooldownItem.sheen.isActive = true;
    }
    if (aaA.ad > 0 && !cooldownItem.sheen.isActive) {
        aaA.ad = 0;
        if (char[team] == 'sniper') {
            charClass.isActive.q = false;
        }
    }
    if (char[team] == 'sniper') {
        charClass.passive();
    }
    else if (char[team] == 'samira') {
        samira.passive();
    }
}
function death() {
    if (!isNexusAlive[team]) {
        // window.location.href = `../public/result.html?result=lose&game=${ btoa(unescape(encodeURIComponent(JSON.stringify(
        //     {
        //         dmg: {blue: damageAmount.blue, red: damageAmount.red},
        //         onhitCount: {blue: onhitCount.blue, red: onhitCount.red},
        //         char: {blue: char.blue, red: char.red},
        //         kda: {blue: kda.blue, red: kda.red},
        //         team: getEnemyTeam(), result: 'win',
        //         items: {blue: JSON.stringify(players.blue.items), red: JSON.stringify(players.red.items)}
        //     }
        // )))) }`;
        socket.send(JSON.stringify({ body: { msg: 'gameEnd' } }));
        return;
    }
    deathCoolDown[team] = 2 + (kda[team][1] + 1) * 5;
    kda[team][1] += 1;
    kda[getEnemyTeam()][0] += 1;
    setTimeout(function () {
        players[team].selector.style.display = '';
        players[team].hp[1] = players[team].hp[0];
        if (team == 'blue')
            absolutePosition[team] = { x: 200, y: -430 };
        if (team == 'red')
            absolutePosition[team] = { x: 4170, y: -430 };
        deathCoolDown[team] = 0;
    }, (deathCoolDown[team] - 1) * 1000);
    socket.send(JSON.stringify({ body: { msg: "death" } }));
}
function enemyDeath() {
    deathCoolDown[getEnemyTeam()] = 2 + (kda[getEnemyTeam()][1] + 1) * 5;
    kda[getEnemyTeam()][1] += 1;
    kda[team][0] += 1;
    players[getEnemyTeam()].selector.style.display = 'none';
    players[team].gold += 300;
    setTimeout(function () {
        players[getEnemyTeam()].selector.style.display = '';
        players[getEnemyTeam()].hp[1] = players[getEnemyTeam()].hp[0];
        deathCoolDown[getEnemyTeam()] = 0;
    }, (deathCoolDown[getEnemyTeam()] - 1) * 1000);
}
