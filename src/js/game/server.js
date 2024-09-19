socket.onopen = function () {
    socket.send(JSON.stringify({ body: { msg: "connected" } }));
    socket.send(JSON.stringify({ body: { msg: "ready" } }));
    readyStatus[team] = true;
    socket.send(JSON.stringify({ body: { msg: "char", char: char[team] } }));
    socket.onmessage = function (event) {
        var blob = event.data;
        if (!readyStatus[getEnemyTeam()]) {
            readyStatus[getEnemyTeam()] = true;
            socket.send(JSON.stringify({ body: { msg: "char", char: char[team] } }));
        }
        var reader = new FileReader();
        reader.onload = function () {
            var _a;
            //@ts-ignore
            var sentJson = JSON.parse(reader.result);
            if (sentJson.body) {
                if (sentJson.body.pos) {
                    absolutePosition[getEnemyTeam()] = sentJson.body.pos;
                    projectiles[getEnemyTeam()] = sentJson.body.projectiles;
                    nexusHp[getEnemyTeam()] = sentJson.body.nexus;
                    (_a = sentJson.body.projectiles) === null || _a === void 0 ? void 0 : _a.forEach(function (e) {
                        if (e.isArrive && !e.isSent && e !== undefined)
                            new ProjectileBuilder()
                                .setDegree(e.angle)
                                .setPos(e.absPos.x, e.absPos.y)
                                .setDamage(e.damage, e.damageType)
                                .setCritical(e.critical[0], e.critical[1])
                                .setReach(e.reach)
                                .setSpeed(e.speed)
                                .setSize(e.size)
                                .setStyle(e.style.color, e.style.opacity)
                                .onHit(e.onhit)
                                .ignoreObj(e.ignoreObj)
                                .setTarget(e.targetEnemy[0], e.targetEnemy[1])
                                .canPass(e.canPass)
                                .build(getEnemyTeam());
                    });
                    // console.log(JSON.stringify(sentJson.body.projectiles));
                    players[getEnemyTeam()].hp = sentJson.body.hp;
                    players[getEnemyTeam()].items = sentJson.body.item;
                    players[getEnemyTeam()].marker = sentJson.body.marker;
                    players[getEnemyTeam()].spec = sentJson.body.spec;
                    players[getEnemyTeam()].status = sentJson.body.status;
                    players[getEnemyTeam()].barrier = sentJson.body.barrier;
                }
                else if (sentJson.body.msg) {
                    var message = sentJson.body.msg;
                    if (message == 'connected') {
                        socket.send(JSON.stringify({ body: { msg: "char", char: char[team] } }));
                        socket.send(JSON.stringify({ body: { msg: "ready" } }));
                        readyStatus[getEnemyTeam()] = false;
                    }
                    else if (message == 'ready') {
                        if (!readyStatus[getEnemyTeam()])
                            socket.send(JSON.stringify({ body: { msg: "char", char: char[team] } }));
                        if (!readyStatus[getEnemyTeam()])
                            socket.send(JSON.stringify({ body: { msg: "ready" } }));
                        readyStatus[getEnemyTeam()] = true;
                        document.querySelector('#loading').innerHTML = '';
                    }
                    else if (message == 'char') {
                        char[getEnemyTeam()] = sentJson.body.char;
                    }
                    else if (message == 'onhit') {
                        if (sentJson.body.target == 'enemy')
                            onhit(sentJson.body.type);
                        if (sentJson.body.target == 'nexus')
                            players[team].gold += 50;
                    }
                    else if (message == 'death') {
                        enemyDeath();
                    }
                    else if (message == 'sniper-wheel') {
                        sniperWheelMotion(team);
                    }
                    else if (message == 'samira-wheel') {
                        samiraWheelMotion(getEnemyTeam());
                    }
                    else if (message == 'samiraOnhit') {
                        currentAttackType = sentJson.body.damageType;
                    }
                    else if (message == 'vampire-q') {
                        var damage = (enemySkillInfo.q.damage + players[getEnemyTeam()].spec.ap * enemySkillInfo.q.ap);
                        if (sentJson.body.critic)
                            damage *= players[getEnemyTeam()].spec.criticD / 100 + 1.75;
                        players[team].hp[1] -= damage * (1 / (1 + players[team].spec.magicRegist * 0.01)) * sentJson.body.wd;
                        damageAlert('magic', damage * (1 / (1 + players[team].spec.magicRegist * 0.01)) * sentJson.body.wd, sentJson.body.critic, team);
                    }
                    else if (message == 'aphelios-change') {
                        apheliosWeaponEnemy = [apheliosWeaponEnemy[1], apheliosWeaponEnemy[0]];
                    }
                    else if (message == 'aphelios-new') {
                        apheliosWeaponEnemy = sentJson.body.info;
                    }
                    else if (message == 'aphelios-gravitum-q') {
                        //@ts-ignore
                        var damage = enemySkillInfo.q.Gravitum.damage + enemySkillInfo.q.Gravitum.ad * players[getEnemyTeam()].spec.ad + enemySkillInfo.q.Gravitum.ap * players[getEnemyTeam()].spec.ap;
                        canMove = false;
                        players[team].marker.aphelios.Gravitum = false;
                        players[team].hp[1] -= damage * (1 / (1 + players[team].spec.magicRegist * 0.01));
                        damageAlert('magic', damage * (1 / (1 + players[team].spec.magicRegist * 0.01)), sentJson.body.critic, team);
                        setTimeout(function () {
                            canMove = true;
                        }, 1500);
                    }
                    else if (message == 'aphlios-crescendum') {
                        crescendumAmount += 1;
                    }
                    else if (message == 'aphelios-wheel') {
                        apheliosWheelWheelMotion(getEnemyTeam(), { x: absolutePosition[getEnemyTeam()].x, y: absolutePosition[getEnemyTeam()].y });
                    }
                    else if (message == 'collideDash') {
                        var dashDamage = enemySkillInfo.shift.damage;
                        if (enemySkillInfo.shift.ad)
                            dashDamage += enemySkillInfo.shift.ad * players[getEnemyTeam()].spec.ad;
                        if (enemySkillInfo.shift.ap)
                            dashDamage += enemySkillInfo.shift.ap * players[getEnemyTeam()].spec.ap;
                        players[team].hp[1] -= dashDamage * (1 / (1 + players[team].spec.magicRegist * 0.01));
                        damageAmount[getEnemyTeam()] += dashDamage * (1 / (1 + players[team].spec.magicRegist * 0.01));
                        damageAlert('magic', dashDamage * (1 / (1 + players[team].spec.magicRegist * 0.01)), false, team);
                    }
                    else if (message == 'gameInfo') {
                        window.location.href = "../public/result.html?result=lose&game=".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sentJson.body.info)))));
                    }
                    else if (message == 'gameEnd') {
                        var items_1 = { red: [], blue: [] };
                        players.red.items.forEach(function (e) {
                            if (e !== null && e !== undefined)
                                items_1.red.push(e.name[1]);
                        });
                        players.blue.items.forEach(function (e) {
                            if (e !== null && e !== undefined)
                                items_1.blue.push(e.name[1]);
                        });
                        window.location.href = "../public/result.html?result=win&game=".concat(btoa(unescape(encodeURIComponent(JSON.stringify({
                            dmg: { blue: damageAmount.blue, red: damageAmount.red },
                            onhitCount: { blue: onhitCount.blue, red: onhitCount.red },
                            char: { blue: char.blue, red: char.red },
                            kda: { blue: kda.blue, red: kda.red },
                            team: team, result: 'win',
                            items: { blue: items_1.blue, red: items_1.red }
                        })))));
                        socket.send(JSON.stringify({
                            body: { msg: 'gameInfo', info: {
                                    dmg: { blue: damageAmount.blue, red: damageAmount.red },
                                    onhitCount: { blue: onhitCount.blue, red: onhitCount.red },
                                    char: { blue: char.blue, red: char.red },
                                    kda: { blue: kda.blue, red: kda.red },
                                    team: team, result: 'lose',
                                    items: { blue: items_1.blue, red: items_1.red }
                                } }
                        }));
                    }
                    else if (message == 'reload') {
                        reload();
                    }
                    else if (message == 'damageAlert') {
                        damageAlert(sentJson.body.info[0], sentJson.body.info[1], sentJson.body.info[2], sentJson.body.info[3]);
                    }
                }
            }
        };
        reader.readAsText(blob);
    };
};
