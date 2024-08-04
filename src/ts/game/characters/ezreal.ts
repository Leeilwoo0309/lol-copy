const ezreal = new Char();

function makeEzreal() {
    ezreal.cooldownINIT = calculateSkillHaste();

    ezreal.skillQ = () => {
        ezreal.cooldown.q = ezreal.cooldownINIT.q;
    
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
    
        projectiles[team].push(
            new ProjectileBuilder()
                .setDamage(players[team].spec.ad * skillInfo.q.ad + skillInfo.q.damage, skillInfo.q.type)
                .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                .setDegree(angle)
                .setReach(700)
                .setSpeed(30)
                .setSize({height: 50, width: 25})
                .setStyle('rgb(14, 144, 177)')
                .onHit('skill')
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
                .setSize({height: 30, width: 30})
                .setStyle('yellow')
                .onHit('ezreal skill')
                .build(team)
        )
    }
    
    ezreal.skillLShift = () => {
        ezreal.cooldown.shift = ezreal.cooldownINIT.shift;
    
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
    
        let dashLength = 0;
    
        const dash = setInterval(() => {  
            dashLength += 1;
            if (!checkCollideEzE(absolutePosition[team], angle) && dashLength < skillInfo.shift.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            } else {
                clearInterval(dash);
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
                .onHit('skill')
                .ignoreObj()
                .canPass()
                .build(team)
        )
    }
    
    function checkCollideEzE(position: Position, angle: number) {
        const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
        let ret: boolean = false;
    
        collideChecker.style.position = 'absolute';
        collideChecker.style.backgroundColor = 'green';
    
        collideChecker.style.left = `${ position.x - cameraPosition.x - 5 * Math.cos(angle) }px`;
        collideChecker.style.top = `${ -position.y - cameraPosition.y + 5 * Math.sin(angle) }px`;
    
        gameObjects.forEach((e, i) => {
            if (e.isCollide(collideChecker) && e.extra.canCollide) {
                ret = true;
            }
        });
    
        return ret;
    }
}
