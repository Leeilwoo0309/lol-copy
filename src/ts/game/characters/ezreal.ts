const ezreal = new Char();

function makeEzreal() {
    ezreal.cooldownINIT = calculateSkillHaste();

    ezreal.skillQ = () => {
        ezreal.cooldown.q = ezreal.cooldownINIT.q;
    
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
    
        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(players[team].spec.ad * skillInfo.q.ad + players[team].spec.ap * skillInfo.q.ap + skillInfo.q.damage, skillInfo.q.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(700)
                .setSpeed(30)
                .setSize({height: 70, width: 35})
                .setStyle('rgb(126, 187, 202)')
                .onHit('ezreal skill q')
                .build(team)
        )
    }
    
    ezreal.skillE = () => {
        ezreal.cooldown.e = ezreal.cooldownINIT.e;
        
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
    
        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(players[team].spec.ad * skillInfo.e.ad + skillInfo.e.damage, skillInfo.e.type)
                .setCritical(0, 0)
                .setDegree(angle)
                .setReach(500)
                .setSpeed(25)
                .setSize({height: 40, width: 40})
                .setStyle('yellow')
                .onHit('ezreal skill e')
                .build(team)
        )
    }
    
    ezreal.skillLShift = () => {
        ezreal.cooldown.shift = ezreal.cooldownINIT.shift;
    
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
    
        let dashLength = 0;

        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(players[team].spec.ad * skillInfo.shift.ad + skillInfo.shift.damage, skillInfo.shift.type)
                .setCritical(0, 0)
                .setDegree(angle)
                .setReach(625)
                .setSpeed(35)
                .setSize({height: 40, width: 15})
                .setStyle('yellow')
                .onHit('ezreal skill shift')
                .setTarget()
                .build(team)
        )
    
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

            if (!checkCollideEzE(absolutePosition[team], angle, dash) && dashLength < skillInfo.shift.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            } else {
                clearInterval(dash);
                canMove = true;
            }
        }, 1)
    
    }
    
    ezreal.skillWheel = () => {
        ezreal.cooldown.wheel = ezreal.cooldownINIT.wheel;
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
    
        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(players[team].spec.ad * skillInfo.wheel.ad + players[team].spec.ap * skillInfo.wheel.ap + skillInfo.wheel.damage, skillInfo.wheel.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(5000)
                .setSpeed(20)
                .setSize({height: 40, width: 200})
                .setStyle('yellow')
                .onHit('ezreal skill wheel')
                .ignoreObj()
                .canPass()
                .build(team)
        )
    }
    
    function checkCollideEzE(position: Position, angle: number, dash) {
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
