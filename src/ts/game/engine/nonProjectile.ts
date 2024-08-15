class NonProjectile {
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
        color: undefined
    };
    public ignoreObj: boolean = false;
    public onhit: string = undefined;
    public damageType: 'melee' | 'magic' | 'true';
    public targetEnemy: [boolean, 'red' | 'blue'] = [false, team];
    public canPass: boolean = false;

    public start(type: "blue" | "red") {
        const _main: HTMLElement = document.querySelector('.projectiles');
        let _bullet: HTMLDivElement = document.createElement('div');

        _bullet.className = `${ type } sword`;
        _bullet.style.width = `${ this.size.width }px`;
        _bullet.style.height = `${ this.size.height }px`;
        _bullet.style.rotate = `${ -this.angle + Math.PI / 2 - 0.9 }rad`;
        _bullet.style.marginTop = `${ players[team].specINIT.projectileSize[0] / 2 }px`


        let offsetX = players[team].size / 2 - this.size.width / 2;
        let offsetY = -players[type].size / 2 + this.size.height / 2 - 2;
        // let offsetY = -30;
        // let offsetX = 30;

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
        _main.appendChild(_bullet);

        let index = 0.9;
        const update = setInterval(() => {
            // clearInterval(update);
            this._movedDistance += this.speed;
            let totalDamage = {melee: 0, magic: 0};

            _bullet.style.rotate = `${ -this.angle + Math.PI / 2 - index }rad`;
            index -= 0.1;

            this.absPos.x = absolutePosition[type].x + offsetX;
            this.absPos.y = absolutePosition[type].y - offsetY;

            _bullet.style.left = `${ this.absPos.x - cameraPosition.x }px`;
            _bullet.style.top = `${ -this.absPos.y - cameraPosition.y - offsetY * 2 }px`;

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

                    // 크리티컬 데미지
                    if (isCritical) {
                        players[team].hp[1] -= criticalDamage * damageCoefficient[this.damageType];
                        totalDamage[this.damageType] += criticalDamage * damageCoefficient[this.damageType];
                        
                        damageAlert(this.damageType, damageCoefficient[this.damageType] * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    } else {
                        players[team].hp[1] -= this.damage * damageCoefficient[this.damageType];
                        
                        totalDamage[this.damageType] += this.damage * damageCoefficient[this.damageType];
                        damageAlert(this.damageType, this.damage * damageCoefficient[this.damageType], false, type == 'blue' ? 'red' : 'blue');
                    };
                    
                    // 아이템 감지
                    players[getEnemyTeam()].items.forEach(e => {
                        if (e?.name[1] == '3_molwang' && !this.onhit?.includes('skill')) {
                            players[team].hp[1] -= players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee;
                            totalDamage.melee += players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee;

                            socket.send(JSON.stringify({
                                body: {
                                    msg: 'damageAlert',
                                    info: [
                                        "melee",
                                        players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee,
                                        false,
                                        type == 'blue' ? 'red' : 'blue'
                                    ]
                                }
                            }));
                            damageAlert("melee", players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient.melee, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if (e?.name[1] == '3_nashor' && !this.onhit?.includes('skill')) {
                            players[team].hp[1] -= e.extra[0] * damageCoefficient.magic;
                            totalDamage.magic += e.extra[0] * damageCoefficient.magic;

                            socket.send(JSON.stringify({
                                body: {
                                    msg: 'damageAlert',
                                    info: [
                                        "magic",
                                        e.extra[0] * damageCoefficient.magic,
                                        false,
                                        type == 'blue' ? 'red' : 'blue'
                                    ]
                                }
                            }));
                            
                            damageAlert("magic", e.extra[0] * damageCoefficient.magic, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if (e?.name[1] == '3_rapid_firecannon') {
                            let alphaDamage = playerDistance / 500

                            if (alphaDamage > 1.5)  alphaDamage = 1.5

                            players[team].hp[1] -= this.damage * alphaDamage * damageCoefficient.melee;
                            totalDamage.melee += this.damage * alphaDamage * damageCoefficient.melee;

                            socket.send(JSON.stringify({
                                body: {
                                    msg: 'damageAlert',
                                    info: [
                                        "melee",
                                        this.damage * playerDistance / 3000 * damageCoefficient.melee,
                                        false,
                                        type == 'blue' ? 'red' : 'blue'
                                    ]
                                }
                            }));
                            damageAlert("melee", e.extra[0] * this.damage * playerDistance / 3000 * damageCoefficient.melee, false, type == 'blue' ? 'red' : 'blue');
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
                    });

                    if (this.onhit?.includes('skill')) {
                        socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy', type: "skill"}}));
                    } else {
                        socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy', type: "aa"}}));
                    }
                }

                let nexusIndex = {blue: [7, 8], red: [9, 10]};

                if (this.isCollideWithNexus(gameObjects[nexusIndex[team][1]].objSelector, _bullet) && gameObjects[nexusIndex[team][0]].isCollide(players[getEnemyTeam()].selector) && !this.isCollide) {
                    if (nexusHp[team][1] <= 0) return;
                    
                    nexusHp[team][1] -= this.damage;
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
                        
                        damageAlert(this.damageType, damageCoefficient * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    } else {
                        damageAlert(this.damageType, this.damage * damageCoefficient, isCritical, type == 'blue' ? 'red' : 'blue');
                    };


                    if (this.damage > 0) onhitCount[type] += 1;
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

            if (index < -0.9) {
                clearInterval(update)
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

class NonProjectileBuilder {
    private projectile: NonProjectile;

    constructor() {
        this.projectile = new NonProjectile();
    }

    public setDegree(degree: number): NonProjectileBuilder {
        this.projectile.angle = degree;
        return this;
    }

    public setDamage(damage: number, type: "magic" | "melee" | "true", random?: number): NonProjectileBuilder {
        this.projectile.damage = damage;
        this.projectile.damageType = type;
        return this;
    }

    public setSpeed(spd: number): NonProjectileBuilder {
        this.projectile.speed = spd;
        return this;
    }

    public setPos(x: number, y: number): NonProjectileBuilder {
        this.projectile.absPos.x = x;
        this.projectile.absPos.y = y;

        return this;
    }

    public setReach(time: number): NonProjectileBuilder {
        this.projectile.reach = time;
        return this;
    }

    public setCritical(chance: number, damage: number): NonProjectileBuilder {
        this.projectile.critical = [chance, damage];
        return this;
    }
    
    public setSize(size: ObjSize): NonProjectileBuilder {
        this.projectile.size = size;
        return this;
    }

    public setStyle(color: string): NonProjectileBuilder {
        this.projectile.style.color = color;
        return this;
    }

    public onHit(msg: string): NonProjectileBuilder {
        this.projectile.onhit = msg;
        return this;
    }

    public ignoreObj(boolean: boolean = true): NonProjectileBuilder {
        this.projectile.ignoreObj = boolean;
        return this;
    }

    public setTarget(boolean: boolean = true, tarTeam: 'red' | 'blue' = team): NonProjectileBuilder {
        this.projectile.targetEnemy = [boolean, tarTeam];
        return this;
    }

    public canPass(boolean: boolean = true): NonProjectileBuilder {
        this.projectile.canPass = boolean;
        return this;
    }

    public build(type: "blue" | "red") {
        this.projectile.start(type);

        return this.projectile;
    }
}