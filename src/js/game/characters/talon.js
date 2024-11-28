var talon = new Char();
var talonHitWheel = false;
function makeTalon() {
    talon.cooldownINIT = calculateSkillHaste();
    setInterval(function () {
    }, 16);
    talon.skillQ = function () {
        if (playerDistance > 300)
            return;
        talon.cooldown.q = talon.cooldownINIT.q;
        players[team].status.invisible = false;
        var dashLength = 0;
        var angle = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
        var dash = setInterval(function () {
            canMove = false;
            dashLength += 1;
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
                    clearInterval(dash);
                    canMove = true;
                }
            });
            if (!checkCollideTalon(absolutePosition[team], angle, dash) && dashLength < skillInfo.q.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            }
            else {
                clearInterval(dash);
                canMove = true;
            }
        }, 1);
        projectiles[team].push(new ProjectileBuilder()
            .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad, skillInfo.q.type)
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .setDegree(angle)
            .setReach(400)
            .setSpeed(20)
            .setSize({ height: 1, width: 1 })
            .setStyle('rgb(145, 176, 202)')
            .onHit("talon skill q")
            .canPass(true)
            .setTarget()
            .ignoreObj(true)
            .build(team));
    };
    talon.skillE = function () {
        talon.cooldown.e = talon.cooldownINIT.e;
        players[team].status.invisible = false;
        var index = 0;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        for (var i = -1; i < 2; i++) {
            projectiles[team].push(new ProjectileBuilder()
                //@ts-ignore
                .setDamage(skillInfo.e.damages[0].damage + players[team].spec.ad * skillInfo.e.damages[0].ad, skillInfo.e.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle + i * 0.25)
                .setReach(300)
                .ignoreObj()
                .canPass()
                .setSpeed(20)
                .setSize({ height: 50, width: 50 })
                .setStyle('rgb(110, 114, 124)')
                .onHit("talon skill e1")
                .build(team));
        }
    };
    talon.skillLShift = function () {
        if (playerDistance >= 500)
            return;
        talon.cooldown.shift = talon.cooldownINIT.shift;
        players[team].status.invisible = false;
        absolutePosition[team] = absolutePosition[getEnemyTeam()];
        socket.send(JSON.stringify({
            body: {
                msg: 'talon-shift'
            }
        }));
        projectiles[team].push(new ProjectileBuilder()
            .setDamage(skillInfo.shift.damage + players[team].spec.ad * skillInfo.shift.ad, skillInfo.shift.type)
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .setDegree(0)
            .setReach(400)
            .setSpeed(20)
            .setSize({ height: 1, width: 1 })
            .setStyle('rgb(145, 176, 202)')
            .onHit("talon skill q")
            .canPass(true)
            .setTarget()
            .ignoreObj(true)
            .build(team));
    };
    talon.skillWheel = function () {
        talonHitWheel = false;
        talon.cooldown.wheel = talon.cooldownINIT.wheel;
        talon.isActive.wheel = true;
        players[team].status.invisible = true;
        players[team].specItem.moveSpd += skillInfo.wheel.moveSpd;
        setTimeout(function () {
            players[team].status.invisible = false;
            talon.isActive.wheel = false;
            players[team].specItem.moveSpd -= skillInfo.wheel.moveSpd;
        }, skillInfo.wheel.duration * 10);
        for (var i = -5; i <= 5; i++) {
            projectiles[team].push(new ProjectileBuilder()
                //@ts-ignore
                .setDamage(10, skillInfo.wheel.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(i / 5 * Math.PI)
                .setReach(150)
                .ignoreObj()
                .canPass()
                .setSpeed(25)
                .setSize({ height: 60, width: 60 })
                .setStyle('rgb(36, 37, 39)')
                .onHit("talon skill wheel")
                .build(team));
        }
    };
    function checkCollideTalon(position, angle, dash) {
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
        if (playerDistance <= 50)
            return true;
        return ret;
    }
}
