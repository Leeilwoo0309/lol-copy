var sniper = new Char();
var passiveActiveTime = 0;
var alphaMoveSpd = 0;
function makeSniper() {
    sniper.passive = function () {
        passiveActiveTime += skillInfo.passive.duration;
    };
    sniper.cooldownINIT = calculateSkillHaste();
    sniper.skillQ = function () {
        sniper.cooldown.q = sniper.cooldownINIT.q;
        aaA.ad = Math.floor(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad);
        charClass.isActive.q = true;
    };
    sniper.skillE = function () {
        sniper.cooldown.e = sniper.cooldownINIT.e;
        players[team].specItem.atkspd += 100 * skillInfo.e.atkspd + skillInfo.e.ap * players[team].spec.ap;
        charClass.isActive.e = true;
        setTimeout(function () {
            players[team].specItem.atkspd -= 100 * skillInfo.e.atkspd + skillInfo.e.ap * players[team].spec.ap;
            charClass.isActive.e = false;
        }, skillInfo.e.duration * 10);
    };
    sniper.skillLShift = function () {
        sniper.cooldown.shift = sniper.cooldownINIT.shift;
        players[team].status.invisible = true;
        // charClass.cooldown.q += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100
        // charClass.cooldown.e += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100
        charClass.cooldown.wheel += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100;
        atkWait += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100;
        charClass.isActive.shift = true;
        setTimeout(function () {
            players[team].status.invisible = false;
            charClass.isActive.shift = false;
        }, skillInfo.shift.duration * 10 + skillInfo.shift.ap * players[team].spec.ap * 1000);
    };
    sniper.skillWheel = function () {
        sniper.cooldown.wheel = sniper.cooldownINIT.wheel;
        var angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        atkWait += 100;
        charClass.cooldown.q += 100;
        charClass.cooldown.e += 100;
        charClass.cooldown.shift += 100;
        charClass.isActive.wheel = true;
        socket.send(JSON.stringify({
            body: {
                msg: 'sniper-wheel'
            }
        }));
        canMove = false;
        sniperWheelMotion(getEnemyTeam());
        setTimeout(function () {
            charClass.isActive.wheel = false;
            canMove = true;
            projectiles[team].push(new ProjectileBuilder()
                .setDamage(players[team].spec.ad * skillInfo.wheel.ad + skillInfo.wheel.damage + aaA.ad, skillInfo.wheel.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(5000)
                .setSpeed(45)
                .setSize({ height: 20, width: 20 })
                .ignoreObj()
                .setTarget()
                .onHit('skill')
                .build(team));
        }, 1000);
    };
}
/**
 *
 * @param _team 맞을 팀 쓰셈ㅇ
 */
function sniperWheelMotion(_team) {
    var eff = document.createElement('div');
    var eff2 = document.createElement('div');
    var eff3 = document.createElement('div');
    var index = 0;
    game.appendChild(eff);
    eff.appendChild(eff2);
    eff.appendChild(eff3);
    var effectInterval = setInterval(function () {
        if (index >= 100) {
            clearInterval(effectInterval);
            game.removeChild(eff);
        }
        ;
        index += 1;
        eff.style.top = "".concat(-absolutePosition[_team].y - cameraPosition.y - players[_team].size * 1.3, "px");
        eff.style.left = "".concat(absolutePosition[_team].x - cameraPosition.x - players[_team].size * 1.3, "px");
        eff.style.position = 'absolute';
        eff.style.height = "100px";
        eff.style.width = "100px";
        eff.style.border = "3px solid red";
        eff.style.borderRadius = '100%';
        eff.style.backgroundColor = 'rgb(0, 0, 0, 0)';
        eff2.style.height = "100%";
        eff2.style.width = "0px";
        eff2.style.marginLeft = "50px";
        eff2.style.marginRight = "50px";
        eff2.style.borderLeft = "2px solid red";
        eff3.style.height = "0px";
        eff3.style.width = "100%";
        eff3.style.marginTop = "-50px";
        eff3.style.marginBottom = "50px";
        eff3.style.borderBottom = "2px solid red";
    }, 10);
}
