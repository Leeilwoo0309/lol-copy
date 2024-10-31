const yasuo = new Char();

let yasuoQStack: number = 0;

function makeYasuo() {
    yasuo.cooldownINIT = calculateSkillHaste();

    setInterval(() => {
        if (yasuoQStack === 2) yasuo.isActive.q = true;
        else yasuo.isActive.q = false;

        if (players[getEnemyTeam()].status.cc.stun > 0 || players[team].spec.ignoreArmorPercent >= 60) yasuo.isActive.wheel = true;
        else yasuo.isActive.wheel = false;
    }, 16);

    yasuo.skillQ = () => {
        yasuo.cooldown.q = yasuo.cooldownINIT.q * 1 / (players[team].spec.atkspd / 2 + 0.5);

        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);

        if (yasuoQStack < 2) {
            projectiles[team].push(
                new ProjectileBuilder()
                    //@ts-ignore
                    .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad, skillInfo.q.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(1)
                    .ignoreObj()
                    .canPass()
                    .setSpeed(0.2)
                    .setSize({height: 200, width: 20})
                    .setStyle('rgb(77, 112, 201)')
                    .onHit(`yasuo skill aa q`)
                    .build(team)
            );
        } else {
            yasuoQStack = -1;
            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad, skillInfo.q.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(angle)
                    .setReach(500)
                    .ignoreObj()
                    .canPass()
                    .setSpeed(20)
                    .setSize({height: 60, width: 60})
                    .setStyle('rgb(77, 112, 201)')
                    .onHit(`yasuo skill q2`)
                    .build(team)
            );
        }
    }
    
    yasuo.skillE = () => {
        yasuo.cooldown.e = yasuo.cooldownINIT.e;

        players[team].barrier.push([skillInfo.e.damage + skillInfo.e.ad * players[team].spec.ad, 200])
    }
    
    yasuo.skillLShift = () => {
        if (playerDistance >= 300) return;
        yasuo.cooldown.shift = yasuo.cooldownINIT.shift * 1 / (players[team].spec.atkspd / 2 + 0.5);;
        
        let dashLength: number = 0;
        const angle = Math.atan2(absolutePosition[team].y - absolutePosition[getEnemyTeam()].y, absolutePosition[team].x - absolutePosition[getEnemyTeam()].x);
    

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

            if (!checkCollideYasuo(absolutePosition[team], angle, dash) && dashLength < skillInfo.shift.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            } else {
                clearInterval(dash);
                canMove = true;
            }
        }, 7);
        
        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(skillInfo.shift.damage + players[team].spec.ad * skillInfo.shift.ad + players[team].spec.ap * skillInfo.shift.ap, skillInfo.shift.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(150 * 1.2)
                .setSpeed(13.5)
                .setSize({height: 1, width: 1})
                .setStyle('rgb(145, 176, 202)')
                .onHit(`yasuo skill shift`)
                .canPass(true)
                .setTarget()
                .ignoreObj(true)
                .build(team)
        );
    }
    
    yasuo.skillWheel = () => {
        if (players[getEnemyTeam()].status.cc.stun === 0) return;
        yasuo.cooldown.wheel = yasuo.cooldownINIT.wheel;
        yasuo.isActive.wheel = true;

        socket.send(JSON.stringify({
            body: {msg: 'yasuo-wheel'}
        }))

        //@ts-ignore
        players[team].specINIT.ignoreArmorPercent += skillInfo.wheel.ignoreArmorPercent;
        
        setTimeout(() => {
            yasuo.isActive.wheel = false;
            //@ts-ignore
            players[team].specINIT.ignoreArmorPercent -= skillInfo.wheel.ignoreArmorPercent;
        }, skillInfo.wheel.duration * 10);

        // absolutePosition[team] = absolutePosition[getEnemyTeam()];
        // absolutePosition[team].x -= 100;

        absolutePosition[team] = {x: absolutePosition[getEnemyTeam()].x - 70, y: absolutePosition[getEnemyTeam()].y};
        let index = 0;
        
        players[team].status.cc.stun = 100;

        const yasuoWheel = setInterval(() => {
            absolutePosition[team] = {x: absolutePosition[getEnemyTeam()].x + 70 * Math.pow(-1, index), y: absolutePosition[getEnemyTeam()].y};
            index += 1;

            if (index >= 3) {
                clearInterval(yasuoWheel);
                absolutePosition[team] = absolutePosition[getEnemyTeam()]
            }
            
                projectiles[team].push(
                new ProjectileBuilder()
                    //@ts-ignore
                    .setDamage((skillInfo.wheel.damage + skillInfo.wheel.ad * players[team].spec.ad) / 3, skillInfo.wheel.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setReach(300)
                    .ignoreObj()
                    .canPass()
                    .setSpeed(25)
                    .setTarget()
                    .setSize({height: 2, width: 2})
                    .setStyle('rgb(36, 37, 39)')
                    .onHit(`yasuo skill wheel`)
                    .build(team)
                );
        }, 300);
    }

    function checkCollideYasuo(position: Position, angle: number, dash) {
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