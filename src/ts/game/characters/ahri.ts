const ahri = new Char();

let ahriWheelTimes: number = 3;
let ahriAttackTimes: number = 0;

function makeAhri() {
    ahri.cooldownINIT = calculateSkillHaste();

    setInterval(() => {
        if (ahriAttackTimes >= 5) {
            ahriAttackTimes -= 5;

            let heal: number = skillInfo.passive.ap * players[team].spec.ap + skillInfo.passive.damage;

            damageAlert("heal", heal, false, team);
            socket.send(JSON.stringify({
                body: {
                    msg: 'damageAlert',
                    info: ["heal", heal, false, team]
                }
            }));
        }
    }, 16);

    ahri.skillQ = () => {
        ahri.cooldown.q = ahri.cooldownINIT.q;

        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        
        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(skillInfo.q.damage + players[team].spec.ap * skillInfo.q.ap, skillInfo.q.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(450)
                .setSpeed(20)
                .setSize({height: 40, width: 40})
                .setStyle('rgb(145, 176, 202)')
                .onHit(`ahri skill q1`)
                .canPass(true)
                .ignoreObj(true)
                .build(team)
        );
    }
    
    ahri.skillE = () => {
        if (playerDistance >= 470 * 1.5 || deathCoolDown[getEnemyTeam()] > 0) return;
        ahri.cooldown.e = ahri.cooldownINIT.e;

        let index = 0;

        const kaisaQ = setInterval(() => {
            if (index >= 2) clearInterval(kaisaQ)
            index += 1;

            const x = Math.random() * 100 - 50;
            const y = Math.random() * 100 - 50;

            players[team].specItem.moveSpd += skillInfo.e.moveSpd;
            ahri.isActive.e = true;
            
            setTimeout(() => {
                players[team].specItem.moveSpd -= skillInfo.e.moveSpd;
                ahri.isActive.e = false;
            }, skillInfo.e.duration * 10)


            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(skillInfo.e.damage + players[team].spec.ap * skillInfo.e.ap, skillInfo.e.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(0)
                    .setReach(1500)
                    .setSpeed(20)
                    .projOffset({x: x, y: y})
                    .setTarget()
                    .setSize({height: 20, width: 20})
                    .setStyle('rgb(77, 118, 151)')
                    .onHit(`ahri skill e range`)
                    .ignoreObj()
                    .build(team)
            );
        }, 200);
    }
    
    ahri.skillLShift = () => {
        ahri.cooldown.shift = ahri.cooldownINIT.shift;

        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(skillInfo.shift.damage + players[team].spec.ap * skillInfo.shift.ap, skillInfo.shift.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(0)
                .setDegree(angle)
                .setReach(600)
                .setSpeed(18)
                .setSize({height: 30, width: 50})
                .setStyle('rgb(238, 127, 218)')
                .onHit(`ahri skill shift stun`)
                .ignoreObj()
                .build(team)
        );
    }
    
    ahri.skillWheel = () => {
        if (ahriWheelTimes === 0) return;

        ahri.cooldown.wheel = skillInfo.wheel.armor;
        ahriWheelTimes -= 1;
        ahri.isActive.wheel = true;
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        let dashLength = 0;

        setTimeout(() => {
            ahri.isActive.wheel = false;
            ahriWheelTimes = 3;
            ahri.cooldown.wheel = ahri.cooldownINIT.wheel;
        }, skillInfo.wheel.duration * 10);

        if (playerDistance < 470 * 1.5 && deathCoolDown[getEnemyTeam()] === 0) {
            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(skillInfo.wheel.damage + players[team].spec.ap * skillInfo.wheel.ap, skillInfo.wheel.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setTarget()
                    .setReach(600)
                    .setSpeed(15)
                    .setSize({height: 20, width: 20})
                    .setStyle('rgb(127, 182, 238)')
                    .onHit(`ahri skill wheel`)
                    .ignoreObj()
                    .build(team)
            );
        }

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

            if (!checkCollideAhri(absolutePosition[team], angle, dash) && dashLength < skillInfo.wheel.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            } else {
                clearInterval(dash);
                canMove = true;
            }
        }, 1);
    }

    function checkCollideAhri(position: Position, angle: number, dash) {
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