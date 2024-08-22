const vayne = new Char();
let vaynePassiveHit: number = 0;

function makeVayne() {
    vayne.passive = () => {
    }

    vayne.cooldownINIT = calculateSkillHaste();

    vayne.skillQ = () => {
        vayne.cooldown.q = vayne.cooldownINIT.q;
    
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
    
        let dashLength = 0;

        if (vayne.isActive.wheel) {
            players[team].status.invisible = true;
            vayne.cooldown.q /= 1.3;
            
            setTimeout(() => {
                players[team].status.invisible = false;
            }, 1000);
        }
    
        const dash = setInterval(() => {
            canMove = false;
            dashLength += 1;
            if (!checkCollideVayne(absolutePosition[team], angle) && dashLength < skillInfo.q.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            } else {
                clearInterval(dash);
                canMove = true;
                aaA.ad = skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad;
            }
        }, 10);
    }
    
    vayne.skillE = () => {
        vayne.cooldown.e = vayne.cooldownINIT.e;

        players[team].hp[1] += (players[team].hp[0] - players[team].hp[1]) * skillInfo.e.criticD / 100
            + skillInfo.e.damage + skillInfo.e.ad * players[team].spec.ad + skillInfo.e.ap * players[team].spec.ap;
    }
    
    vayne.skillLShift = () => {
        if (deathCoolDown[getEnemyTeam()] > 0) return;
        if (playerDistance > 400) return;
        vayne.cooldown.shift = vayne.cooldownINIT.shift;

        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(skillInfo.shift.damage + players[team].spec.ad * skillInfo.shift.ad, skillInfo.shift.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(700)
                .setSpeed(32)
                .setSize({height: 30, width: 15})
                .setStyle('gray')
                .onHit(`skill bondage`)
                .setTarget()
                .build(team)
        );
    }
    
    vayne.skillWheel = () => {
        vayne.cooldown.wheel = vayne.cooldownINIT.wheel;

        vayne.isActive.wheel = true;
        players[team].specItem.ad += skillInfo.wheel.damage;
        players[team].specItem.moveSpd += skillInfo.wheel.moveSpd;
        
        setTimeout(() => {
            vayne.isActive.wheel = false;
            players[team].specItem.ad -= skillInfo.wheel.damage;
            players[team].specItem.moveSpd -= skillInfo.wheel.moveSpd;
        }, skillInfo.wheel.duration * 10);
    }

    function checkCollideVayne(position: Position, angle: number) {
        const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
        let ret: boolean = false;
    
        collideChecker.style.position = 'absolute';
        collideChecker.style.backgroundColor = 'green';
    
        collideChecker.style.left = `${ position.x - cameraPosition.x - 5 * Math.cos(angle) }px`;
        collideChecker.style.top = `${ -position.y - cameraPosition.y + 5 * Math.sin(angle) }px`;
    
        gameObjects.forEach((e, i) => {
            if (e.isCollide(collideChecker) && e.extra.canCollide) {
                ret = true;
            }
        });
    
        return ret;
    }
}