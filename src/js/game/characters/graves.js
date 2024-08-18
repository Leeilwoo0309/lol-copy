var graves = new Char();
function makeGraves() {
    graves.passive = function () {
    };
    graves.cooldownINIT = calculateSkillHaste();
    graves.skillQ = function () {
        graves.cooldown.q = graves.cooldownINIT.q;
        var index = 0;
        canMove = false;
        atkWait += skillInfo.q.atkspd * 2 / 10;
        var gravesQSkill = setInterval(function () {
            index += 1;
            var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
            for (var i = -2; i < 3; i++) {
                projectiles[team].push(new ProjectileBuilder()
                    .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad, skillInfo.q.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle + i * 0.2)
                    .setReach(375)
                    .setSpeed(15)
                    .setSize({ height: 25, width: 25 })
                    // .setStyle('gray')
                    .onHit("graves skill q")
                    .build(team));
            }
            if (index >= 2) {
                clearInterval(gravesQSkill);
                setTimeout(function () {
                    canMove = true;
                }, 200);
            }
        }, skillInfo.q.atkspd);
    };
    graves.skillE = function () {
        graves.cooldown.e = graves.cooldownINIT.e;
        players[team].specINIT.moveSpd += skillInfo.e.moveSpd;
        graves.isActive.e = true;
        setTimeout(function () {
            players[team].specINIT.moveSpd -= skillInfo.e.moveSpd;
            graves.isActive.e = false;
        }, skillInfo.e.duration * 10);
    };
    graves.skillLShift = function () {
        graves.cooldown.shift = graves.cooldownINIT.shift;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        var dashLength = 0;
        players[team].specINIT.armor += skillInfo.shift.armor;
        players[team].specINIT.magicRegist += skillInfo.shift.armor;
        graves.isActive.shift = true;
        setTimeout(function () {
            players[team].specINIT.armor -= skillInfo.shift.armor;
            players[team].specINIT.magicRegist -= skillInfo.shift.armor;
            graves.isActive.shift = false;
        }, skillInfo.shift.duration * 10);
        var dash = setInterval(function () {
            canMove = false;
            dashLength += 1;
            if (!checkCollideGraves(absolutePosition[team], angle, dash) && dashLength < skillInfo.shift.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            }
            else {
                clearInterval(dash);
                canMove = true;
            }
        }, 6);
    };
    graves.skillWheel = function () {
        graves.cooldown.wheel = graves.cooldownINIT.wheel;
        for (var i = -skillInfo.wheel.armor / 2; i < skillInfo.wheel.armor / 2; i++) {
            projectiles[team].push(new ProjectileBuilder()
                .setDamage(skillInfo.wheel.damage + players[team].spec.ad * skillInfo.wheel.ad, skillInfo.wheel.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(i / (skillInfo.wheel.armor / 2) * Math.PI)
                .setReach(500)
                .setSpeed(13)
                .setSize({ height: 25, width: 25 })
                // .setStyle('gray')
                .onHit("graves skill wheel")
                .build(team));
        }
    };
    function checkCollideGraves(position, angle, dash) {
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
