const samira = new Char();

function makeSamira() {
    samira.passive = () => {
        passiveActiveTime += skillInfo.passive.duration;
    }

    samira.cooldownINIT = calculateSkillHaste();

    samira.skillQ = () => {
        samira.cooldown.q = samira.cooldownINIT.q;

        aaA.ad = Math.floor(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad);
        charClass.isActive.q = true;
    }
    
    samira.skillE = () => {
        samira.cooldown.e = samira.cooldownINIT.e;
        
        players[team].specItem.atkspd += 100 * skillInfo.e.atkspd + skillInfo.e.ap * players[team].spec.ap
        charClass.isActive.e = true;
        
        setTimeout(() => {
            players[team].specItem.atkspd -= 100 * skillInfo.e.atkspd + skillInfo.e.ap * players[team].spec.ap
            charClass.isActive.e = false;
        }, skillInfo.e.duration * 10);
    }
    
    samira.skillLShift = () => {
        samira.cooldown.shift = samira.cooldownINIT.shift;
    
        players[team].status.invisible = true;

        charClass.cooldown.q += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100
        charClass.cooldown.e += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100
        charClass.cooldown.wheel += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100
        atkWait += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100

        charClass.isActive.shift = true;
        
        setTimeout(() => {
            players[team].status.invisible = false;
            charClass.isActive.shift = false;
        }, skillInfo.shift.duration * 10 + skillInfo.shift.ap * players[team].spec.ap * 1000)
    }
    
    samira.skillWheel = () => {
        samira.cooldown.wheel = samira.cooldownINIT.wheel;
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        atkWait += 100;
        charClass.cooldown.q += 100;
        charClass.cooldown.e += 100;
        charClass.cooldown.shift += 100;
        charClass.isActive.wheel = true;
        
        socket.send(JSON.stringify({
            body: {
                msg: 'samira-wheel'
            }
        }));
        
        canMove = false;
        
        sniperWheelMotion(getEnemyTeam());
        
        setTimeout(() => {
            charClass.isActive.wheel = false;
            canMove = true;
            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(players[team].spec.ad * skillInfo.wheel.ad + skillInfo.wheel.damage + aaA.ad, skillInfo.wheel.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(5000)
                    .setSpeed(45)
                    .setSize({height: 20, width: 20})
                    .ignoreObj()
                    .setTarget()
                    .onHit('skill')
                    .build(team)
            )
        }, 1000)
    }
}