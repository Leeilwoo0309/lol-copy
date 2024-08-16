const graves = new Char();

function makeGraves() {
    graves.passive = () => {
    }

    graves.cooldownINIT = calculateSkillHaste();

    graves.skillQ = () => {
        graves.cooldown.q = graves.cooldownINIT.q;

        let index: number = 0;
        canMove = false;
        atkWait += skillInfo.q.atkspd * 2 / 10

        const gravesQSkill = setInterval(() => {
            index += 1;
            
            const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
            
            for (let i = -2; i < 3; i++) {
                projectiles[team].push(
                    new ProjectileBuilder()
                        .setDamage(skillInfo.q.damage + players[team].spec.ad * skillInfo.q.ad, skillInfo.q.type)
                        .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                        .setDegree(angle + i * 0.2 )
                        .setReach(375)
                        .setSpeed(15)
                        .setSize({height: 25, width: 25})
                        // .setStyle('gray')
                        .onHit(`graves skill q`)
                        .build(team)
                );
            }
                
            if (index >= 2) {
                clearInterval(gravesQSkill);
                
                setTimeout(() => {
                    canMove = true;
                }, 200);
            }
        }, skillInfo.q.atkspd);
    }
        
    graves.skillE = () => {
        graves.cooldown.e = graves.cooldownINIT.e;
        
        players[team].specINIT.moveSpd += skillInfo.e.moveSpd;
        graves.isActive.e = true;
        
        setTimeout(() => {
            players[team].specINIT.moveSpd -= skillInfo.e.moveSpd;
            graves.isActive.e = false;
        }, skillInfo.e.duration * 10)
    }
        
    graves.skillLShift = () => {
        graves.cooldown.shift = graves.cooldownINIT.shift;
        
        const angle = Math.atan2(absolutePosition[team].y - absolutePointerPosition.y, absolutePosition[team].x - absolutePointerPosition.x);
        let dashLength: number = 0;

        players[team].specINIT.armor += skillInfo.shift.armor;
        players[team].specINIT.magicRegist += skillInfo.shift.armor;
        graves.isActive.shift = true;
        
        setTimeout(() => {
            players[team].specINIT.armor -= skillInfo.shift.armor;
            players[team].specINIT.magicRegist -= skillInfo.shift.armor;
            graves.isActive.shift = false;
        }, skillInfo.shift.duration * 10)
        
        const dash = setInterval(() => {
            canMove = false;
            dashLength += 1;
            if (!checkCollideGraves(absolutePosition[team], angle) && dashLength < skillInfo.shift.range) {
                absolutePosition[team].x -= 5 * Math.cos(angle);
                absolutePosition[team].y -= 5 * Math.sin(angle);
            } else {
                clearInterval(dash);
                canMove = true;
            }
        }, 6);
    }
    
    graves.skillWheel = () => {
        graves.cooldown.wheel = graves.cooldownINIT.wheel;

        for (let i = -skillInfo.wheel.armor / 2; i < skillInfo.wheel.armor / 2; i++) {
                
            projectiles[team].push(
                new ProjectileBuilder()
                    .setDamage(skillInfo.wheel.damage + players[team].spec.ad * skillInfo.wheel.ad, skillInfo.wheel.type)
                    .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                    .setDegree(i / (skillInfo.wheel.armor / 2) * Math.PI)
                    .setReach(500)
                    .setSpeed(13)
                    .setSize({height: 25, width: 25})
                    // .setStyle('gray')
                    .onHit(`graves skill wheel`)
                    .build(team)
                );
        }
    }

    function checkCollideGraves(position: Position, angle: number) {
        const collideChecker: HTMLDivElement = document.querySelector('.checker-dash.player');
        let ret: boolean = false;
    
        collideChecker.style.position = 'absolute';
        collideChecker.style.backgroundColor = 'green';
    
        collideChecker.style.left = `${ position.x - cameraPosition.x - 6 * Math.cos(angle) }px`;
        collideChecker.style.top = `${ -position.y - cameraPosition.y + 25 * Math.sin(angle) }px`;
    
        gameObjects.forEach((e, i) => {
            if (e.isCollide(collideChecker) && e.extra.canCollide) {
                ret = true;
            }
        });
    
        return ret;
    }
}