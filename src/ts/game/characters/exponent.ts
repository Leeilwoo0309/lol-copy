const exponent = new Char();
let exponentPassiveStack: number = 0;
let exponentIsPassiveOn: boolean = false;

function makeExponent() {
    
    setInterval(() => {
        if (char[team] == 'exponent') {
            document.querySelector('.passive-btn').innerHTML = `${ exponentPassiveStack }`;
            if (exponentPassiveStack >= 40) {
                players[team].specINIT.projectileSize = [20, 100];
                players[team].specINIT.projectileSpd = 20;
                players[team].specINIT.damageType = "magic";
            }
        }
    }, 16);

    exponent.cooldownINIT = calculateSkillHaste();
    exponent.passive = () => {
        players[team].specINIT.ad += skillInfo.passive.ad;
        players[team].specINIT.ap += skillInfo.passive.ap;
        players[team].specINIT.health += skillInfo.passive.health;
        players[team].hp[1] += skillInfo.passive.health;
        players[team].specINIT.armor += skillInfo.passive.armor;
        players[team].specINIT.magicRegist += skillInfo.passive.magicRegist;
        players[team].specINIT.range += skillInfo.passive.range;
        
        if (players[team].specINIT.range > 700) players[team].specINIT.range = 700;
    }

    if (!exponentIsPassiveOn) {
        exponentIsPassiveOn = true;
        setInterval(() => {
            if (char[team] == 'exponent') {
                exponentPassiveStack += 1;
                if (exponentPassiveStack >= 40) {
                    players[team].specINIT.ad += skillInfo.passive.ad * 0.5;
                    players[team].specINIT.ap += skillInfo.passive.ap * 0.5;
                    players[team].specINIT.health += skillInfo.passive.health * 0.5;
                    players[team].hp[1] += skillInfo.passive.health * 0.5;
                    players[team].specINIT.armor += skillInfo.passive.armor * 0.5;
                    players[team].specINIT.magicRegist += skillInfo.passive.magicRegist * 0.5;
                }
    
                exponent.passive();
            }
        }, skillInfo.passive.cooldown * 10);
    }

    exponent.skillQ = () => {
        exponent.cooldown.q = exponent.cooldownINIT.q;
    
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad + players[team].spec.ap * skillInfo.q.ap, skillInfo.q.type)
                .setCritical(0, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(550)
                .setSpeed(16)
                .setSize({height: 60, width: 20})
                .setStyle('rgb(240, 180, 120)')
                .onHit(`skill exponent q`)
                .setTarget()
                .build(team)
        );
    }
    
    exponent.skillE = () => {
        exponent.cooldown.e = exponent.cooldownINIT.e;

        players[team].hp[1] += skillInfo.e.damage + skillInfo.e.ap * players[team].spec.ap;
        players[team].specINIT.moveSpd += skillInfo.e.moveSpd;
        
        setTimeout(() => {
            players[team].specINIT.moveSpd -= skillInfo.e.moveSpd;
        }, skillInfo.e.duration * 10);
    }
    
    exponent.skillLShift = () => {
        exponent.cooldown.shift = exponent.cooldownINIT.shift;

        players[team].specINIT.range += skillInfo.shift.range;
        exponent.isActive.shift = true;
        players[team].barrier.push([50 + players[team].spec.ap * skillInfo.shift.ap, 300]);
        
        setTimeout(() => {
            players[team].specINIT.range -= skillInfo.shift.range;
            exponent.isActive.shift = false;
        }, skillInfo.shift.duration * 10);
    }
    
    exponent.skillWheel = () => {
        exponent.cooldown.wheel = exponent.cooldownINIT.wheel;

        if (char[team] == 'exponent') {
            exponentPassiveStack += 1;
            if (exponentPassiveStack >= 40) {
                exponent.passive();
            }
            exponent.passive();
            
        }
    }
}