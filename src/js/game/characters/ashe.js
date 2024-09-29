var ashe = new Char();
function makeAshe() {
    ashe.cooldownINIT = calculateSkillHaste();
    ashe.skillQ = function () {
        ashe.cooldown.q = ashe.cooldownINIT.q;
        atkWait = 0;
        players[team].specItem.atkspd += 100 * skillInfo.q.atkspd;
        ashe.isActive.q = true;
        setTimeout(function () {
            players[team].specItem.atkspd -= 100 * skillInfo.q.atkspd;
            ashe.isActive.q = false;
        }, skillInfo.q.duration * 10);
    };
    ashe.skillE = function () {
        ashe.cooldown.e = ashe.cooldownINIT.e;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        for (var i = -5; i < 6; i++) {
            projectiles[team].push(new ProjectileBuilder()
                .setDamage(skillInfo.e.damage + players[team].spec.ad * skillInfo.e.ad, skillInfo.e.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle + i * 0.1)
                .setReach(375)
                .setSpeed(10)
                .setSize({ height: 25, width: 10 })
                .setStyle('rgb(70, 160, 235)')
                .onHit("ashe skill e")
                .build(team));
        }
    };
    ashe.skillLShift = function () {
        ashe.cooldown.shift = ashe.cooldownINIT.shift;
        players[team].specINIT.moveSpd += skillInfo.shift.moveSpd;
        ashe.isActive.shift = true;
        setTimeout(function () {
            players[team].specINIT.moveSpd -= skillInfo.shift.moveSpd;
            ashe.isActive.shift = false;
        }, skillInfo.shift.duration * 10);
    };
    ashe.skillWheel = function () {
        ashe.cooldown.wheel = ashe.cooldownINIT.wheel;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        projectiles[team].push(new ProjectileBuilder()
            .setDamage(players[team].spec.ap * skillInfo.wheel.ap + skillInfo.wheel.damage, skillInfo.wheel.type)
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .setDegree(angle)
            .setReach(5000)
            .setSpeed(18)
            .setSize({ height: 300, width: 70 })
            .setStyle('rgb(48, 171, 212)')
            .onHit('ashe skill wheel')
            .ignoreObj()
            .build(team));
    };
}
function asheQ(angle, alphaDamage, target) {
    if (target === void 0) { target = false; }
    var index = 0;
    var asheQ = setInterval(function () {
        if (index >= 5) {
            clearInterval(asheQ);
        }
        else {
            index += 1;
            projectiles[team].push(new ProjectileBuilder()
                .setDamage((players[team].spec.ad + aaA.ad + cooldownItem.kraken.damage + alphaDamage) * 0.2 + skillInfo.q.ad * players[team].spec.ad, aaA.damageType == 'magic' ? 'magic' : players[team].specINIT.damageType)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(players[team].spec.range)
                .setSpeed(players[team].spec.projectileSpd)
                .setSize({ height: 23, width: 15 })
                .onHit("ashe")
                .setStyle('rgb(59, 138, 216)')
                // .ignoreObj()
                .setTarget(target)
                .build(team));
        }
    }, 400 / 5);
}
