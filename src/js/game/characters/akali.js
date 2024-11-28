var akali = new Char();
var akaliWheelTimes = 0;
var akaliEPosition = { x: undefined, y: undefined };
var akaliSkillUsed = 0;
var akaliPassive = {
    position: { x: 0, y: 0 },
    isActive: 0,
    isOpen: 0
};
var giryck = 300;
var akaliPassiveObj = document.createElement('div');
akaliPassiveObj.style.width = '490px';
akaliPassiveObj.style.height = '490px';
akaliPassiveObj.style.border = '5px solid rgba(0, 0, 0, 0.4)';
akaliPassiveObj.style.position = 'absolute';
akaliPassiveObj.style.backgroundColor = 'rgba(50, 94, 54, 0.38)';
akaliPassiveObj.style.borderRadius = '100%';
akaliPassiveObj.style.display = 'none';
function makeAkali() {
    document.querySelector('.projectiles').appendChild(akaliPassiveObj);
    akali.cooldownINIT = calculateSkillHaste();
    setInterval(function () {
        if (players[getEnemyTeam()].marker.akali) {
            akali.isActive.shift = true;
        }
        else {
            akali.isActive.shift = false;
        }
        var eDistance = Math.sqrt(Math.pow((absolutePosition[team].x - akaliEPosition.x), 2) + Math.pow((absolutePosition[team].y - akaliEPosition.y), 2));
        var passiveDistance = Math.sqrt(Math.pow((absolutePosition[team].x - akaliPassive.position.x), 2) + Math.pow((absolutePosition[team].y - akaliPassive.position.y), 2));
        if (eDistance <= 150 && akali.isActive.e && akaliSkillUsed === 0) {
            players[team].status.invisible = true;
            alphaMoveSpd = skillInfo.e.moveSpd;
        }
        else {
            players[team].status.invisible = false;
            alphaMoveSpd = 0;
        }
        if (akali.cooldownINIT.shift < 500)
            akali.cooldownINIT.shift = 510;
        if (akaliSkillUsed >= 1)
            akaliSkillUsed -= 1;
        if (akaliPassive.isOpen >= 1) {
            akaliPassiveObj.style.display = 'block';
            akaliPassiveObj.style.left = "".concat(akaliPassive.position.x - cameraPosition.x - 235, "px");
            akaliPassiveObj.style.top = "".concat(-akaliPassive.position.y - cameraPosition.y - 235, "px");
            if (passiveDistance >= 250) {
                akaliPassive.isOpen = 0;
                akaliPassive.isActive = 1000;
                players[team].specINIT.moveSpd += skillInfo.passive.moveSpd;
            }
        }
        else {
            akaliPassiveObj.style.display = 'none';
        }
        var passiveBtn = document.querySelector('.passive-btn');
        if (akaliPassive.isActive >= 1) {
            passiveBtn.style.backgroundColor = 'yellow';
            // passiveBtn.style.color = 'yellow';Z
        }
        else if (akaliPassive.isActive === 0) {
            passiveBtn.style.backgroundColor = 'rgb(144, 148, 167)';
        }
    }, 16);
    setInterval(function () {
        if (akaliPassive.isActive >= 1) {
            akaliPassive.isActive -= 1;
            if (akaliPassive.isActive === 0)
                players[team].specINIT.moveSpd -= skillInfo.passive.moveSpd;
        }
        if (akaliPassive.isOpen >= 1)
            akaliPassive.isOpen -= 1;
    }, 10);
    akali.skillQ = function () {
        akali.cooldown.q = akali.cooldownINIT.q;
        akaliSkillUsed += 20;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        var index = 0;
        index += 1;
        for (var i = -2; i < 3; i++) {
            projectiles[team].push(new ProjectileBuilder()
                .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad + players[team].spec.ap * skillInfo.q.ap, skillInfo.q.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle + i * 0.1)
                .setReach(200)
                .setSpeed(35)
                .canPass()
                .setSize({ height: 35, width: 25 })
                // .setStyle('gray')
                .onHit("akali skill q pas")
                .build(team));
        }
    };
    akali.skillE = function () {
        akali.cooldown.e = akali.cooldownINIT.e;
        akali.isActive.e = true;
        akaliEPosition.x = absolutePosition[team].x;
        akaliEPosition.y = absolutePosition[team].y;
        projectiles[team].push(new ProjectileBuilder()
            .setDamage(0.1, 'melee')
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .projOffset({ x: 135, y: 0 })
            .setDegree(0)
            .setReach(0.0625 * skillInfo.e.duration / 150)
            .setSpeed(0.001)
            .setSize({ height: 300, width: 300 })
            .setStyle('rgb(36, 36, 36)')
            .onHit("akali skill e")
            .canPass()
            .ignoreObj()
            .build(team));
        setTimeout(function () {
            akali.isActive.e = false;
        }, skillInfo.e.duration * 10);
    };
    akali.skillLShift = function () {
        akali.cooldown.shift = akali.cooldownINIT.shift;
        akaliSkillUsed += 20;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        if (!akali.isActive.shift) {
            projectiles[team].push(new ProjectileBuilder()
                //@ts-ignore
                .setDamage(skillInfo.shift.damages[0].damage + players[team].spec.ad * skillInfo.shift.damages[0].ad + players[team].spec.ap * skillInfo.shift.damages[0].ap, skillInfo.shift.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(800)
                .setSpeed(30)
                .setSize({ height: 40, width: 40 })
                .setStyle('rgb(109, 109, 109)')
                .onHit("akali skill shift1 pas")
                .ignoreObj()
                .build(team));
            var dashLength_1 = 0;
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
                if (!checkCollideAkali(absolutePosition[team], angle, dash_1) && dashLength_1 < skillInfo.shift.range) {
                    absolutePosition[team].x += 5 * Math.cos(angle);
                    absolutePosition[team].y += 5 * Math.sin(angle);
                }
                else {
                    clearInterval(dash_1);
                    canMove = true;
                }
            }, 10);
        }
        else {
            akali.cooldown.shift = akali.cooldownINIT.shift;
            akali.cooldown.q += 30;
            akali.cooldown.e += 30;
            socket.send(JSON.stringify({
                body: {
                    msg: 'akali-shift'
                }
            }));
            projectiles[team].push(new ProjectileBuilder()
                //@ts-ignore
                .setDamage(skillInfo.shift.damages[1].damage + players[team].spec.ad * skillInfo.shift.damages[1].ad + players[team].spec.ap * skillInfo.shift.damages[1].ap, skillInfo.shift.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(40000)
                .setSpeed(20)
                .setSize({ height: 20, width: 20 })
                .setStyle('rgb(119, 119, 119)')
                .onHit("akali skill shift2")
                // .canPass(true)
                .ignoreObj()
                .setTarget()
                .ignoreObj(true)
                .build(team));
            akali.cooldown.shift = akali.cooldownINIT.shift;
            var dash_2 = setInterval(function () {
                var angle = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
                canMove = false;
                var collideChecker = document.querySelector('.checker-dash.player');
                var ret = false;
                collideChecker.style.position = 'absolute';
                collideChecker.style.backgroundColor = 'green';
                collideChecker.style.left = "".concat(absolutePosition[team].x + 35 - cameraPosition.x - 5 * Math.cos(angle), "px");
                collideChecker.style.top = "".concat(-absolutePosition[team].y - 35 - cameraPosition.y + 5 * Math.sin(angle), "px");
                collideChecker.style.height = '80px';
                collideChecker.style.width = '80px';
                if (playerDistance > 15) {
                    absolutePosition[team].x -= 5 * Math.cos(angle);
                    absolutePosition[team].y -= 5 * Math.sin(angle);
                }
                else {
                    clearInterval(dash_2);
                    // akali.cooldown.shift = akali.cooldownINIT.shift;
                    absolutePosition[team] = absolutePosition[getEnemyTeam()];
                }
            }, 4);
        }
    };
    akali.skillWheel = function () {
        if (playerDistance > skillInfo.wheel.range[akaliWheelTimes] * 5.5 && akaliWheelTimes === 0)
            return;
        if (akaliWheelTimes === 0)
            akali.cooldown.wheel = 250;
        if (akaliWheelTimes === 1)
            akali.cooldown.wheel = skillInfo.wheel.cooldown;
        akali.isActive.wheel = true;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        var dashLength = 0;
        if (deathCoolDown[getEnemyTeam()] === 0 && akaliWheelTimes === 0) {
            akaliWheelTimes = 1;
            setTimeout(function () {
                if (akaliWheelTimes === 1) {
                    akaliWheelTimes = 0;
                    akali.isActive.wheel = false;
                    akali.cooldown.wheel = skillInfo.wheel.cooldown;
                }
            }, skillInfo.wheel.duration * 10);
            projectiles[team].push(new ProjectileBuilder()
                //@ts-ignore
                .setDamage(skillInfo.wheel.damages[0].damage + players[team].spec.ad * skillInfo.wheel.damages[0].ad + players[team].spec.ap * skillInfo.wheel.damages[0].ap, skillInfo.wheel.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setTarget()
                .setReach(600)
                .setSpeed(20)
                .setSize({ height: 1, width: 1 })
                .setStyle('rgb(127, 182, 238)')
                .onHit("akali skill wheel pas")
                .ignoreObj()
                .build(team));
            var angle_1 = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
            var dash_3 = setInterval(function () {
                dashLength += 1;
                var collideChecker = document.querySelector('.checker-dash.player');
                var ret = false;
                collideChecker.style.position = 'absolute';
                collideChecker.style.backgroundColor = 'green';
                collideChecker.style.left = "".concat(absolutePosition[team].x + 35 - cameraPosition.x - 25 * Math.cos(angle_1), "px");
                collideChecker.style.top = "".concat(-absolutePosition[team].y - 35 - cameraPosition.y + 25 * Math.sin(angle_1), "px");
                collideChecker.style.height = '80px';
                collideChecker.style.width = '80px';
                gameObjects.forEach(function (e, i) {
                    if (e.isCollide(collideChecker) && e.extra.canCollide) {
                        ret = true;
                        clearInterval(dash_3);
                    }
                });
                if (!checkCollideAkali(absolutePosition[team], angle_1, dash_3) && dashLength < skillInfo.wheel.range[0]) {
                    absolutePosition[team].x -= 5 * Math.cos(angle_1);
                    absolutePosition[team].y -= 5 * Math.sin(angle_1);
                }
                else {
                    clearInterval(dash_3);
                }
            }, 0);
        }
        else if (deathCoolDown[getEnemyTeam()] === 0 && akaliWheelTimes === 1) {
            akaliWheelTimes = 0;
            akali.isActive.wheel = false;
            projectiles[team].push(new ProjectileBuilder()
                //@ts-ignore
                .setDamage(skillInfo.wheel.damages[1].damage + players[team].spec.ap * skillInfo.wheel.damages[1].ap + (players[getEnemyTeam()].hp[0] - players[getEnemyTeam()].hp[1]) * skillInfo.wheel.damages[1].armor / 100, skillInfo.wheel.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(350)
                .setSpeed(30)
                .setSize({ height: 20, width: 150 })
                .setStyle('rgb(90, 90, 90)')
                .onHit("akali skill wheel pas")
                .ignoreObj()
                .build(team));
            var dash_4 = setInterval(function () {
                dashLength += 1;
                var collideChecker = document.querySelector('.checker-dash.player');
                var ret = false;
                collideChecker.style.position = 'absolute';
                collideChecker.style.backgroundColor = 'green';
                collideChecker.style.left = "".concat(absolutePosition[team].x + 35 - cameraPosition.x - 40 * Math.cos(angle), "px");
                collideChecker.style.top = "".concat(-absolutePosition[team].y - 35 - cameraPosition.y + 40 * Math.sin(angle), "px");
                collideChecker.style.height = '80px';
                collideChecker.style.width = '80px';
                gameObjects.forEach(function (e, i) {
                    if (e.isCollide(collideChecker) && e.extra.canCollide) {
                        ret = true;
                        clearInterval(dash_4);
                    }
                });
                if (!checkCollideAkali(absolutePosition[team], angle, dash_4) && dashLength < skillInfo.wheel.range[1]) {
                    absolutePosition[team].x -= 9 * Math.cos(angle);
                    absolutePosition[team].y -= 9 * Math.sin(angle);
                }
                else {
                    clearInterval(dash_4);
                }
            }, 0);
        }
    };
    function checkCollideAkali(position, angle, dash) {
        var collideChecker = document.querySelector('.checker-dash.player');
        var ret = false;
        collideChecker.style.position = 'absolute';
        collideChecker.style.backgroundColor = 'green';
        collideChecker.style.left = "".concat(absolutePosition[team].x - 35 - cameraPosition.x - 40 * Math.cos(angle), "px");
        collideChecker.style.top = "".concat(-absolutePosition[team].y - 35 - cameraPosition.y + 40 * Math.sin(angle), "px");
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
