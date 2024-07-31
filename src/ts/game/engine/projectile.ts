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
        color: undefined
    };
    public ignoreObj: boolean = false;
    public onhit: string = undefined;
    public damageType: string;
    public targetEnemy: [boolean, 'red' | 'blue'] = [false, team];
    public canPass: boolean = false;

    public start(type: "blue" | "red") {
        const _main: HTMLElement = document.querySelector('.projectiles');
        let _bullet: HTMLDivElement = document.createElement('div');

        _bullet.className = `${ type } bullet`;
        _bullet.style.width = `${ this.size.width }px`;
        _bullet.style.height = `${ this.size.height }px`;
        _bullet.style.rotate = `${ -this.angle + Math.PI / 2 }rad`;

        if (this.style.color !== undefined) _bullet.style.backgroundColor  = `${ this.style.color }`;

        if (type === team) {
            _bullet.style.top = `${ -absolutePosition[team].y - cameraPosition.y + 4}px`;
            _bullet.style.left = `${ absolutePosition[team].x - cameraPosition.x + 4}px`;

            this.absPos.x = absolutePosition[team].x + 4;
            this.absPos.y = absolutePosition[team].y + 4;
        } else {
            _bullet.style.top = `${ -absolutePosition[getEnemyTeam()].y - cameraPosition.y + 4}px`;
            _bullet.style.left = `${ absolutePosition[getEnemyTeam()].x - cameraPosition.x + 4}px`;

            this.absPos.x = absolutePosition[getEnemyTeam()].x + 4;
            this.absPos.y = absolutePosition[getEnemyTeam()].y + 4;
        }

        if (this.damage == 0) {
            _bullet.style.opacity = `20%`;
            _bullet.style.backgroundColor = `black`;
        }
        
        _main.appendChild(_bullet);

        const update = setInterval(() => {
            this._movedDistance += this.speed;

            let enemyTar: 'red' | 'blue' = this.targetEnemy[1] == 'blue' ? 'red' : 'blue';

            if (this.targetEnemy[0]) {
                this.angle = Math.atan2(absolutePosition[enemyTar].y - this.absPos.y, absolutePosition[enemyTar].x - this.absPos.x);
                this.absPos.x += this.speed * Math.cos(this.angle);
                this.absPos.y += this.speed * Math.sin(this.angle);
            } else {
                this.absPos.x += -this.speed * Math.cos(this.angle);
                this.absPos.y += -this.speed * Math.sin(this.angle);
            }


            _bullet.style.left = `${ this.absPos.x - cameraPosition.x }px`;
            _bullet.style.top = `${ -this.absPos.y - cameraPosition.y }px`;

            // on-hit
            if (type === getEnemyTeam()) {
                if (this.isCollideWithPlayer2(_bullet, team) && !this.isCollide) {
                    let damageCoefficient: number;
                    this.isCollide = true;

                    if (!this.canPass) this.isArrive = false;

                    if (this.damageType == 'melee') damageCoefficient = (1 / (1 + players[team].spec.armor * 0.01))
                    if (this.damageType == 'magic') damageCoefficient = (1 / (1 + players[team].spec.magicRegist * 0.01))

                    // 크리티컬 데미지
                    if (Math.random() <= this.critical[0] / 100) players[team].hp[1] -= this.damage * (1.75 + this.critical[1] / 100) * damageCoefficient;
                    else players[team].hp[1] -= this.damage * damageCoefficient;

                    // 아이템 감지
                    players[getEnemyTeam()].items.forEach(e => {
                        if (e?.name[1] == '3_molwang' && !this.onhit?.includes('skill')) {
                            players[team].hp[1] -= players[team].hp[1] * (e.extra[0] / 100) * (1 / (1 + players[team].spec.armor * 0.01));
                        }
                        if (e?.name[1] == '3_nashor' && !this.onhit?.includes('skill')) {
                            players[team].hp[1] -= e.extra[0] * (1 / (1 + players[team].spec.magicRegist * 0.01));
                        }
                    });

                    if (players[team].marker?.ezreal == true) {
                        absolutePosition[team].x += 3;
                        absolutePosition[team].y -= 3;

                        players[team].hp[1] -= (
                            players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage) * damageCoefficient
                        players[team].marker.ezreal = false;
                    }
                    
                    // 캐릭터별 온힛 효과
                    if (this.onhit?.includes("ezreal")) {
                        absolutePosition[team].x -= 3;
                        absolutePosition[team].y += 3;
                        players[team].marker.ezreal = true;
                    }

                    socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy'}}));
                }

                let nexusIndex = {blue: [7, 8], red: [9, 10]};

                if (this.isCollideWithNexus(gameObjects[nexusIndex[team][1]].objSelector, _bullet) && gameObjects[nexusIndex[team][0]].isCollide(players[getEnemyTeam()].selector) && !this.isCollide) {
                    nexusHp[team][1] -= this.damage;
                    this.isCollide = true;

                    socket.send(JSON.stringify({body: {msg: 'onhit', target: 'nexus'}}))
                }
            } else {
                if (this.isCollideWithPlayer(_bullet, getEnemyTeam()) && !this.isCollide) {
                    if (!this.canPass) this.isArrive = false;
                    if (char[team] == 'ezreal' && this.onhit?.includes('skill')) {
                        this.isCollide = true;
                        charClass.cooldown.q -= skillInfo.passive.skillHaste
                        charClass.cooldown.e -= skillInfo.passive.skillHaste
                        charClass.cooldown.shift -= skillInfo.passive.skillHaste
                        charClass.cooldown.wheel -= skillInfo.passive.skillHaste
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

    public setStyle(color: string): ProjectileBuilder {
        this.projectile.style.color = color;
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