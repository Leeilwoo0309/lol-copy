socket.onopen = function () {
    socket.send(JSON.stringify({ body: { msg: "ready" } }));
    readyStatus[team] = true;
    socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            var sentJson = JSON.parse(reader.result);
            if (sentJson.body) {
                if (sentJson.body.pos) {
                    absolutePosition[getEnemyTeam()] = sentJson.body.pos;
                    projectiles[getEnemyTeam()] = sentJson.body.projectiles;
                    nexusHp[getEnemyTeam()] = sentJson.body.nexus;
                    sentJson.body.projectiles.forEach(function (e) {
                        if (e.isArrive && !e.isSent)
                            new ProjectileBuilder()
                                .setDegree(e.angle)
                                .setPos(e.absPos.x, e.absPos.y)
                                .setDamage(e.damage, e.damageType)
                                .setCritical(e.critical[0], e.critical[1])
                                .setReach(e.reach)
                                .setSpeed(e.speed)
                                .setSize(e.size)
                                .setStyle(e.style.color)
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
                }
                else if (sentJson.body.msg) {
                    var message = sentJson.body.msg;
                    if (message == 'ready') {
                        if (!readyStatus[getEnemyTeam()])
                            socket.send(JSON.stringify({ body: { msg: "char", char: char[team] } }));
                        readyStatus[getEnemyTeam()] = true;
                        document.querySelector('#loading').innerHTML = '';
                    }
                    else if (message == 'char') {
                        char[getEnemyTeam()] = sentJson.body.char;
                    }
                    else if (message == 'onhit') {
                        if (sentJson.body.target == 'enemy')
                            onhit();
                        if (sentJson.body.target == 'nexus')
                            players[team].gold += 10;
                    }
                    else if (message == 'death') {
                        enemyDeath();
                    }
                    else if (message == 'sniper-wheel') {
                        sniperWheelMotion(team);
                    }
                }
            }
        };
        reader.readAsText(blob);
    };
};
