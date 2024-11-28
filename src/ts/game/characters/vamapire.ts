const vampire = new Char();
let vampireWheelDamage: number = 1;

function makeVampire() {
    vampire.passive = () => {
    }

    vampire.cooldownINIT = calculateSkillHaste();

    vampire.skillQ = () => {
        if (playerDistance > players[team].spec.range * 1.5) return;

        vampire.cooldown.q = vampire.cooldownINIT.q;
        
        let isCritical: boolean = Math.random() < players[team].spec.criticP / 100 && hasItem("3_shadowflame");
        let damage: number = skillInfo.q.damage + players[team].spec.ap * skillInfo.q.ap;

        // players[getEnemyTeam()].spec.criticD / 100 + 1.75
        socket.send(JSON.stringify({
            body: {msg: "vampire-q", critic: isCritical, wd: vampireWheelDamage}
        }));

        if (isCritical) damage *= players[team].spec.criticD / 100 + 1.75

        players[team].hp[1] += damage * players[team].spec.vamp / 100;
        players[team].hp[1] += damage * skillInfo.q.vamp;
        damageAlert("magic", damage * vampireWheelDamage, isCritical, getEnemyTeam());
        damageAlert("heal", damage * skillInfo.q.vamp + damage * players[team].spec.vamp / 50, isCritical, team);

        socket.send(JSON.stringify({
            body: {
                msg: 'damageAlert',
                info: [
                    "heal",
                    damage * skillInfo.q.vamp + damage * players[team].spec.vamp / 50,
                    false,
                    team
                ]
            }
        }));
    }
    
    vampire.skillE = () => {
        vampire.cooldown.e = vampire.cooldownINIT.e;

        for (let i = -10; i < 10; i++) {
            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(skillInfo.e.damage + players[team].spec.ap * skillInfo.e.ap, "magic")
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(i / 10 * Math.PI)
                    .setReach(450)
                    .setSpeed(25)
                    .setSize({height: 60, width: 40})
                    // .setStyle('gray')
                    .canPass()
                    .onHit(`vampire skill e`)
                    .build(team)
                );
        }
    }
    
    vampire.skillLShift = () => {
        vampire.cooldown.shift = vampire.cooldownINIT.shift;
        vampire.cooldown.q -= vampire.cooldownINIT.q * skillInfo.shift.skillHaste;
        vampire.cooldown.e -= vampire.cooldownINIT.e * skillInfo.shift.skillHaste;
        vampire.cooldown.wheel -= vampire.cooldownINIT.wheel * skillInfo.shift.skillHaste;
    }
    
    vampire.skillWheel = () => {
        vampire.cooldown.wheel = vampire.cooldownINIT.wheel;

        vampire.isActive.wheel = true;
        vampireWheelDamage = 1.1;
        players[team].specINIT.vamp += 30;
        
        projectiles[team].push(
            new ProjectileBuilder()
            .setDamage(skillInfo.wheel.damage + players[team].spec.ap * skillInfo.wheel.ap, "magic")
            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
            .setDegree(0)
            .setReach(500)
            .setSpeed(10)
            .setSize({height: 40, width: 40})
            .setStyle('rgb(100, 0, 0)')
            // .canPass()
            .onHit(`vampire skill wheel`)
            .setTarget()
            .build(team)
        );
        
        setTimeout(() => {
            vampire.isActive.wheel = false;
            vampireWheelDamage = 1;
            players[team].specINIT.vamp -= 30;
        }, skillInfo.wheel.duration * 10);
    }
}