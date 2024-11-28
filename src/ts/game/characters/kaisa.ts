const kaisa = new Char();

function makeKaisa() {
    kaisa.cooldownINIT = calculateSkillHaste();

    kaisa.skillQ = () => {
        if (playerDistance >= 550) return;

        kaisa.cooldown.q = kaisa.cooldownINIT.q;

        socket.send(JSON.stringify({
            body: {
                msg: 'kaisa-passive', count: 1
            }
        }));

        let index: number = 0;
        const kaisaQ = setInterval(() => {
            if (index >= 9) clearInterval(kaisaQ)
            index += 1;

            const x = Math.random() * 100 - 50;
            const y = Math.random() * 100 - 50;


            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad + players[team].spec.ap * skillInfo.q.ap, skillInfo.q.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(0)
                    .setReach(1500)
                    .setSpeed(20)
                    .projOffset({x: x, y: y})
                    .setTarget()
                    .setSize({height: 20, width: 8})
                    .setStyle('rgb(151, 14, 206)')
                    .onHit(`kaisa skill q range`)
                    .ignoreObj()
                    .build(team)
            );
        }, 80);
    }
    
    kaisa.skillE = () => {
        kaisa.cooldown.e = kaisa.cooldownINIT.e;
        
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
    
        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(skillInfo.e.damage + players[team].spec.ad * skillInfo.e.ad + players[team].spec.ap * skillInfo.e.ad, skillInfo.e.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(1500)
                .setSpeed(18)
                .setSize({height: 80, width: 30})
                .setStyle('rgb(164, 40, 241)')
                .onHit(`kaisa skill e`)
                .build(team)
        );
    }
    
    kaisa.skillLShift = () => {
        kaisa.cooldown.shift = kaisa.cooldownINIT.shift;

        atkWait += 100;

        players[team].specINIT.moveSpd += skillInfo.shift.moveSpd;
        
        setTimeout(() => {
            players[team].specINIT.moveSpd -= skillInfo.shift.moveSpd;
            players[team].specItem.atkspd += skillInfo.shift.atkspd * 100;
            
            setTimeout(() => {
                players[team].specItem.atkspd -= skillInfo.shift.atkspd * 100;
                kaisa.isActive.shift = false;
            }, skillInfo.shift.duration * 10);
            
            kaisa.isActive.shift = true;
        }, 1000);
    }
    
    kaisa.skillWheel = () => {
        kaisa.cooldown.wheel = kaisa.cooldownINIT.wheel;
        
        absolutePosition[team] = absolutePosition[getEnemyTeam()];
        players[team].barrier.push([skillInfo.wheel.damage + skillInfo.wheel.ap * players[team].spec.ap + skillInfo.wheel.ad * players[team].spec.ad, skillInfo.wheel.duration]);
    }
}