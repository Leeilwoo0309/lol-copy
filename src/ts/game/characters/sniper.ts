const sniper = new Char();

let passiveActiveTime: number = 0;
let alphaMoveSpd: number = 0;

function makeSniper() {
    sniper.passive = () => {
        passiveActiveTime += skillInfo.passive.duration;
    }

    sniper.cooldownINIT = calculateSkillHaste();

    sniper.skillQ = () => {
        sniper.cooldown.q = sniper.cooldownINIT.q;

        aaA.ad = Math.floor(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad);
        charClass.isActive.q = true;
    }
    
    sniper.skillE = () => {
        sniper.cooldown.e = sniper.cooldownINIT.e;
        
        players[team].specItem.atkspd += 100 * skillInfo.e.atkspd + skillInfo.e.ap * players[team].spec.ap
        charClass.isActive.e = true;
        
        setTimeout(() => {
            players[team].specItem.atkspd -= 100 * skillInfo.e.atkspd + skillInfo.e.ap * players[team].spec.ap
            charClass.isActive.e = false;
        }, skillInfo.e.duration * 10);
    }
    
    sniper.skillLShift = () => {
        sniper.cooldown.shift = sniper.cooldownINIT.shift;
    
        players[team].status.invisible = true;

        // charClass.cooldown.q += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100
        // charClass.cooldown.e += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100
        charClass.cooldown.wheel += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100
        atkWait += skillInfo.shift.duration + skillInfo.shift.ap * players[team].spec.ap * 100

        charClass.isActive.shift = true;
        
        setTimeout(() => {
            players[team].status.invisible = false;
            charClass.isActive.shift = false;
        }, skillInfo.shift.duration * 10 + skillInfo.shift.ap * players[team].spec.ap * 1000)
    }
    
    sniper.skillWheel = () => {
        sniper.cooldown.wheel = sniper.cooldownINIT.wheel;
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

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

/**
 * 
 * @param _team 맞을 팀 쓰셈ㅇ
 */
function sniperWheelMotion(_team: 'red' | 'blue') {
    const eff: HTMLDivElement = document.createElement('div');
    const eff2: HTMLDivElement = document.createElement('div');
    const eff3: HTMLDivElement = document.createElement('div');

    let index: number = 0;

    game.appendChild(eff);
    eff.appendChild(eff2);
    eff.appendChild(eff3);

    const effectInterval = setInterval(() => {
        if (index >= 100) {
            clearInterval(effectInterval);
            game.removeChild(eff);
        };
        
        index += 1;

        eff.style.top = `${ -absolutePosition[_team].y - cameraPosition.y - players[_team].size * 1.3 }px`;
        eff.style.left = `${ absolutePosition[_team].x - cameraPosition.x - players[_team].size * 1.3 }px`;
        eff.style.position = 'absolute';
        eff.style.height = `100px`;
        eff.style.width = `100px`;
        eff.style.border = `3px solid red`;
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
