const akali = new Char();

let akaliWheelTimes: number = 0;
let akaliEPosition: Position = {x: undefined, y: undefined};
let akaliSkillUsed: number = 0;
let akaliPassive = {
    position: {x: 0, y: 0},
    isActive: 0,
    isOpen: 0
}
let giryck: number = 300;

const akaliPassiveObj: HTMLDivElement = document.createElement('div');

akaliPassiveObj.style.width = '490px';
akaliPassiveObj.style.height = '490px';
akaliPassiveObj.style.border = '5px solid rgba(0, 0, 0, 0.4)'
akaliPassiveObj.style.position = 'absolute';
akaliPassiveObj.style.backgroundColor = 'rgba(50, 94, 54, 0.38)';
akaliPassiveObj.style.borderRadius = '100%';
akaliPassiveObj.style.display = 'none';


function makeAkali() {
    document.querySelector('.projectiles').appendChild(akaliPassiveObj);
    akali.cooldownINIT = calculateSkillHaste();

    setInterval(() => {
        if (players[getEnemyTeam()].marker.akali) {
            akali.isActive.shift = true;
        } else {
            akali.isActive.shift = false;
        }

        let eDistance = Math.sqrt((absolutePosition[team].x - akaliEPosition.x) ** 2 + (absolutePosition[team].y - akaliEPosition.y) ** 2)
        let passiveDistance = Math.sqrt((absolutePosition[team].x - akaliPassive.position.x) ** 2 + (absolutePosition[team].y - akaliPassive.position.y) ** 2)

        if (eDistance <= 150 && akali.isActive.e && akaliSkillUsed === 0) {
            players[team].status.invisible = true;
            alphaMoveSpd = skillInfo.e.moveSpd
        } else {
            players[team].status.invisible = false;
            alphaMoveSpd = 0;
        }

        if (akali.cooldownINIT.shift < 500) akali.cooldownINIT.shift = 510

        if (akaliSkillUsed >= 1) akaliSkillUsed -= 1;

        if (akaliPassive.isOpen >= 1) {
            akaliPassiveObj.style.display = 'block';
            akaliPassiveObj.style.left = `${ akaliPassive.position.x - cameraPosition.x - 235 }px`;
            akaliPassiveObj.style.top  = `${ -akaliPassive.position.y - cameraPosition.y - 235 }px`;

            if (passiveDistance >= 250) {
                akaliPassive.isOpen = 0;
                akaliPassive.isActive = 1000;
                players[team].specINIT.moveSpd += skillInfo.passive.moveSpd;
            }
        } else {
            akaliPassiveObj.style.display = 'none';
        }

        const passiveBtn: HTMLDivElement = document.querySelector('.passive-btn')
        if (akaliPassive.isActive >= 1) {
            passiveBtn.style.backgroundColor = 'yellow';
            // passiveBtn.style.color = 'yellow';Z
        } else if (akaliPassive.isActive === 0) {
            passiveBtn.style.backgroundColor = 'rgb(144, 148, 167)';
        }
    }, 16);

    setInterval(() => {
        if (akaliPassive.isActive >= 1) {
            akaliPassive.isActive -= 1;
            if (akaliPassive.isActive === 0) players[team].specINIT.moveSpd -= skillInfo.passive.moveSpd;
        }
        if (akaliPassive.isOpen >= 1) akaliPassive.isOpen -= 1;
    }, 10);

    akali.skillQ = () => {
        akali.cooldown.q = akali.cooldownINIT.q;
        akaliSkillUsed +=  20;

        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        let index: number = 0;

            index += 1;

        for (let i = -2; i < 3; i++) {
            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad + players[team].spec.ap * skillInfo.q.ap, skillInfo.q.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle + i * 0.1)
                    .setReach(200)
                    .setSpeed(35)
                    .canPass()
                    .setSize({height: 35, width: 25})
                    // .setStyle('gray')
                    .onHit(`akali skill q pas`)
                    .build(team)
            );
        }
    }
    
    akali.skillE = () => {
        akali.cooldown.e = akali.cooldownINIT.e;
        akali.isActive.e = true;

        akaliEPosition.x = absolutePosition[team].x;
        akaliEPosition.y = absolutePosition[team].y;

        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(0.1, 'melee')
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .projOffset({x: 135, y: 0})
                .setDegree(0)
                .setReach(0.0625 * skillInfo.e.duration / 150)
                .setSpeed(0.001)
                .setSize({height: 300, width: 300})
                .setStyle('rgb(36, 36, 36)')
                .onHit(`akali skill e`)
                .canPass()
                .ignoreObj()
                .build(team)
        );

        setTimeout(() => {
            akali.isActive.e = false;
        }, skillInfo.e.duration * 10)
    }
    
    akali.skillLShift = () => {
        akali.cooldown.shift = akali.cooldownINIT.shift;
        akaliSkillUsed +=  20;

        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        if (!akali.isActive.shift) {
            projectiles[team].push(
                new ProjectileBuilder()
                    //@ts-ignore
                    .setDamage(skillInfo.shift.damages[0].damage + players[team].spec.ad * skillInfo.shift.damages[0].ad + players[team].spec.ap * skillInfo.shift.damages[0].ap, skillInfo.shift.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(800)
                    .setSpeed(30)
                    .setSize({height: 40, width: 40})
                    .setStyle('rgb(109, 109, 109)')
                    .onHit(`akali skill shift1 pas`)
                    .ignoreObj()
                    .build(team)
            );
    
            let dashLength = 0;
    
            const dash = setInterval(() => {
                canMove = false;
                dashLength += 1;
    
                const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
                let ret: boolean = false;
                
                collideChecker.style.position = 'absolute';
                collideChecker.style.backgroundColor = 'green';
            
                collideChecker.style.left = `${ absolutePosition[team].x + 35 - cameraPosition.x - 5 * Math.cos(angle) }px`;
                collideChecker.style.top = `${ -absolutePosition[team].y - 35 - cameraPosition.y + 5 * Math.sin(angle) }px`;
                collideChecker.style.height = '80px';
                collideChecker.style.width = '80px';
                
                gameObjects.forEach((e, i) => {
                    if (e.isCollide(collideChecker) && e.extra.canCollide) {
                        ret = true;
                        clearInterval(dash);
                        canMove = true;
                    }
                });
    
                if (!checkCollideAkali(absolutePosition[team], angle, dash) && dashLength < skillInfo.shift.range) {
                    absolutePosition[team].x += 5 * Math.cos(angle);
                    absolutePosition[team].y += 5 * Math.sin(angle);
                } else {
                    clearInterval(dash);
                    canMove = true;
                }
            }, 10);
        } else {
            akali.cooldown.shift = akali.cooldownINIT.shift;
            akali.cooldown.q = 10;
            akali.cooldown.e = 10;
            socket.send(JSON.stringify({
                body: {
                    msg: 'akali-shift'
                }
            }));
        
            projectiles[team].push(
                new ProjectileBuilder()
                    //@ts-ignore
                    .setDamage(skillInfo.shift.damages[1].damage + players[team].spec.ad * skillInfo.shift.damages[1].ad + players[team].spec.ap * skillInfo.shift.damages[1].ap, skillInfo.shift.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(40000)
                    .setSpeed(20)
                    .setSize({height: 20, width: 20})
                    .setStyle('rgb(119, 119, 119)')
                    .onHit(`akali skill shift2`)
                    // .canPass(true)
                    .ignoreObj()
                    .setTarget()
                    .ignoreObj(true)
                    .build(team)
            );
            akali.cooldown.shift = akali.cooldownINIT.shift;

            const dash = setInterval(() => {
                let angle = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
    
                canMove = false;
    
                const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
                let ret: boolean = false;
                
                collideChecker.style.position = 'absolute';
                collideChecker.style.backgroundColor = 'green';
            
                collideChecker.style.left = `${ absolutePosition[team].x + 35 - cameraPosition.x - 5 * Math.cos(angle) }px`;
                collideChecker.style.top = `${ -absolutePosition[team].y - 35 - cameraPosition.y + 5 * Math.sin(angle) }px`;
                collideChecker.style.height = '80px';
                collideChecker.style.width = '80px';
    
                if (playerDistance > 15) {
                    absolutePosition[team].x -= 5 * Math.cos(angle);
                    absolutePosition[team].y -= 5 * Math.sin(angle);
                } else {
                    clearInterval(dash);
                    
                    // akali.cooldown.shift = akali.cooldownINIT.shift;
                    absolutePosition[team] = absolutePosition[getEnemyTeam()];
                }
            }, 4);
        }

    }
    
    akali.skillWheel = () => {
        if (playerDistance > skillInfo.wheel.range[akaliWheelTimes] * 5.5 && akaliWheelTimes === 0) return;

        if (akaliWheelTimes === 0) akali.cooldown.wheel = 250;
        if (akaliWheelTimes === 1) akali.cooldown.wheel = skillInfo.wheel.cooldown;
        
        akali.isActive.wheel = true;
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        let dashLength = 0;

        if (deathCoolDown[getEnemyTeam()] === 0 && akaliWheelTimes === 0) {
            akaliWheelTimes = 1;

            setTimeout(() => {
                if (akaliWheelTimes === 1) {
                    akaliWheelTimes = 0;
                    akali.isActive.wheel = false;
                    akali.cooldown.wheel = skillInfo.wheel.cooldown;
                }
            }, skillInfo.wheel.duration * 10);

            projectiles[team].push(
                new ProjectileBuilder()
                    //@ts-ignore
                    .setDamage(skillInfo.wheel.damages[0].damage + players[team].spec.ad * skillInfo.wheel.damages[0].ad + players[team].spec.ap * skillInfo.wheel.damages[0].ap, skillInfo.wheel.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setTarget()
                    .setReach(600)
                    .setSpeed(20)
                    .setSize({height: 1, width: 1})
                    .setStyle('rgb(127, 182, 238)')
                    .onHit(`akali skill wheel pas`)
                    .ignoreObj()
                    .build(team)
            );

            let angle = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
            const dash = setInterval(() => {
                dashLength += 1;
    
                const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
                let ret: boolean = false;
                
                collideChecker.style.position = 'absolute';
                collideChecker.style.backgroundColor = 'green';
            
                collideChecker.style.left = `${ absolutePosition[team].x + 35 - cameraPosition.x - 25 * Math.cos(angle) }px`;
                collideChecker.style.top = `${ -absolutePosition[team].y - 35 - cameraPosition.y + 25 * Math.sin(angle) }px`;
                collideChecker.style.height = '80px';
                collideChecker.style.width = '80px';
                
                gameObjects.forEach((e, i) => {
                    if (e.isCollide(collideChecker) && e.extra.canCollide) {
                        ret = true;
                        clearInterval(dash);
                    }
                });
    
                if (!checkCollideAkali(absolutePosition[team], angle, dash) && dashLength < skillInfo.wheel.range[0]) {
                    absolutePosition[team].x -= 5 * Math.cos(angle);
                    absolutePosition[team].y -= 5 * Math.sin(angle);
                } else {
                    clearInterval(dash);
                }
            }, 0);
        } else if (deathCoolDown[getEnemyTeam()] === 0 && akaliWheelTimes === 1) {
            akaliWheelTimes = 0;

            akali.isActive.wheel = false;
            
            projectiles[team].push(
                new ProjectileBuilder()
                    //@ts-ignore
                    .setDamage(skillInfo.wheel.damages[1].damage + players[team].spec.ap * skillInfo.wheel.damages[1].ap + (players[getEnemyTeam()].hp[0] - players[getEnemyTeam()].hp[1]) * skillInfo.wheel.damages[1].armor / 100, skillInfo.wheel.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(350)
                    .setSpeed(30)
                    .setSize({height: 20, width: 150})
                    .setStyle('rgb(90, 90, 90)')
                    .onHit(`akali skill wheel pas`)
                    .ignoreObj()
                    .build(team)
            );

            const dash = setInterval(() => {
                dashLength += 1;
    
                const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
                let ret: boolean = false;
                
                collideChecker.style.position = 'absolute';
                collideChecker.style.backgroundColor = 'green';
            
                collideChecker.style.left = `${ absolutePosition[team].x + 35 - cameraPosition.x - 40 * Math.cos(angle) }px`;
                collideChecker.style.top = `${ -absolutePosition[team].y - 35 - cameraPosition.y + 40 * Math.sin(angle) }px`;
                collideChecker.style.height = '80px';
                collideChecker.style.width = '80px';
                
                gameObjects.forEach((e, i) => {
                    if (e.isCollide(collideChecker) && e.extra.canCollide) {
                        ret = true;
                        clearInterval(dash);
                    }
                });
    
                if (!checkCollideAkali(absolutePosition[team], angle, dash) && dashLength < skillInfo.wheel.range[1]) {
                    absolutePosition[team].x -= 9 * Math.cos(angle);
                    absolutePosition[team].y -= 9 * Math.sin(angle);
                } else {
                    clearInterval(dash);
                }
                
            }, 0);
        }

        
    }

    function checkCollideAkali(position: Position, angle: number, dash) {
        const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
        let ret: boolean = false;
    
        collideChecker.style.position = 'absolute';
        collideChecker.style.backgroundColor = 'green';
    
        collideChecker.style.left = `${ absolutePosition[team].x - 35 - cameraPosition.x - 40 * Math.cos(angle) }px`;
        collideChecker.style.top = `${ -absolutePosition[team].y - 35 - cameraPosition.y + 40 * Math.sin(angle) }px`;
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