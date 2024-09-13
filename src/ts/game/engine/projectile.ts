class Projectile {
    public angle: number = 0;
    public absPos: {x: number, y:  number} = {x: 0, y: 0};
    public speed: number = 15;
    private _movedDistance: number = 0;
    public isArrive: boolean = true;
    public isSent: boolean = false;
    public isCollide: boolean = false;
    public damage: number = 0;
    public critical: [number, number] = [0, 0];
    public reach: number = -1;
    public size: ObjSize;
    public style = {
        color: undefined,
        opacity: undefined,
    };
    public ignoreObj: boolean = false;
    public onhit: string = undefined;
    public damageType: 'melee' | 'magic' | 'true';
    public targetEnemy: [boolean, 'red' | 'blue'] = [false, team];
    public canPass: boolean = false;

    public start(type: "blue" | "red") {
        const _main: HTMLElement = document.querySelector('.projectiles');
        let _bullet: HTMLDivElement = document.createElement('div');

        _bullet.className = `${ type } bullet`;
        _bullet.style.width = `${ this.size.width }px`;
        _bullet.style.height = `${ this.size.height }px`;
        _bullet.style.rotate = `${ -this.angle + Math.PI / 2 }rad`;


        let offsetX = players[team].size / 2 - this.size.width / 2;
        // let offsetY = players[team].size / 2 - this.size.height / 1.5
        // let offsetX = 4;
        let offsetY = -players[type].size / 2 + this.size.height / 2;

        if (type === team) {
            _bullet.style.left = `${ absolutePosition[team].x - cameraPosition.x + offsetX}px`;
            _bullet.style.top = `${ -absolutePosition[team].y - cameraPosition.y - offsetY}px`;

            this.absPos.x = absolutePosition[team].x + offsetX;
            this.absPos.y = absolutePosition[team].y - offsetY;
        } else {
            _bullet.style.left = `${ absolutePosition[getEnemyTeam()].x - cameraPosition.x + offsetX}px`;
            _bullet.style.top = `${ -absolutePosition[getEnemyTeam()].y - cameraPosition.y - offsetY}px`;

            this.absPos.x = absolutePosition[getEnemyTeam()].x + offsetX;
            this.absPos.y = absolutePosition[getEnemyTeam()].y - offsetY;
        }

        if (this.damage == 0) {
            _bullet.style.opacity = `20%`;
            _bullet.style.backgroundColor = `black`;
        }
        
        if (this.style.color !== undefined) _bullet.style.backgroundColor  = `${ this.style.color }`;
        if (this.style.opacity !== undefined) _bullet.style.opacity  = `${ this.style.opacity }%`;
        _main.appendChild(_bullet);

        const update = setInterval(() => {
            // clearInterval(update);
            this._movedDistance += this.speed;

            let enemyTar: 'red' | 'blue' = this.targetEnemy[1] == 'blue' ? 'red' : 'blue';
            let totalDamage = {melee: 0, magic: 0};

            if (this.targetEnemy[0]) {
                this.angle = Math.atan2(absolutePosition[enemyTar].y - this.absPos.y - offsetY, absolutePosition[enemyTar].x - this.absPos.x + offsetX);
                this.absPos.x += this.speed * Math.cos(this.angle);
                this.absPos.y += this.speed * Math.sin(this.angle);
            } else {
                this.absPos.x += -this.speed * Math.cos(this.angle);
                this.absPos.y += -this.speed * Math.sin(this.angle);
            }


            _bullet.style.left = `${ this.absPos.x - cameraPosition.x + offsetX }px`;
            _bullet.style.top = `${ -this.absPos.y - cameraPosition.y - 2 * offsetY }px`;

            // on-hit
            let isCritical: boolean = Math.random() <= this.critical[0] / 100;

            if (type === getEnemyTeam() && this.damage > 0) {
                if (this.isCollideWithPlayer2(_bullet, team) && !this.isCollide) {
                    let damageCoefficient = {
                        melee: (1 / (1 + (players[team].spec.armor - players[getEnemyTeam()].spec.ignoreArmor) * 0.01)),
                        magic: (1 / (1 + players[team].spec.magicRegist * 0.01)),
                        true: 1
                    };
                    let criticalDamage: number =  this.damage * (1.75 + this.critical[1] / 100);
                    this.isCollide = true;

                    
                    if (!this.canPass) this.isArrive = false;

                    if (skillHit.vampire == true) return;

                    // 크리티컬 데미지
                    if (isCritical) {
                        players[team].hp[1] -= criticalDamage * damageCoefficient[this.damageType];
                        totalDamage[this.damageType] += criticalDamage * damageCoefficient[this.damageType];
                        
                        // damageAlert(this.damageType, damageCoefficient[this.damageType] * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    } else {
                        players[team].hp[1] -= this.damage * damageCoefficient[this.damageType];
                        totalDamage[this.damageType] += this.damage * damageCoefficient[this.damageType];
                        // damageAlert(this.damageType, this.damage * damageCoefficient[this.damageType], false, type == 'blue' ? 'red' : 'blue');
                    };
                    
                    // 아이템 감지
                    players[getEnemyTeam()].items.forEach(e => {
                        if (e?.name[1] == '3_molwang' && !this.onhit?.includes('skill')) {
                            players[team].hp[1] -= players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee;
                            totalDamage.melee += players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee;

                            // socket.send(JSON.stringify({
                            //     body: {
                            //         msg: 'damageAlert',
                            //         info: [
                            //             "melee",
                            //             players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee,
                            //             false,
                            //             type == 'blue' ? 'red' : 'blue'
                            //         ]
                            //     }
                            // }));
                            // damageAlert("melee", players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if (e?.name[1] == '3_nashor' && !this.onhit?.includes('skill')) {
                            players[team].hp[1] -= e.extra[0] * damageCoefficient.magic;
                            totalDamage.magic += e.extra[0] * damageCoefficient.magic;

                            // socket.send(JSON.stringify({
                            //     body: {
                            //         msg: 'damageAlert',
                            //         info: [
                            //             "magic",
                            //             e.extra[0] * damageCoefficient.magic,
                            //             false,
                            //             type == 'blue' ? 'red' : 'blue'
                            //         ]
                            //     }
                            // }));
                            
                            // damageAlert("magic", e.extra[0] * damageCoefficient.magic, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if (e?.name[1] == '3_rapid_firecannon') {
                            let alphaDamage = playerDistance / findItem('3_rapid_firecannon').body.extra[1] / 2// 1000에서 1.2가 나오도록

                            console.log(alphaDamage, playerDistance);

                            if (alphaDamage > findItem('3_rapid_firecannon').body.extra[0]) alphaDamage = findItem('3_rapid_firecannon').body.extra[0]

                            players[team].hp[1] -= this.damage * alphaDamage * damageCoefficient.melee;
                            totalDamage.melee += this.damage * alphaDamage * damageCoefficient.melee;
                        }
                        if (e?.name[1] == '3_collector') {
                            if (players[team].hp[1] / players[team].hp[0] <= findItem('3_collector').body.extra[0] / 100) {
                                players[team].hp[1] -= 9999;

                                socket.send(JSON.stringify({
                                    body: {
                                        msg: 'damageAlert',
                                        info: [
                                            "true",
                                            9999,
                                            false,
                                            type == 'blue' ? 'red' : 'blue'
                                        ]
                                    }
                                }));
                                damageAlert("melee", e.extra[0] * this.damage * playerDistance / 3000 * damageCoefficient.melee, false, type == 'blue' ? 'red' : 'blue');
                            }

                        }
                        if (e?.name[1] == '3_shadowflame' && this.damageType == 'magic' && isCritical) {
                            players[team].hp[1] -= this.damage * criticalDamage * damageCoefficient.magic;
                            totalDamage.magic += this.damage * criticalDamage * damageCoefficient.magic;
                        }

                    });

                    if (players[team].marker?.ezreal == true) {
                        absolutePosition[team].x += 3;
                        absolutePosition[team].y -= 3;

                        players[team].hp[1] -= (
                            players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage) * damageCoefficient.magic
                        players[team].marker.ezreal = false;
                        totalDamage.magic += (
                            players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage) * damageCoefficient.magic

                        // damageAlert("magic", (
                        //     players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                        //     players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                        //     enemySkillInfo.passive.damage) * damageCoefficient.magic
                        // , false, type == 'blue' ? 'red' : 'blue');

                        // socket.send(JSON.stringify({
                        //     body: {
                        //         msg: 'damageAlert',
                        //         info: [
                        //             "magic",
                        //             (players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                        //             players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                        //             enemySkillInfo.passive.damage) * damageCoefficient.magic,
                        //             false,
                        //             type == 'blue' ? 'red' : 'blue'
                        //         ]
                        //     }
                        // }));
                    }
                    
                    // 캐릭터별 온힛 효과
                    if (this.onhit?.includes("ezreal") && this.onhit?.includes(" e")) {
                        absolutePosition[team].x -= 3;
                        absolutePosition[team].y += 3;
                        players[team].marker.ezreal = true;
                    } else if (this.onhit?.includes("samira")) {
                        socket.send(JSON.stringify({
                            body: {
                                msg: `samiraOnhit`, damageType: this.onhit?.split(' ')[this.onhit.split(' ').length - 1]
                            }
                        }));

                        if (this.onhit?.includes(" e")) {
                            canMove = false;
                            
                            setTimeout(() => {
                                canMove = true;
                            }, enemySkillInfo.e.duration * 10);
                        }

                        
                        if (this.damage > 0) onhitCount[type] += 1;
                        socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy', type: "skill"}}));
                    } else if (char[getEnemyTeam()] == 'vayne') {
                        if (players[team].marker.vayne === undefined) players[team].marker.vayne = 0
                        players[team].marker.vayne += 1;
                        
                        if (players[team].marker.vayne == 3) {
                            players[team].marker.vayne = 0;
                            players[team].hp[1] -= players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100;

                            socket.send(JSON.stringify({
                                body: {
                                    msg: 'damageAlert',
                                    info: [
                                        "true",
                                        players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100,
                                        false,
                                        type == 'blue' ? 'red' : 'blue'
                                    ]
                                }
                            }));
                            damageAlert("true", players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100, false, type == 'blue' ? 'red' : 'blue');
                        }

                        if (this.onhit?.includes('bondage')) {
                            canMove = false;

                            setTimeout(() => {
                                canMove = true;
                            }, enemySkillInfo.shift.duration * 10);
                        }
                    } else if (this.onhit?.includes('vampire skill e')) {
                        skillHit.vampire = true;
                        
                        setTimeout(() => {
                            skillHit.vampire = false;
                        }, 100);
                    } else if (this.onhit?.includes('aphelios')) {
                        if (players[team].marker.aphelios.Calibrum && this.onhit.includes('aa') && this.onhit.includes('Cali-true')) {
                            players[team].marker.aphelios.Calibrum = false;
                            players[team].marker.aphelios.CalibrumWheel = false;

                            //@ts-ignore
                            totalDamage.melee += (4 + 0.3 * players[getEnemyTeam()].spec.ad) * damageCoefficient.melee;
                            //@ts-ignore
                            players[team].hp[0] -= (4 + 0.3 * players[getEnemyTeam()].spec.ad) * damageCoefficient.melee;
                        }
                        // if (players[team].marker.aphelios === undefined) players[team].marker.aphelios = {Calibrum: false, Gravitum: false};

                        if (this.onhit?.includes('sub-Calibrum')) {
                            players[team].marker.aphelios.Calibrum = true;
                            
                            if (this.onhit?.includes('wheel')) {
                                players[team].marker.aphelios.CalibrumWheel = true;
                            }
                        } else if (this.onhit?.includes('ravitum')) {
                            players[team].marker.aphelios.Gravitum = true;
                            slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.25;
                            
                            slowTime = 400;
                            if (this.onhit.includes('wheel')) {
                                slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.7;
                                
                                setTimeout(() => {
                                    slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.25;
                                }, 150);
                            }
                        } else if (this.onhit?.includes('sub-Crescendum')) {
                            socket.send(JSON.stringify({body: {msg: "aphlios-crescendum"}}));
                            
                            if (this.onhit?.includes('wheel')) {
                                socket.send(JSON.stringify({body: {msg: "aphlios-crescendum"}}));
                                socket.send(JSON.stringify({body: {msg: "aphlios-crescendum"}}));
                                socket.send(JSON.stringify({body: {msg: "aphlios-crescendum"}}));
                                socket.send(JSON.stringify({body: {msg: "aphlios-crescendum"}}));
                                socket.send(JSON.stringify({body: {msg: "aphlios-crescendum"}}));
                            }
                        }
                    }

                    if (this.onhit?.includes('skill')) {
                        socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy', type: "skill"}}));
                    } else {
                        socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy', type: "aa"}}));
                    }

                    socket.send(JSON.stringify({
                        body: {
                            msg: 'damageAlert',
                            info: [
                                "melee",
                                totalDamage.melee,
                                isCritical,
                                type == 'blue' ? 'red' : 'blue'
                            ]
                        }
                    }));
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'damageAlert',
                            info: [
                                "magic",
                                totalDamage.magic,
                                isCritical,
                                type == 'blue' ? 'red' : 'blue'
                            ]
                        }
                    }));
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'damageAlert',
                            info: [
                                "heal",
                                (totalDamage.melee + totalDamage.magic) * players[type].spec.vamp / 100 ,
                                false,
                                type
                            ]
                        }
                    }));
                    damageAlert("melee", totalDamage.melee, isCritical, type == 'blue' ? 'red' : 'blue');
                    damageAlert("magic", totalDamage.magic, isCritical, type == 'blue' ? 'red' : 'blue');
                    damageAlert("heal", (totalDamage.melee + totalDamage.magic) * players[type].spec.vamp / 100, false, type);
                }

                let nexusIndex = {blue: [7, 8], red: [9, 10]};

                if (this.isCollideWithNexus(gameObjects[nexusIndex[team][1]].objSelector, _bullet) && gameObjects[nexusIndex[team][0]].isCollide(players[getEnemyTeam()].selector) && !this.isCollide) {
                    if (nexusHp[team][1] <= 0) return;
                    
                    nexusHp[team][1] -= this.damage;
                    nexusHp[team][1] -= players[getEnemyTeam()].spec.ap * 0.7;
                    this.isCollide = true;

                    socket.send(JSON.stringify({body: {msg: 'onhit', target: 'nexus'}}));
                }
            } else {
                if (this.isCollideWithPlayer(_bullet, getEnemyTeam()) && !this.isCollide) {
                    let damageCoefficient: number = 0;

                    if (this.damageType == 'melee') damageCoefficient = (1 / (1 + (players[getEnemyTeam()].spec.armor - players[team].spec.ignoreArmor) * 0.01));
                    if (this.damageType == 'magic') damageCoefficient = (1 / (1 + players[getEnemyTeam()].spec.magicRegist * 0.01));
                    if (this.damageType == 'true') damageCoefficient = 1;

                    
                    if (isCritical) {
                        let criticalDamage: number =  this.damage * (1.75 + this.critical[1] / 100);
                        
                        // damageAlert(this.damageType, damageCoefficient * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    } else {
                        // damageAlert(this.damageType, this.damage * damageCoefficient, isCritical, type == 'blue' ? 'red' : 'blue');
                    };


                    if (this.damage > 0) onhitCount[type] += 1;

                    if (!this.canPass) this.isArrive = false;
                    if (char[team] == 'ezreal' && this.onhit?.includes('skill')) {
                        this.isCollide = true;
                        charClass.cooldown.q -= skillInfo.passive.skillHaste
                        charClass.cooldown.e -= skillInfo.passive.skillHaste
                        charClass.cooldown.shift -= skillInfo.passive.skillHaste
                        charClass.cooldown.wheel -= skillInfo.passive.skillHaste
                    }
                    if (char[team] == 'sniper' && charClass.isActive.q) charClass.isActive.q = false;
                    if (char[team] === 'aphelios' && this.onhit.includes('wheel')) {
                        if (apheliosWeapon[0] === 'Severum') {
                            let heal: number = players[team].hp[0] * 0.3 + 20
                            players[team].hp[1] += heal
                            damageAlert("heal", heal, false, team)
                        }
                    }
                }
            }

            // 화면 밖으로 나가면 탄환 제거
            gameObjects.forEach((e) => {
                if (this.ignoreObj) return false;
                if (e.isCollide(_bullet) && e.extra.canCollide && this.isArrive) {
                    this.isArrive = false;
                }
            })

            if (this._movedDistance >= this.reach * 1.5 && this.isArrive) {
                this.isArrive = false;
            }

            if (!this.isArrive) {
                clearInterval(update);
                _main.removeChild(_bullet);
            }
        }, 16);
    }

    public isCollideWithPlayer(projectileSelector: HTMLDivElement, team: 'red' | 'blue'): boolean {
        const r1 = players[team].selector.offsetWidth / 2;
        const r2 = projectileSelector.offsetWidth / 2;

        const x1 = players[team].selector.offsetLeft + r1;
        const y1 = players[team].selector.offsetTop + r1;
        const x2 = projectileSelector.offsetLeft + r2;
        const y2 = projectileSelector.offsetTop + r2;

        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        return distance <= (r1 + r2);
    }

    public isCollideWithPlayer2(projectileSelector: HTMLDivElement, team: 'red' | 'blue'): boolean {
        const rect1 = players[team].selector.getBoundingClientRect();
        const rect2 = projectileSelector.getBoundingClientRect();

        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }
    

    public isCollideWithNexus(victim: HTMLDivElement, projectileSelector: HTMLDivElement): boolean {
        if (this.onhit?.includes('skill')) return false;
        const r1 = projectileSelector.offsetWidth / 2;
        const r2 = victim.offsetWidth / 2;

        const x1 = projectileSelector.offsetLeft + r1;
        const y1 = projectileSelector.offsetTop + r1;
        const x2 = victim.offsetLeft + r2;
        const y2 = victim.offsetTop + r2;

        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        return distance <= (r1 + r2);
    }
}

