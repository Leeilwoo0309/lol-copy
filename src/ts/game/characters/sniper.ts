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

        // aaA.ad = Math.floor(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad);
        // charClass.isActive.q = true;

        players[team].status.cc.cantMove = 50;
        atkWait = 80;
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        setTimeout(() => {
            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(players[team].spec.ad * skillInfo.q.ad + skillInfo.q.damage, skillInfo.q.type)
                    .setCritical(players[team].spec.criticP + 50 + (players[getEnemyTeam()].marker.sniper ? 50 : 0), players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(600)
                    .setSpeed(28)
                    .setSize({height: 120, width: 60})
                    .ignoreObj().canPass()
                    .onHit('sniper skill q')
                    .build(team)
            );
        }, 500);
    }
    
    sniper.skillE = () => {
        const mouseDistance = Math.sqrt(Math.pow(-absolutePosition[team].x + absolutePointerPosition.x, 2) + Math.pow(-absolutePosition[team].y + absolutePointerPosition.y, 2))
        if (mouseDistance > 600) return;
        sniper.cooldown.e = sniper.cooldownINIT.e;

        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(1, skillInfo.q.type)
                .setCritical(0, players[team].spec.criticD)
                .projOffset({x: -absolutePosition[team].x + absolutePointerPosition.x -15, y: -absolutePosition[team].y + absolutePointerPosition.y + 15})
                .setDegree(angle)
                .setReach(1)
                .setSpeed(0.001)
                .setSize({height: 30, width: 30})
                .ignoreObj()
                .onHit('sniper skill e')
                .build(team)
        );
        // players[team].specItem.atkspd += 100 * skillInfo.e.atkspd + skillInfo.e.ap * players[team].spec.ap
        // charClass.isActive.e = true;
        
        // setTimeout(() => {
        //     players[team].specItem.atkspd -= 100 * skillInfo.e.atkspd + skillInfo.e.ap * players[team].spec.ap
        //     charClass.isActive.e = false;
        // }, skillInfo.e.duration * 10);
    }
    
    sniper.skillLShift = () => {
        sniper.cooldown.shift = sniper.cooldownINIT.shift;
    
        let dashLength: number = 0;
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        const dash = setInterval(() => {  
            canMove = false;
            dashLength += 1;

            const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
            let ret: boolean = false;
            
            collideChecker.style.position = 'absolute';
            collideChecker.style.backgroundColor = 'green';
        
            collideChecker.style.left = `${ absolutePosition[team].x + 35 - cameraPosition.x - 5 * Math.cos(-angle) }px`;
            collideChecker.style.top = `${ -absolutePosition[team].y - 35 - cameraPosition.y + 5 * Math.sin(-angle) }px`;
            collideChecker.style.height = '80px';
            collideChecker.style.width = '80px';
            
            gameObjects.forEach((e, i) => {
                if (e.isCollide(collideChecker) && e.extra.canCollide) {
                    ret = true;
                    clearInterval(dash);
                    canMove = true;
                }
            });

            if (!checkCollideSniper(absolutePosition[team], -angle, dash) && dashLength < skillInfo.shift.range) {
                absolutePosition[team].x += 5 * Math.cos(-angle);
                absolutePosition[team].y -= 5 * Math.sin(-angle);
            } else {
                clearInterval(dash);
                canMove = true;
            }
        }, 9);

        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(players[team].spec.ap * skillInfo.shift.ap + skillInfo.shift.damage, skillInfo.shift.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(200)
                .setSpeed(19)
                .setSize({height: 40, width: 30})
                .setStyle('rgb(109, 109, 109)')
                .ignoreObj()
                .onHit('sniper skill shift')
                .build(team)
        );
    }

    
    sniper.skillWheel = () => {
        if (deathCoolDown[getEnemyTeam()] > 0) return;
        
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
        
        players[team].status.cc.cantMove = 100;
        
        sniperWheelMotion(getEnemyTeam());
        
        setTimeout(() => {
            charClass.isActive.wheel = false;
            canMove = true;
            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(players[team].spec.ad * skillInfo.wheel.ad + skillInfo.wheel.damage, skillInfo.wheel.type)
                    .setCritical(100, players[team].spec.criticD)
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

    function checkCollideSniper(position: Position, angle: number, dash) {
        const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
        let ret: boolean = false;
    
        collideChecker.style.position = 'absolute';
        collideChecker.style.backgroundColor = 'green';
    
        collideChecker.style.left = `${ absolutePosition[team].x - 35 - cameraPosition.x - 5 * Math.cos(angle) }px`;
        collideChecker.style.top = `${ -absolutePosition[team].y - 35 - cameraPosition.y + 5 * Math.sin(angle) }px`;
        collideChecker.style.height = '80px';
        collideChecker.style.width = '80px';

        gameObjects.forEach((e, i) => {
            if (e.isCollide(collideChecker) && e.extra.canCollide) {
                ret = true;
                clearInterval(dash);
                return;
            }
        });
    
        return ret;
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
