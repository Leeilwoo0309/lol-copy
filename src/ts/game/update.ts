setInterval(() => {
    let legendItem: number = 0;
    let seosaItem: number = 0;
    let commonItem: number = 0;

    if (!readyStatus[getEnemyTeam()])
        socket.send(JSON.stringify({body: {msg: "ready"}}));
    if (char[team] !== undefined && char[getEnemyTeam()] !== undefined && players.blue.specINIT?.range === 0 )
        getData();
    if (isOpen) {
        atkWait = 2;
    }

    if (!readyStatus[getEnemyTeam()])
        document.querySelector('#loading').innerHTML = `상대방 기다리는 중..`;
    else if (deathCoolDown[team] > 0) {
        players[team].selector.style.display = 'none';
        document.querySelector('#loading').innerHTML = `당신은 사망했습니다! (부활까지: ${ deathCoolDown[team] }초..)`;
    }
    else if (deathCoolDown[getEnemyTeam()] > 0)
        document.querySelector('#loading').innerHTML = `상대방이 사망했습니다! (부활까지: ${ deathCoolDown[getEnemyTeam()] }초..)`;
    else
        document.querySelector('#loading').innerHTML = ``;

    if (keyDown.tab) {
        let inf: HTMLDivElement = document.querySelector('#information');

        inf.style.display = '';
        document.querySelector('#inf-blue>.inf-kda').innerHTML = `KILL: ${ kda.blue[0] } / DEATH: ${ kda.blue[1] }`;
        document.querySelector('#inf-red>.inf-kda').innerHTML = `KILL: ${ kda.red[0] } / DEATH: ${ kda.red[1] }`;
        document.querySelector("#inf-blue>h2").innerHTML = `BLUE (${ char.blue.toUpperCase() })`;
        document.querySelector("#inf-red>h2").innerHTML = `(${ char.red.toUpperCase() }) RED`;

        players.blue.items.forEach((e, i) => {
            if (e !== undefined) {
                const item: HTMLDivElement = document.querySelector(`#inf-item-b>#vault-${ i + 1 }`);
                
                item.style.backgroundImage = `url(./assets/items/${ e?.name[1] }.png)`;
            } else {
                const item: HTMLDivElement = document.querySelector(`#vault-${ i + 1 }`);
                
                item.style.backgroundImage = ``;
            }
        });

        players.red.items.forEach((e, i) => {
            if (e !== undefined) {
                const item: HTMLDivElement = document.querySelector(`#inf-item-r>#vault-${ i + 1 }`);
                
                item.style.backgroundImage = `url(./assets/items/${ e?.name[1] }.png)`;
            } else {
                const item: HTMLDivElement = document.querySelector(`#vault-${ i + 1 }`);
                
                item.style.backgroundImage = ``;
            }
        });
    } else {
        let inf: HTMLDivElement = document.querySelector('#information');

        inf.style.display = 'none';
    }

    players[team].items.forEach((e, i) => {
        if (e !== undefined) {
            const item: HTMLDivElement = document.querySelector(`#vault-${ i + 1 }`);
            
            item.style.backgroundImage = `url(./assets/items/${ e.name[1] }.png)`;
            item.style.backgroundSize = `40px`;

            if (e.name[1].includes("3_")) legendItem += 1;
            else if (e.name[1].includes("2_")) seosaItem += 1;
            else if (e.name[1].includes("1_")) commonItem += 1;
        } else {
            const item: HTMLDivElement = document.querySelector(`#vault-${ i + 1 }`);
            
            item.style.backgroundImage = ``;
            item.style.backgroundSize = `40px`;
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
    } catch (err) {
    }
    players[team].selector.style.left = `${ absolutePosition[team].x - cameraPosition.x }px`;
    players[team].selector.style.top = `${ -absolutePosition[team].y - cameraPosition.y }px`;
    players[getEnemyTeam()].selector.style.left = `${ absolutePosition[getEnemyTeam()].x - cameraPosition.x }px`;
    players[getEnemyTeam()].selector.style.top = `${ -absolutePosition[getEnemyTeam()].y - cameraPosition.y }px`;
    playerDistance = Math.sqrt((absolutePosition.blue.x - absolutePosition.red.x) ** 2 + (absolutePosition.blue.y - absolutePosition.red.y) ** 2)
    damageAlertDiv.forEach(e => {
        if (e.classList.contains('blue-d')) {
            e.style.left = `${ absolutePosition.blue.x - cameraPosition.x }px`;
            e.style.top = `${ -absolutePosition.blue.y - cameraPosition.y }px`;
        } else if (e.classList.contains('red-d')) {
            e.style.left = `${ absolutePosition.red.x - cameraPosition.x }px`;
            e.style.top = `${ -absolutePosition.red.y - cameraPosition.y }px`;
        }
    })
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

    if (cooldownItem.guinsu.time == 0) cooldownItem.guinsu.count = 0;
    if (cooldownItem.guinsu.time > 0) {
        players[team].spec.atkspd *= 1 + findItem('3_guinsu').body.extra[0] / 100 * cooldownItem.guinsu.count;
    }
    if (hasItem('3_decap')) players[team].spec.ap *= findItem('3_decap').body.extra[0];
    if (hasItem('3_riftmaker')) players[team].spec.ap += Math.floor(players[team].spec.health * findItem('3_riftmaker').body.extra[0] / 100);

    if (char[team] === 'vampire') players[team].spec.vamp = Math.floor(players[team].spec.vamp * skillInfo.passive.vamp);

    players[team].spec.atkspd = Math.floor(players[team].spec.atkspd * 100) / 100;

    document.querySelector('#now-hp').innerHTML = `${ Math.floor(players[team].hp[1]) } / ${ players[team].hp[0] }`;

    hpProgressBars.forEach(e => {
        if (e.className.indexOf('nexus') >= 0 && e.className.indexOf('blue') >= 0) {
            e.style.width = `${ nexusHp.blue[1] / nexusHp.blue[0] * 100}%`;
        } else if (e.className.indexOf('nexus') >= 0 && e.className.indexOf('red') >= 0) {
            e.style.width = `${ nexusHp.red[1] / nexusHp.red[0] * 100}%`;
        } else if (e.className.indexOf(team) >= 0) {
            e.style.width = `${ players[team].hp[1] / players[team].hp[0] * 100}%`;
        } else if (e.className.indexOf(getEnemyTeam()) >= 0) {
            e.style.width = `${ players[getEnemyTeam()].hp[1] / players[getEnemyTeam()].hp[0] * 100}%`;
        }
    });

    statusDiv.style.left = `${ window.innerWidth / 2 - 300 }px`;
    itemsDiv.style.left = `${ window.innerWidth / 2 + 300 }px`;
    itemsDiv.children[6].innerHTML = `<p id="gold">G${ players[team].gold }</p>`
    specDiv.style.left = `${ window.innerWidth / 2 - 470 }px`;
    specDiv.innerHTML = `
        <p>공격력: ${ players[team].spec.ad }</p>
        <p>주문력: ${ players[team].spec.ap }</p>
        <p>공격 속도: ${ players[team].spec.atkspd }</p>
        <p>방어력: ${ Math.floor(players[team].spec.armor) }</p>
        <p>마법 저항력: ${ Math.floor(players[team].spec.magicRegist) }</p>
        <p>사거리: ${ players[team].spec.range }</p>
        <p>이동속도: ${ Math.floor((players[team].spec.moveSpd) * 100) / 100 }</p>
        <p>치명타 확률: ${ players[team].spec.criticP }%</p>
        <p>생명력 흡수: ${ players[team].spec.vamp }%</p>
        <p>물리 관통력: ${ players[team].spec.ignoreArmor }</p>
        <p>스킬 가속: ${ players[team].spec.skillHaste }%</p>
        <p>초당 체력 회복: ${
            Math.floor(
                (players[team].specINIT.healthBoost + players[team].specINIT.healthBoost * players[team].spec.healthBoost / 100 - players[team].specINIT.healthBoost / 100) * 10
            ) / 10 
        }</p>
    `;

    shopBtn.addEventListener('click', () => { shopOpen() });

    


    const position = {
        x: parseFloat(players[team].selector.style.left),
        y: parseFloat(players[team].selector.style.top)
    }

    move(position);


    gameObjects.forEach(e => {
        e.position = {x: e.INIT.position.x - cameraPosition.x, y: e.INIT.position.y - cameraPosition.y}
    })

    if (absolutePosition[team].x < 0) {
        absolutePosition[team].x = 0;
    }
    if (absolutePosition[team].x > 4400 - players[team].size) {
        absolutePosition[team].x = 4400 - players[team].size;
    }
    if (absolutePosition[team].y > 1606) {
        absolutePosition[team].y = 1606
        players[team].selector.style.top = `1606px`;
    }
    if (absolutePosition[team].y < -668) {
        absolutePosition[team].y = -668
        players[team].selector.style.top = `668px`;
    }

    cameraPosition.x = absolutePosition[team].x - window.innerWidth * 0.5 + players[team].size / 2;
    cameraPosition.y = -absolutePosition[team].y - window.innerHeight * 0.5 + players[team].size;
    
    if (cameraPosition.x < 0) cameraPosition.x = 0; // 2480
    if (cameraPosition.x > 4400 - window.innerWidth) cameraPosition.x = 4400 - window.innerWidth;
    if (cameraPosition.y < -900) cameraPosition.y = -900;
    if (cameraPosition.y > 0) cameraPosition.y = 0;
    if (players[team].hp[1] > players[team].hp[0]) players[team].hp[1] = players[team].hp[0];
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
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        players[team].status.invisible = false;
        
        if (players[team].specINIT.defaultAAType == "long") {
            if (char[team] == "graves") {
                for (let i = -1; i < 2; i++) {
                    projectiles[team].push(
                        new ProjectileBuilder()
                            .setDamage((players[team].spec.ad + aaA.ad + cooldownItem.kraken.damage) * 0.7, aaA.damageType == 'magic' ? 'magic' : players[team].specINIT.damageType)
                            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                            .setDegree(angle + i * 0.2)
                            .setReach(players[team].spec.range)
                            .setSpeed(players[team].spec.projectileSpd)
                            .setSize({height: players[team].specINIT.projectileSize[0], width: players[team].specINIT.projectileSize[1]})
                            // .setStyle('gray')
                            .onHit(`graves aa`)
                            .build(team)
                        );
                }
            } else {
                projectiles[team].push(
                    new ProjectileBuilder()
                        .setDamage(players[team].spec.ad + aaA.ad + cooldownItem.kraken.damage, aaA.damageType == 'magic' ? 'magic' : players[team].specINIT.damageType)
                        .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                        .setDegree(angle)
                        .setReach(players[team].spec.range)
                        .setSpeed(players[team].spec.projectileSpd)
                        .setSize({height: players[team].specINIT.projectileSize[0], width: players[team].specINIT.projectileSize[1]})
                        .onHit(`${ char[team] } aa`)
                        .setStyle(team == 'red' ? 'rgb(180, 0, 0)' : 'rgb(0, 0, 180)')
                        .build(team)
                );
            }
        } else if (players[team].specINIT.defaultAAType === "short") {
            nonProjectiles[team].push(
                new NonProjectileBuilder()
                    .setDamage(players[team].spec.ad + aaA.ad + cooldownItem.kraken.damage, players[team].specINIT.damageType)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(players[team].spec.range)
                    .setSpeed(players[team].spec.projectileSpd)
                    .setSize({height: players[team].specINIT.projectileSize[0], width: players[team].specINIT.projectileSize[1]})
                    .onHit(`${ char[team] } aa`)
                    .setStyle(team == 'red' ? 'rgb(180, 0, 0)' : 'rgb(0, 0, 180)')
                    .build(team)
            );
        }

    }

    if (keyDown.q && charClass.cooldown.q === 0 && deathCoolDown[team] === 0) {
        charClass.skillQ();
    } if (keyDown.e && charClass.cooldown.e === 0 && deathCoolDown[team] === 0) {
        charClass.skillE();
    } if (keyDown.shift && charClass.cooldown.shift === 0 && deathCoolDown[team] === 0) {
        charClass.skillLShift();
    } if (keyDown.mouse[1] && charClass.cooldown.wheel === 0 && deathCoolDown[team] === 0) {
        charClass.skillWheel();
    }

    function skillUpdate(skillKey: string, index: number) {
        if (charClass.isActive[skillKey]) {
            skillBtns[index].style.backgroundColor = 'yellow';
            skillBtns[index].style.color = 'black';
            skillBtns[index].style.border = '1px solid white';

            if (charClass.cooldown[skillKey] > 0) skillBtns[index].innerHTML = `${ Math.floor(charClass.cooldown[skillKey] / 10) / 10  }`;
            else skillBtns[index].innerHTML = `${ skillKey.toUpperCase() }`;
        } else if (charClass.cooldown[skillKey] > 0) {
            skillBtns[index].style.backgroundColor = 'black';
            skillBtns[index].style.color = 'white';
            skillBtns[index].style.border = '1px solid white';
    
            skillBtns[index].innerHTML = `${ Math.floor(charClass.cooldown[skillKey] / 10) / 10  }`
        } else if (charClass.cooldown[skillKey] == 0) {
            skillBtns[index].style.backgroundColor = 'rgb(144, 148, 167)';
            skillBtns[index].style.color = 'black';
            skillBtns[index].style.border = '';
    
            skillBtns[index].innerHTML = `${ skillKey.toUpperCase() }`;
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

    let newProjectiles: Projectile[] = [];

    projectiles[team].forEach(e => {
        if (e.isArrive) {
            newProjectiles.push(e);
        }
    });

    projectiles[team] = [...newProjectiles];

    let sendData = {
        pos: absolutePosition[team],
        projectiles: projectiles[team],
        hp: players[team].hp,
        nexus: nexusHp[team],
        item: players[team].items,
        marker: players[team].marker,
        spec: players[team].spec,
        status: players[team].status
    };

    socket.send(JSON.stringify({body: sendData}));

    projectiles[team].forEach(e => {
        e.isSent = true;
    });
}, 16);

setInterval(() => {
    if (atkWait > 0 ) atkWait -= 1;
    if (atkWait < 0) atkWait = 0;

    if (readyStatus[getEnemyTeam()] && charClass !== undefined) {
        if (charClass.cooldown.q > 0) charClass.cooldown.q -= 1;
        if (charClass.cooldown.e > 0) charClass.cooldown.e -= 1;
        if (charClass.cooldown.shift > 0) charClass.cooldown.shift -= 1;
        if (charClass.cooldown.wheel > 0) charClass.cooldown.wheel -= 1;
        if (charClass.cooldown.q < 0) charClass.cooldown.q = 0;
        if (charClass.cooldown.e < 0) charClass.cooldown.e = 0;
        if (charClass.cooldown.shift < 0) charClass.cooldown.shift = 0;
        if (charClass.cooldown.wheel < 0) charClass.cooldown.wheel = 0;
    }

    if (keyDown.space) {
        players[team].hp[1] = players[team].hp[0];
    }

    
    if (passiveActiveTime > 0) {
        passiveActiveTime -= 1;
        
        if (char[team] == 'sniper') {
            alphaMoveSpd = skillInfo.passive.moveSpd;
        }
    } else if (char[team] !== 'samira') {
        alphaMoveSpd = 0;
    }

    if (passiveActiveTime == 0 && char[team] == 'samira') {
        styleGrade = 0;
        alphaMoveSpd = 0;
        lastAttackType = '';
        try {charClass.isActive.wheel = false;}
        catch (err) {}
        styleGradePrint.style.display = 'none';
    }

    if (cooldownItem.guinsu.time > 0) {
        cooldownItem.guinsu.time -= 1;
    }

    if (cooldownItem.shieldbow > 0) {
        cooldownItem.shieldbow -= 1;

        players[team].items.forEach((e, i)=> {
            if (e === undefined) {
                const shieldbow: HTMLDivElement = document.querySelector(`#vault-${ i + 1 }`);
                
                shieldbow.style.backgroundColor = '';
                shieldbow.innerHTML = ``;
            } else if (e.name[1] == '3_shieldbow') {
                const shieldbow: HTMLDivElement = document.querySelector(`#vault-${ i + 1 }`);
                
                shieldbow.style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
                shieldbow.style.color = 'white';
                shieldbow.style.textAlign = 'center';
                shieldbow.style.paddingTop = '10px';
                shieldbow.style.marginBottom = '-30px';
                shieldbow.style.height = '30px';
                shieldbow.innerHTML = `${ Math.floor(cooldownItem.shieldbow / 10) / 10 }`;
            } else {
                const shieldbow: HTMLDivElement = document.querySelector(`#vault-${ i + 1 }`);
                
                shieldbow.style.backgroundColor = '';
                shieldbow.innerHTML = ``;
            }
        });
    } else {
        players[team].items.forEach((e, i)=> {
            if (e === undefined) return;
            if (e.name[1] == '3_shieldbow') {
                const shieldbow: HTMLDivElement = document.querySelector(`#vault-${ i + 1 }`);
        
                shieldbow.style.backgroundColor = '';
                shieldbow.innerHTML = ``;
            }
        });
    }
}, 10);

setInterval(() => {
    let nexusIndex = {blue: [7, 8], red: [9, 10]};

    if (gameObjects[nexusIndex[getEnemyTeam()][0]].isCollide(players[team].selector)) {
        players[team].hp[1] -= players[team].hp[0] / 25;
    }

    if (readyStatus[getEnemyTeam()]) {
        players[team].gold += 1;
    }
}, 200);

setInterval(() => {
    let nexusIndex = {blue: [7, 8], red: [9, 10]};

    if (players[team].hp[1] < players[team].hp[0]) players[team].hp[1] += Math.floor(
        (players[team].specINIT.healthBoost + players[team].specINIT.healthBoost * players[team].spec.healthBoost / 100 - players[team].specINIT.healthBoost / 100) * 10
    ) / 10 ;
    
    if (gameObjects[nexusIndex[team][0]].isCollide(players[team].selector)) {
        players[team].hp[1] += players[team].hp[0] / 40;
    };

    if (deathCoolDown[team] > 0) {
        deathCoolDown[team] -= 1
    };
    if (deathCoolDown[team] < 0) deathCoolDown[team] = 0;
    if (deathCoolDown[getEnemyTeam()] > 0) deathCoolDown[getEnemyTeam()] -= 1;
    if (deathCoolDown[getEnemyTeam()] < 0) deathCoolDown[getEnemyTeam()] = 0;
}, 1000)


// 내가 쏜걸 상대방이 맞았을 때
function onhit(type) {
    players[team].gold += 3;
    players[team].hp[1] += players[team].spec.ad * players[team].spec.vamp / 100;
    
    if (hasItem('0_cull')) {
        players[team].gold += findItem('0_cull').body.extra[0];
    }
    if (hasItem('3_guinsu')) {
        cooldownItem.guinsu.time = findItem('3_guinsu').body.extra[1];
        
        if (cooldownItem.guinsu.count < findItem('3_guinsu').body.extra[2]) cooldownItem.guinsu.count += 1;
    }
    if (hasItem('3_kraken')) {
        if (cooldownItem.kraken.count < 3) cooldownItem.kraken.count += 1;
        if (cooldownItem.kraken.count == 2) cooldownItem.kraken.damage = findItem('3_kraken').body.extra[0] + players[team].spec.ad * findItem('3_kraken').body.extra[2];
        if (cooldownItem.kraken.count == 3) {
            cooldownItem.kraken.count = 0;
            cooldownItem.kraken.damage = 0;
        }
    }

    if (hasItem('3_navori')) {
        const decreasePercent = findItem('3_navori').body.extra[0] / 100;
        charClass.cooldown.q -= charClass.cooldownINIT.q * decreasePercent
        charClass.cooldown.e -= charClass.cooldownINIT.e * decreasePercent
        charClass.cooldown.shift -= charClass.cooldownINIT.shift * decreasePercent
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
    } else if (char[team] == 'samira') {
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

        socket.send(JSON.stringify({body: {msg: 'gameEnd'}}));
        return;
    }

    deathCoolDown[team] = 2 + (kda[team][1] + 1) * 5;
    kda[team][1] += 1;
    kda[getEnemyTeam()][0] += 1;

    setTimeout(() => {
        players[team].selector.style.display = '';
        players[team].hp[1] = players[team].hp[0];

        if (team == 'blue') absolutePosition[team] = {x: 200, y: -430};
        if (team == 'red') absolutePosition[team] = {x: 4170, y: -430};
        deathCoolDown[team] = 0;
    }, (deathCoolDown[team] - 1) * 1000);
    
    socket.send(JSON.stringify({body: {msg: "death"}}));
}

function enemyDeath() {
    deathCoolDown[getEnemyTeam()] = 2 + (kda[getEnemyTeam()][1] + 1) * 5;
    kda[getEnemyTeam()][1] += 1;
    kda[team][0] += 1;

    players[getEnemyTeam()].selector.style.display = 'none';
    players[team].gold += 300;
    
    setTimeout(() => {
        players[getEnemyTeam()].selector.style.display = '';
        players[getEnemyTeam()].hp[1] = players[getEnemyTeam()].hp[0];
    
        deathCoolDown[getEnemyTeam()] = 0;
    }, (deathCoolDown[getEnemyTeam()] - 1) * 1000);
}
