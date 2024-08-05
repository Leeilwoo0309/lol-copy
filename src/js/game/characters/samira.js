var samira = new Char();
var samiraStyleGrade = [" ", "E", "D", "C", "B", "A", "S"];
var samiraStyleGradeBgc = ["rgb(0, 0, 0, 1)", "gray", "gray", "gray", "rgb(244, 159, 47)", "rgb(255, 94, 0)", "red"];
var styleGrade = 0;
var lastAttackType = undefined;
var currentAttackType = '김치!!';
var styleGradePrint = document.createElement('div');
styleGradePrint.style.color = "white";
styleGradePrint.style.backgroundColor = 'rgb(0, 0, 0, 1)';
styleGradePrint.style.padding = '2px 3px 1px 3px';
styleGradePrint.style.textAlign = 'center';
styleGradePrint.style.marginTop = '-15px';
styleGradePrint.style.marginLeft = '-30px';
styleGradePrint.style.marginRight = '40px';
styleGradePrint.style.borderRadius = '100%';
styleGradePrint.style.display = 'none';
function makeSamira() {
    samira.cooldownINIT = calculateSkillHaste();
    // styleGradePrint.style.position = `absolute`
    try {
        players[team].selector.removeChild(styleGradePrint);
    }
    catch (err) { }
    players[team].selector.appendChild(styleGradePrint);
    samira.passive = function () {
        passiveActiveTime = 600;
        if (styleGrade < 6 && lastAttackType !== currentAttackType) {
            styleGrade += 1;
            alphaMoveSpd = skillInfo.passive.moveSpd * styleGrade;
            lastAttackType = currentAttackType;
            if (styleGrade !== 0)
                styleGradePrint.style.display = '';
            else if (styleGrade === 0)
                styleGradePrint.style.display = 'none';
            styleGradePrint.style.backgroundColor = "".concat(samiraStyleGradeBgc[styleGrade]);
            styleGradePrint.innerHTML = "".concat(samiraStyleGrade[styleGrade]);
        }
        if (styleGrade == 6) {
            charClass.isActive.wheel = true;
        }
    };
    samira.skillQ = function () {
        samira.cooldown.q = samira.cooldownINIT.q;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        projectiles[team].push(new ProjectileBuilder()
            .setDamage(players[team].spec.ad * skillInfo.q.ad + skillInfo.q.damage, skillInfo.q.type)
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .setDegree(angle)
            .setReach(550)
            .setSpeed(34)
            .setSize({ height: 45, width: 20 })
            .setStyle('rgb(97, 20, 20)')
            .onHit("skill samira q")
            .build(team));
    };
    samira.skillE = function () {
        samira.cooldown.e = samira.cooldownINIT.e;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        projectiles[team].push(new ProjectileBuilder()
            .setDamage(skillInfo.e.damage + players[team].spec.ad * skillInfo.e.ad + players[team].spec.ap * skillInfo.e.ap, skillInfo.e.type)
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .setDegree(angle)
            .setReach(700)
            .setSpeed(20)
            .setSize({ height: 30, width: 30 })
            .setStyle('gray')
            .onHit("skill samira e")
            .setTarget()
            .build(team));
    };
    samira.skillLShift = function () {
        if (playerDistance >= skillInfo.shift.range * 5)
            return;
        samira.cooldown.shift = samira.cooldownINIT.shift;
        var angle = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
        var dashLength = 0, isCollide = false;
        ;
        var dash = setInterval(function () {
            dashLength += 1;
            if (!checkCollideSamira(absolutePosition[team], angle) && dashLength < skillInfo.shift.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
                var rect1 = players[team].selector.getBoundingClientRect();
                var rect2 = players[getEnemyTeam()].selector.getBoundingClientRect();
                if (!(rect1.right < rect2.left ||
                    rect1.left > rect2.right ||
                    rect1.bottom < rect2.top ||
                    rect1.top > rect2.bottom) && !isCollide) {
                    var dashDamage = skillInfo.shift.damage;
                    if (skillInfo.shift.ad)
                        dashDamage += skillInfo.shift.ad * players[team].spec.ad;
                    if (skillInfo.shift.ap)
                        dashDamage += skillInfo.shift.ap * players[team].spec.ap;
                    damageAmount[team] += dashDamage * (1 / (1 + players[getEnemyTeam()].spec.magicRegist * 0.01));
                    damageAlert('magic', dashDamage * (1 / (1 + players[getEnemyTeam()].spec.magicRegist * 0.01)), false, getEnemyTeam());
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'collideDash'
                        }
                    }));
                    isCollide = true;
                    currentAttackType = 'shift';
                    onhit("skill");
                }
            }
            else {
                clearInterval(dash);
            }
        }, 1);
    };
    samira.skillWheel = function () {
        if (styleGrade === 6) {
            samira.cooldown.wheel = samira.cooldownINIT.wheel;
            charClass.cooldown.q += 230;
            charClass.cooldown.e += 230;
            atkWait += 230;
            var index_1 = 0;
            alphaMoveSpd -= skillInfo.wheel.moveSpd;
            var infernoTrigger_1 = setInterval(function () {
                if (index_1 >= 10) {
                    clearInterval(infernoTrigger_1);
                    clearInterval(infernoTriggerEff_1);
                    charClass.isActive.wheel = false;
                    alphaMoveSpd = 0;
                    if (styleGrade === 0)
                        styleGradePrint.style.display = 'none';
                    styleGradePrint.style.backgroundColor = "".concat(samiraStyleGradeBgc[styleGrade]);
                    styleGradePrint.innerHTML = "".concat(samiraStyleGrade[styleGrade]);
                    charClass.cooldown.shift = 0;
                    charClass.cooldown.e = 0;
                    lastAttackType = 'wheel';
                    styleGrade = 0;
                    if (styleGrade !== 0)
                        styleGradePrint.style.display = '';
                    else if (styleGrade === 0)
                        styleGradePrint.style.display = 'none';
                    styleGradePrint.style.backgroundColor = "".concat(samiraStyleGradeBgc[styleGrade]);
                    styleGradePrint.innerHTML = "".concat(samiraStyleGrade[styleGrade]);
                }
                index_1 += 1;
                var angel = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
                projectiles[team].push(new ProjectileBuilder()
                    .setDamage(skillInfo.wheel.damage + players[team].spec.ad * skillInfo.wheel.ad, skillInfo.wheel.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angel)
                    .setReach(skillInfo.wheel.range)
                    .setSpeed(40)
                    .setSize({ height: 35, width: 15 })
                    .setStyle('rgb(128, 59, 24)')
                    .onHit("skill samira wheel")
                    .setTarget()
                    .build(team));
            }, 200);
            var infernoTriggerEff_1 = setInterval(function () {
                projectiles[team].push(new ProjectileBuilder()
                    .setDamage(0, skillInfo.wheel.type)
                    .setCritical(0, 0)
                    .setDegree(Math.random() * Math.PI * 2 - Math.PI)
                    .setReach(skillInfo.wheel.range)
                    .setSpeed(30)
                    .setSize({ height: 20, width: 20 })
                    // .setStyle('rgb(128, 59, 24)')
                    .onHit("skill")
                    .build(team));
            }, 50);
        }
    };
    function checkCollideSamira(position, angle) {
        var collideChecker = document.querySelector('.checker-dash.player');
        var ret = false;
        collideChecker.style.position = 'absolute';
        collideChecker.style.backgroundColor = 'green';
        collideChecker.style.left = "".concat(position.x - cameraPosition.x - 6 * Math.cos(angle), "px");
        collideChecker.style.top = "".concat(-position.y - cameraPosition.y + 14 * Math.sin(angle), "px");
        gameObjects.forEach(function (e, i) {
            if (e.isCollide(collideChecker) && e.extra.canCollide) {
                ret = true;
            }
        });
        return ret;
    }
}