class ProjectileBuilder {
    private projectile: Projectile;

    constructor() {
        this.projectile = new Projectile();
    }

    public setDegree(degree: number): ProjectileBuilder {
        this.projectile.angle = degree;
        return this;
    }

    public setDamage(damage: number, type: "magic" | "melee" | "true", random?: number): ProjectileBuilder {
        this.projectile.damage = damage;
        this.projectile.damageType = type;
        return this;
    }

    public setSpeed(spd: number): ProjectileBuilder {
        this.projectile.speed = spd;
        return this;
    }

    public setPos(x: number, y: number): ProjectileBuilder {
        this.projectile.absPos.x = x;
        this.projectile.absPos.y = y;

        return this;
    }

    public setReach(time: number): ProjectileBuilder {
        this.projectile.reach = time;
        return this;
    }

    public setCritical(chance: number, damage: number): ProjectileBuilder {
        this.projectile.critical = [chance, damage];
        return this;
    }
    
    public setSize(size: ObjSize): ProjectileBuilder {
        this.projectile.size = size;
        return this;
    }

    public setStyle(color: string, opacity?: number): ProjectileBuilder {
        this.projectile.style.color = color;
        this.projectile.style.opacity = opacity;
        return this;
    }

    public onHit(msg: string): ProjectileBuilder {
        this.projectile.onhit = msg;
        return this;
    }

    public ignoreObj(boolean: boolean = true): ProjectileBuilder {
        this.projectile.ignoreObj = boolean;
        return this;
    }

    public setTarget(boolean: boolean = true, tarTeam: 'red' | 'blue' = team): ProjectileBuilder {
        this.projectile.targetEnemy = [boolean, tarTeam];
        return this;
    }

    public canPass(boolean: boolean = true): ProjectileBuilder {
        this.projectile.canPass = boolean;
        return this;
    }

    public build(type: "blue" | "red") {
        this.projectile.start(type);

        return this.projectile;
    }
}