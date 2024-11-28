var assassin = new Char();
var assassinPassiveHit = 0;
function makeAssassin() {
    assassin.passive = function () {
    };
    assassin.cooldownINIT = calculateSkillHaste();
    assassin.skillQ = function () {
        assassin.cooldown.q = assassin.cooldownINIT.q;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        var dashLength = 0;
        if (assassin.isActive.wheel) {
            players[team].status.invisible = true;
            assassin.cooldown.q /= 1.3;
            setTimeout(function () {
                players[team].status.invisible = false;
            }, 1000);
        }
        var dash = setInterval(function () {
            canMove = false;
            dashLength += 1;
            if (!checkCollideassassin(absolutePosition[team], angle) && dashLength < skillInfo.q.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            }
            else {
                clearInterval(dash);
                canMove = true;
                aaA.ad = skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad;
            }
        }, 10);
    };
    assassin.skillE = function () {
        assassin.cooldown.e = assassin.cooldownINIT.e;
        players[team].hp[1] += (players[team].hp[0] - players[team].hp[1]) * skillInfo.e.criticD / 100
            + skillInfo.e.damage + skillInfo.e.ad * players[team].spec.ad + skillInfo.e.ap * players[team].spec.ap;
    };
    assassin.skillLShift = function () {
        if (playerDistance > 400)
            return;
        assassin.cooldown.shift = assassin.cooldownINIT.shift;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        projectiles[team].push(new ProjectileBuilder()
            .setDamage(skillInfo.shift.damage + players[team].spec.ad * skillInfo.shift.ad, skillInfo.shift.type)
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .setDegree(angle)
            .setReach(700)
            .setSpeed(32)
            .setSize({ height: 30, width: 15 })
            .setStyle('gray')
            .onHit("skill bondage")
            .setTarget()
            .build(team));
    };
    assassin.skillWheel = function () {
        assassin.cooldown.wheel = assassin.cooldownINIT.wheel;
        assassin.isActive.wheel = true;
        players[team].specItem.ad += skillInfo.wheel.damage;
        players[team].specItem.moveSpd += skillInfo.wheel.moveSpd;
        setTimeout(function () {
            assassin.isActive.wheel = false;
            players[team].specItem.ad -= skillInfo.wheel.damage;
            players[team].specItem.moveSpd -= skillInfo.wheel.moveSpd;
        }, skillInfo.wheel.duration * 10);
    };
    function checkCollideassassin(position, angle) {
        var collideChecker = document.querySelector('.checker-dash.player');
        var ret = false;
        collideChecker.style.position = 'absolute';
        collideChecker.style.backgroundColor = 'green';
        collideChecker.style.left = "".concat(position.x - cameraPosition.x - 5 * Math.cos(angle), "px");
        collideChecker.style.top = "".concat(-position.y - cameraPosition.y + 5 * Math.sin(angle), "px");
        gameObjects.forEach(function (e, i) {
            if (e.isCollide(collideChecker) && e.extra.canCollide) {
                ret = true;
            }
        });
        return ret;
    }
}
