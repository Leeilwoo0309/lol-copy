var Aphelios = /** @class */ (function () {
    function Aphelios() {
        this.cooldown = {
            q: [0, 0],
            e: 0,
            shift: 0,
            wheel: 0
        };
        this.isActive = {
            q: false,
            e: false,
            shift: false,
            wheel: false
        };
    }
    Aphelios.prototype.passive = function () {
    };
    Aphelios.prototype.skillQ = function () {
    };
    Aphelios.prototype.skillE = function () {
    };
    Aphelios.prototype.skillLShift = function () {
    };
    Aphelios.prototype.skillWheel = function () {
    };
    Aphelios.prototype.update = function () {
    };
    return Aphelios;
}());
var aphelios = new Char();
var apheliosWeapon = ['Calibrum', 'Severum'];
// let apheliosWeapon: [ApheliosWeapon, ApheliosWeapon] = ['Infernum', 'Severum'];
var apheliosWeaponEnemy = ['Calibrum', 'Severum'];
var apheliosAmmo = [50, 50];
var apheliosSkillCooldown = [0, 0];
var apheliosWeaponOrder = ['Gravitum', 'Infernum', 'Crescendum'];
var weaponColor = {
    Calibrum: 'rgb(20, 143, 145)',
    Severum: 'red',
    Gravitum: 'purple',
    Infernum: 'blue',
    Crescendum: 'gray'
};
var crescendumAmount = 0;
var weaponPrint = document.createElement('div');
var subWeaponPrint = document.createElement('div');
weaponPrint.style.color = "white";
weaponPrint.style.backgroundColor = 'rgb(0, 0, 0, 1)';
weaponPrint.style.padding = '2px 3px 1px 3px';
weaponPrint.style.textAlign = 'center';
weaponPrint.style.height = '20px';
weaponPrint.style.width = '17px';
weaponPrint.style.marginTop = '-17px';
weaponPrint.style.marginLeft = '40px';
weaponPrint.style.marginRight = '40px';
weaponPrint.style.borderRadius = '100%';
weaponPrint.innerHTML = '';
subWeaponPrint.style.color = "white";
subWeaponPrint.style.backgroundColor = 'rgb(0, 0, 0, 1)';
subWeaponPrint.style.padding = '2px 3px 1px 3px';
subWeaponPrint.style.textAlign = 'center';
subWeaponPrint.style.height = '20px';
subWeaponPrint.style.width = '17px';
subWeaponPrint.style.marginTop = '-23px';
subWeaponPrint.style.marginLeft = '70px';
subWeaponPrint.style.marginRight = '40px';
subWeaponPrint.style.borderRadius = '100%';
subWeaponPrint.innerHTML = '';
var weaponPrintEnemy = document.createElement('div');
var subWeaponPrintEnemy = document.createElement('div');
weaponPrintEnemy.style.color = "white";
weaponPrintEnemy.style.backgroundColor = 'rgb(0, 0, 0, 1)';
weaponPrintEnemy.style.padding = '2px 3px 1px 3px';
weaponPrintEnemy.style.textAlign = 'center';
weaponPrintEnemy.style.height = '20px';
weaponPrintEnemy.style.width = '17px';
weaponPrintEnemy.style.marginTop = '-17px';
weaponPrintEnemy.style.marginLeft = '40px';
weaponPrintEnemy.style.marginRight = '40px';
weaponPrintEnemy.style.borderRadius = '100%';
weaponPrintEnemy.innerHTML = '';
subWeaponPrintEnemy.style.color = "white";
subWeaponPrintEnemy.style.backgroundColor = 'rgb(0, 0, 0, 1)';
subWeaponPrintEnemy.style.padding = '2px 3px 1px 3px';
subWeaponPrintEnemy.style.textAlign = 'center';
subWeaponPrintEnemy.style.height = '20px';
subWeaponPrintEnemy.style.width = '17px';
subWeaponPrintEnemy.style.marginTop = '-23px';
subWeaponPrintEnemy.style.marginLeft = '70px';
subWeaponPrintEnemy.style.marginRight = '40px';
subWeaponPrintEnemy.style.borderRadius = '100%';
subWeaponPrintEnemy.innerHTML = '';
function makeAphelios() {
    try {
        players[team].selector.removeChild(weaponPrint);
        players[team].selector.removeChild(subWeaponPrint);
    }
    catch (err) { }
    if (char[team] === 'aphelios') {
        players[team].selector.appendChild(weaponPrint);
        players[team].selector.appendChild(subWeaponPrint);
    }
    if (char[getEnemyTeam()] === 'aphelios') {
        players[getEnemyTeam()].selector.appendChild(weaponPrintEnemy);
        players[getEnemyTeam()].selector.appendChild(subWeaponPrintEnemy);
    }
    // 실질 패시브
    setInterval(function () {
        if (char[team] === 'aphelios') {
            skillInfo.q = apheliosSkillInfo.q[apheliosWeapon[0]];
            apheliosSkillCooldown.forEach(function (e, i) {
                if (e > 0)
                    apheliosSkillCooldown[i] -= 1;
            });
            apheliosAmmo.forEach(function (e, i) {
                if (e <= 0) {
                    apheliosAmmo[0] = 50;
                    apheliosWeaponOrder.push(apheliosWeapon[0]);
                    apheliosWeapon[0] = apheliosWeaponOrder[0];
                    apheliosSkillCooldown[0] = 0;
                    aphelios.cooldown.q = 50;
                    apheliosWeaponOrder.splice(0, 1);
                    if (apheliosWeapon[0] === 'Crescendum')
                        crescendumAmount = 0;
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'aphelios-new', info: apheliosWeapon
                        }
                    }));
                }
            });
            if (apheliosWeapon[0] === 'Calibrum') {
                players[team].specINIT.range = 600;
                players[team].specINIT.vamp = 0;
            }
            else if (apheliosWeapon[0] === 'Severum') {
                players[team].specINIT.range = 450;
                players[team].specINIT.vamp = 17.5;
            }
            else if (apheliosWeapon[0] === 'Gravitum') {
                players[team].specINIT.range = 450;
                players[team].specINIT.vamp = 0;
                if (players[getEnemyTeam()].marker.aphelios.Gravitum) {
                    aphelios.isActive.q = true;
                }
                else {
                    aphelios.isActive.q = false;
                }
            }
            else if (apheliosWeapon[1] === 'Crescendum') {
                players[team].specINIT.range = 450;
                players[team].specINIT.vamp = 0;
            }
            else if (apheliosWeapon[1] === 'Infernum') {
                players[team].specINIT.range = 450;
                players[team].specINIT.vamp = 0;
            }
            if (apheliosWeapon[0] !== 'Gravitum') {
                aphelios.isActive.q = false;
            }
        }
        ;
        weaponPrint.style.backgroundColor = weaponColor[apheliosWeapon[0]];
        subWeaponPrint.style.backgroundColor = weaponColor[apheliosWeapon[1]];
        if (char[getEnemyTeam()] === 'aphelios') {
            weaponPrintEnemy.style.backgroundColor = weaponColor[apheliosWeaponEnemy[0]];
            subWeaponPrintEnemy.style.backgroundColor = weaponColor[apheliosWeaponEnemy[1]];
        }
    }, 10);
    aphelios.passive = function () {
    };
    aphelios.cooldownINIT = calculateSkillHaste();
    aphelios.skillQ = function () {
        if (!players[getEnemyTeam()].marker.aphelios.Gravitum && apheliosWeapon[0] === 'Gravitum')
            return;
        aphelios.cooldown.q = aphelios.cooldownINIT.q;
        apheliosSkillCooldown[0] = aphelios.cooldownINIT.q;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        var index = 0;
        if (apheliosWeapon[0] === 'Calibrum') {
            apheliosAmmo[0] -= 10;
            aphelios.cooldown.e += 30;
            projectiles[team].push(new ProjectileBuilder()
                .setDamage(players[team].spec.ad * skillInfo.q.ad + players[team].spec.ap * skillInfo.q.ap + skillInfo.q.damage, skillInfo.q.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(700)
                .setSpeed(24)
                .setSize({ height: 70, width: 35 })
                .setStyle('darkturquoise')
                .onHit("aphelios skill q-calibrum sub-Calibrum")
                .build(team));
        }
        else if (apheliosWeapon[0] === 'Severum') {
            atkWait += 250;
            aphelios.cooldown.e += 250;
            apheliosSeverumQMotion(team);
            var severumQ_1 = setInterval(function () {
                var weapon = apheliosWeapon[(index + 1) % 2];
                if (index >= 8) {
                    apheliosAmmo[0] -= 10;
                    clearInterval(severumQ_1);
                    charClass.isActive.q = false;
                    alphaMoveSpd = 0;
                    styleGradePrint.style.backgroundColor = "".concat(samiraStyleGradeBgc[styleGrade]);
                    styleGradePrint.innerHTML = "".concat(samiraStyleGrade[styleGrade]);
                }
                index += 1;
                var angel = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
                if (playerDistance <= skillInfo.q.range) {
                    if (deathCoolDown[getEnemyTeam()] > 0)
                        return;
                    projectiles[team].push(new ProjectileBuilder()
                        .setDamage((skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad) * (apheliosWeapon[1] === 'Infernum' && (index + 1) % 2 === 1 ? 1.5 : 1), skillInfo.q.type)
                        .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                        .setDegree(angel)
                        .setReach(skillInfo.q.range * 2)
                        .setSpeed(40)
                        .setSize({ height: 18, width: 18 })
                        .setStyle(weaponColor[weapon])
                        .onHit("skill aphelios q-severum sub-".concat(weapon))
                        .setTarget()
                        .ignoreObj()
                        .build(team));
                }
            }, 250);
        }
        else if (apheliosWeapon[0] === 'Gravitum') {
            apheliosAmmo[0] -= 10;
            socket.send(JSON.stringify({
                body: {
                    msg: 'aphelios-gravitum-q'
                }
            }));
            var damage = skillInfo.q.damage + skillInfo.q.ad * players[team].spec.ad + skillInfo.q.ap * players[team].spec.ap;
            damageAlert('magic', damage * (1 / (1 + players[getEnemyTeam()].spec.magicRegist * 0.01)), false, getEnemyTeam());
        }
        else if (apheliosWeapon[0] === 'Infernum') {
            canMove = false;
            apheliosAmmo[0] -= 10;
            var index_1 = 0;
            var infernumQ_1 = setInterval(function () {
                index_1 += 1;
                projectiles[team].push(new ProjectileBuilder()
                    .setDamage(skillInfo.q.damage + players[team].spec.ap * skillInfo.q.ap + players[team].spec.ad * skillInfo.q.ad, "melee")
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle - (index_1 - 3) * 0.2)
                    .setReach(450)
                    .setSpeed(25)
                    .setSize({ height: 60, width: 40 })
                    // .setStyle('gray')
                    .canPass()
                    .onHit("aphelios skill q-infernum")
                    .build(team));
                if (index_1 === 4) {
                    clearInterval(infernumQ_1);
                    // setTimeout(() => { canMove = true; }, 100)
                }
            }, 50);
            setTimeout(function () {
                var index = 0;
                var infernumQ2 = setInterval(function () {
                    index += 1;
                    projectiles[team].push(new ProjectileBuilder()
                        .setDamage(skillInfo.q.damage + players[team].spec.ap * skillInfo.q.ap + players[team].spec.ad * skillInfo.q.ad, "melee")
                        .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                        .setDegree(angle - (index - 3) * 0.2)
                        .setReach(450)
                        .setSpeed(25)
                        .setSize({ height: 60, width: 40 })
                        .setStyle("".concat(weaponColor[apheliosWeapon[1]]))
                        .canPass()
                        .onHit("aphelios skill q-infernum sub-".concat(apheliosWeapon[1]))
                        .build(team));
                    if (index === 4) {
                        clearInterval(infernumQ2);
                        setTimeout(function () { canMove = true; }, 100);
                    }
                }, 50);
            }, 400);
        }
        else if (apheliosWeapon[0] === 'Crescendum') {
            apheliosAmmo[0] -= 10;
            crescendumAmount += 2;
            var dashLength_1 = 0;
            canMove = false;
            var dash_1 = setInterval(function () {
                canMove = false;
                dashLength_1 += 1;
                var collideChecker = document.querySelector('.checker-dash.player');
                var ret = false;
                collideChecker.style.position = 'absolute';
                collideChecker.style.backgroundColor = 'green';
                collideChecker.style.left = "".concat(absolutePosition[team].x + 35 - cameraPosition.x - 5 * Math.cos(angle), "px");
                collideChecker.style.top = "".concat(-absolutePosition[team].y - 35 - cameraPosition.y + 5 * Math.sin(angle), "px");
                collideChecker.style.height = '80px';
                collideChecker.style.width = '80px';
                gameObjects.forEach(function (e, i) {
                    if (e.isCollide(collideChecker) && e.extra.canCollide) {
                        ret = true;
                        clearInterval(dash_1);
                        canMove = true;
                    }
                });
                if (!checkCollidePhel(absolutePosition[team], angle, dash_1) && dashLength_1 < 25) {
                    absolutePosition[team].x -= 5 * Math.cos(angle);
                    absolutePosition[team].y -= 5 * Math.sin(angle);
                }
                else {
                    clearInterval(dash_1);
                    canMove = true;
                }
            }, 6);
        }
    };
    aphelios.skillE = function () {
        aphelios.cooldown.e = aphelios.cooldownINIT.e;
        apheliosWeapon = [apheliosWeapon[1], apheliosWeapon[0]];
        apheliosSkillCooldown = [apheliosSkillCooldown[1], apheliosSkillCooldown[0]];
        apheliosAmmo = [apheliosAmmo[1], apheliosAmmo[0]];
        aphelios.cooldown.q = apheliosSkillCooldown[0];
        skillInfo.q = apheliosSkillInfo.q[apheliosWeapon[0]];
        socket.send(JSON.stringify({
            body: {
                msg: 'aphelios-change'
            }
        }));
    };
    aphelios.skillLShift = function () {
    };
    aphelios.skillWheel = function () {
        aphelios.cooldown.wheel = skillInfo.wheel.cooldown;
        aphelios.cooldown.e += 50;
        aphelios.cooldown.q += 50;
        socket.send(JSON.stringify({
            body: {
                msg: "aphelios-wheel"
            }
        }));
        canMove = false;
        apheliosWheelWheelMotion(team, { x: absolutePosition[team].x, y: absolutePosition[team].y });
        // apheliosSeverumQMotion(team);
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        setTimeout(function () {
            canMove = true;
            var damage = players[team].spec.ad * skillInfo.wheel.ad + players[team].spec.ap * skillInfo.wheel.ap + skillInfo.wheel.damage;
            if (apheliosWeapon[0] === 'Infernum')
                damage *= 2.5;
            projectiles[team].push(new ProjectileBuilder()
                .setDamage(damage, skillInfo.wheel.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(700)
                .setSpeed(24)
                .setSize({ height: 120, width: 120 })
                .setStyle("".concat(weaponColor[apheliosWeapon[0]]), 40)
                .onHit("aphelios skill wheel sub-".concat(apheliosWeapon[0]))
                .ignoreObj()
                .build(team));
        }, 400);
    };
    function checkCollidePhel(position, angle, dash) {
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
}
/**
 *
 * @param _team 맞을 팀 쓰셈ㅇ
 */
function apheliosSeverumQMotion(_team) {
    var eff = document.createElement('div');
    var index = 0;
    game.appendChild(eff);
    eff.style.transition = 'opacity 300ms';
    eff.style.opacity = '0%';
    setTimeout(function () {
        eff.style.opacity = '100%';
    }, 10);
    var effectInterval = setInterval(function () {
        if (index >= 200) {
            setTimeout(function () {
                eff.style.opacity = '0%';
            }, 300);
            setTimeout(function () {
                clearInterval(effectInterval);
                game.removeChild(eff);
            }, 500);
        }
        ;
        index += 1;
        // let range = char[_team] == 'samira' ? skillInfo.wheel.range * 3 : enemySkillInfo.wheel.range * 3
        var range = skillInfo.q.range * 1.8 + players[_team].size;
        eff.style.top = "".concat(-absolutePosition[_team].y - cameraPosition.y - (range / 2) + players[_team].size / 2, "px");
        eff.style.left = "".concat(absolutePosition[_team].x - cameraPosition.x - (range / 2) + players[_team].size / 2, "px");
        eff.style.position = 'absolute';
        eff.style.height = "".concat(range, "px");
        eff.style.width = "".concat(range, "px");
        eff.style.border = "3px solid ".concat(_team);
        eff.style.borderRadius = '100%';
        eff.style.backgroundColor = 'rgb(0, 0, 0, 0)';
    }, 10);
}
function crescendumAa(angle, target) {
    if (target === void 0) { target = false; }
    var index = 0;
    var crescendumAtk = setInterval(function () {
        if (index >= crescendumAmount) {
            clearInterval(crescendumAtk);
        }
        else {
            index += 1;
            projectiles[team].push(new ProjectileBuilder()
                .setDamage((players[team].spec.ad + aaA.ad) * 0.05, aaA.damageType == 'magic' ? 'magic' : players[team].specINIT.damageType)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(players[team].spec.range)
                .setSpeed(players[team].spec.projectileSpd)
                .setSize({ height: 15, width: 15 })
                .setStyle('rgb(50, 50, 50)')
                .onHit("aphelios Crescendum")
                .ignoreObj()
                .setTarget(target)
                .build(team));
        }
    }, 400 / crescendumAmount);
}
/**
 *
 * @param _team 맞을 팀 쓰셈ㅇ
 */
function apheliosWheelWheelMotion(_team, position) {
    var eff = document.createElement('div');
    var index = 0;
    game.appendChild(eff);
    eff.style.transition = 'opacity 300ms';
    eff.style.opacity = '0%';
    setTimeout(function () {
        eff.style.opacity = '40%';
    }, 40);
    var effectInterval = setInterval(function () {
        if (index >= 35) {
            setTimeout(function () {
                clearInterval(effectInterval);
                game.removeChild(eff);
            }, 50);
        }
        ;
        index += 1;
        // absolutePosition[getEnemyTeam()].x - cameraPosition.x
        // -absolutePosition[getEnemyTeam()].y - cameraPosition.y
        var range = 80 + players[_team].size;
        eff.style.top = "".concat(-position.y - cameraPosition.y - (range / 2) + players[_team].size / 2.5, "px");
        eff.style.left = "".concat(position.x - cameraPosition.x - (range / 2) + players[_team].size / 2.5, "px");
        eff.style.position = 'absolute';
        eff.style.height = "".concat(range, "px");
        eff.style.width = "".concat(range, "px");
        // eff.style.border = `3px solid ${ _team }`;
        eff.style.borderRadius = '100%';
        eff.style.zIndex = '-1';
        eff.style.backgroundColor = "".concat(char[team] === 'aphelios' ? weaponColor[apheliosWeapon[0]] : weaponColor[apheliosWeaponEnemy[0]]);
        // eff.style.backgroundColor = `red`;
    }, 10);
}
