var kaisa = new Char();
function makeKaisa() {
    kaisa.cooldownINIT = calculateSkillHaste();
    kaisa.skillQ = function () {
        if (playerDistance >= 550)
            return;
        kaisa.cooldown.q = kaisa.cooldownINIT.q;
        socket.send(JSON.stringify({
            body: {
                msg: 'kaisa-passive', count: 1
            }
        }));
        var index = 0;
        var kaisaQ = setInterval(function () {
            if (index >= 9)
                clearInterval(kaisaQ);
            index += 1;
            var x = Math.random() * 100 - 50;
            var y = Math.random() * 100 - 50;
            projectiles[team].push(new ProjectileBuilder()
                .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad + players[team].spec.ap * skillInfo.q.ap, skillInfo.q.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(0)
                .setReach(1500)
                .setSpeed(20)
                .projOffset({ x: x, y: y })
                .setTarget()
                .setSize({ height: 20, width: 8 })
                .setStyle('rgb(151, 14, 206)')
                .onHit("kaisa skill q range")
                .ignoreObj()
                .build(team));
        }, 80);
    };
    kaisa.skillE = function () {
        kaisa.cooldown.e = kaisa.cooldownINIT.e;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        projectiles[team].push(new ProjectileBuilder()
            .setDamage(skillInfo.e.damage + players[team].spec.ad * skillInfo.e.ad + players[team].spec.ap * skillInfo.e.ad, skillInfo.e.type)
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .setDegree(angle)
            .setReach(1500)
            .setSpeed(18)
            .setSize({ height: 80, width: 30 })
            .setStyle('rgb(164, 40, 241)')
            .onHit("kaisa skill e")
            .build(team));
    };
    kaisa.skillLShift = function () {
        kaisa.cooldown.shift = kaisa.cooldownINIT.shift;
        atkWait += 100;
        players[team].specINIT.moveSpd += skillInfo.shift.moveSpd;
        setTimeout(function () {
            players[team].specINIT.moveSpd -= skillInfo.shift.moveSpd;
            players[team].specItem.atkspd += skillInfo.shift.atkspd * 100;
            setTimeout(function () {
                players[team].specItem.atkspd -= skillInfo.shift.atkspd * 100;
                kaisa.isActive.shift = false;
            }, skillInfo.shift.duration * 10);
            kaisa.isActive.shift = true;
        }, 1000);
    };
    kaisa.skillWheel = function () {
        kaisa.cooldown.wheel = kaisa.cooldownINIT.wheel;
        var dash = setInterval(function () {
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
            if (playerDistance > 35) {
                absolutePosition[team].x -= 30 * Math.cos(angle);
                absolutePosition[team].y -= 30 * Math.sin(angle);
            }
            else {
                clearInterval(dash);
                // akali.cooldown.shift = akali.cooldownINIT.shift;
                absolutePosition[team] = absolutePosition[getEnemyTeam()];
            }
        }, 4);
        // absolutePosition[team] = absolutePosition[getEnemyTeam()];
        players[team].barrier.push([skillInfo.wheel.damage + skillInfo.wheel.ap * players[team].spec.ap + skillInfo.wheel.ad * players[team].spec.ad, skillInfo.wheel.duration]);
    };
}
