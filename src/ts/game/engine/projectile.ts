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
    public offset: {x: number, y: number} = {x: 0, y: 0};
    public selector: HTMLDivElement = undefined;

    public start(type: "blue" | "red") {
        const _main: HTMLElement = document.querySelector('.projectiles');
        this.selector = document.createElement('div');

        let _bullet = this.selector;

        let talonEBack: boolean = false;

        _bullet.className = `${ type } bullet`;
        _bullet.style.width = `${ this.size.width }px`;
        _bullet.style.height = `${ this.size.height }px`;
        _bullet.style.rotate = `${ -this.angle + Math.PI / 2 }rad`;


        let offsetX = players[team].size / 2 - this.size.width / 2;
        // let offsetY = players[team].size / 2 - this.size.height / 1.5
        // let offsetX = 4;
        let offsetY = -players[type].size / 2 + this.size.height / 2;

        if (this.onhit?.includes('objProjectile')) {
            _bullet.style.left = `${ absolutePosition[getEnemyTeam()].x - cameraPosition.x + offsetX}px`;
            _bullet.style.top = `${ -absolutePosition[getEnemyTeam()].y - cameraPosition.y - offsetY}px`;
        } else if (type === team) {
            _bullet.style.left = `${ absolutePosition[team].x - cameraPosition.x + offsetX}px`;
            _bullet.style.top = `${ -absolutePosition[team].y - cameraPosition.y - offsetY}px`;

            // this.absPos.x = absolutePosition[team].x + offsetX;
            // this.absPos.y = absolutePosition[team].y - offsetY;
            this.absPos.x = absolutePosition[team].x + offsetX + this.offset.x;
            this.absPos.y = absolutePosition[team].y - offsetY + this.offset.y;
        } else if (type === getEnemyTeam()) {
            _bullet.style.left = `${ absolutePosition[getEnemyTeam()].x - cameraPosition.x + offsetX}px`;
            _bullet.style.top = `${ -absolutePosition[getEnemyTeam()].y - cameraPosition.y - offsetY}px`;
            
            // this.absPos.x = absolutePosition[getEnemyTeam()].x + offsetX - this.absPos.x;
            // this.absPos.y = absolutePosition[getEnemyTeam()].y - offsetY + this.absPos.y;
            this.absPos.x = absolutePosition[getEnemyTeam()].x + offsetX + this.offset.x;
            this.absPos.y = absolutePosition[getEnemyTeam()].y - offsetY + this.offset.y;
        }

        if (this.damage == 0) {
            _bullet.style.opacity = `20%`;
            _bullet.style.backgroundColor = `black`;
        }

        if (this.onhit?.includes("yasuo skill aa q")) {
            this.absPos.x += -100 * Math.cos(this.angle);
            this.absPos.y += -100 * Math.sin(this.angle);
        }
        
        if (this.style.color !== undefined) _bullet.style.backgroundColor  = `${ this.style.color }`;
        if (this.style.opacity !== undefined) _bullet.style.opacity  = `${ this.style.opacity }%`;
        _main.appendChild(_bullet);

        const update = setInterval(() => {
            // clearInterval(update);
            this._movedDistance += this.speed;

            let enemyTar: 'red' | 'blue' = this.targetEnemy[1] == 'blue' ? 'red' : 'blue';
            let totalDamage = {melee: 0, magic: 0, true: 0};

            if (this.targetEnemy[0]) {
                if (deathCoolDown[this.targetEnemy[1] === 'blue' ? 'red' : 'blue'] > 0) this.isArrive = false;

                this.angle = Math.atan2(absolutePosition[enemyTar].y - this.absPos.y - offsetY, absolutePosition[enemyTar].x - this.absPos.x + offsetX);
                this.absPos.x += this.speed * Math.cos(this.angle);
                this.absPos.y += this.speed * Math.sin(this.angle);

            } else {
                this.absPos.x += -this.speed * Math.cos(this.angle);
                this.absPos.y += -this.speed * Math.sin(this.angle);
            }

            if (this.onhit?.includes("ahri skill q1")) {
                this.speed -= 0.3;
            } else if (this.onhit?.includes("ahri skill q2")) {
                this.speed += 0.3;
            } else if (this.onhit?.includes("yasuo skill e")) {
                this.speed -= 1.5;

                if (this.speed < 0) {
                    this.speed = 0;
                
                    setTimeout(() => {
                        this.isArrive = false;
                    }, 4000);
                }
            }


            _bullet.style.left = `${ this.absPos.x - cameraPosition.x + offsetX }px`;
            _bullet.style.top = `${ -this.absPos.y - cameraPosition.y - 2 * offsetY }px`;

            // on-hit
            let isCritical: boolean = Math.random() <= this.critical[0] / 100;
            let hasShadowflame: boolean = false;


            if (type === getEnemyTeam() && this.damage > 0) {
                if (this.isCollideWithPlayer2(_bullet, getEnemyTeam())) {
                    // 부메랑 회수 - 상대 화면
                    if (this.onhit?.includes('ahri skill q2')) {
                        this.isArrive = false;
                    } else if (this.onhit?.includes('talon skill e2')) {
                        this.isArrive = false;
                    } else if (this.onhit?.includes(`talon skill wheel2`) && this.targetEnemy[1] === team) {
                        this.isArrive = false;
                    }
                }
                if (this.isCollideWithPlayer2(_bullet, team) && !this.isCollide) {
                    let damageCoefficient = {
                        melee: (1 / (1 + (players[team].spec.armor * (1 - players[getEnemyTeam()].spec.ignoreArmorPercent / 100) - players[getEnemyTeam()].spec.ignoreArmor) * 0.01)),
                        magic: (1 / (1 + players[team].spec.magicRegist * 0.01)),
                        true: 1
                    };
                    let criticalDamage: number =  this.damage * (1.5 + this.critical[1] / 100);
                    this.isCollide = true;

                    if (!this.canPass) this.isArrive = false;
                    // if (this.onhit?.includes('sniper skill e') && this._movedDistance < 0.06) {
                    //     this.isCollide = false;
                    // }



                    if (skillHit.vampire == true) return;
                    if (skillHit.ashe == true) return;
                    if (skillHit.talonE == true) return;
                    if (skillHit.akali == true) return;
                    if (players[team].marker.zhonya) {
                        this.canPass = true;
                        return;
                    };

                    // 크리티컬 데미지
                    if (isCritical) {
                        totalDamage[this.damageType] += criticalDamage;
                    } else {
                        totalDamage[this.damageType] += this.damage;
                    };
                    
                    // 아이템 감지  
                    players[getEnemyTeam()].items.forEach(e => {
                        if (this.onhit?.includes('objProjectile')) return;
                        if (e?.name[1] == '3_molwang' && !this.onhit?.includes('skill')) {
                            totalDamage.melee += players[team].hp[1] * (e.extra[0] / 100);
                        }
                        if (e?.name[1] == '3_nashor' && !this.onhit?.includes('skill')) {
                            totalDamage.magic += e.extra[0];
                        }
                        if (e?.name[1] == '3_rapid_firecannon') {
                            let alphaDamage = playerDistance / findItem('3_rapid_firecannon').body.extra[1] / 2// 1000에서 1.2가 나오도록

                            // console.log(alphaDamage, playerDistance);

                            if (alphaDamage > findItem('3_rapid_firecannon').body.extra[0]) alphaDamage = findItem('3_rapid_firecannon').body.extra[0]

                            totalDamage.melee += this.damage * alphaDamage;
                        }
                        if (e?.name[1] == '3_collector') {
                            if (players[team].hp[1] / players[team].hp[0] <= findItem('3_collector').body.extra[0] / 100) {
                                totalDamage.true += 9999;
                            }

                        }
                        if (e?.name[1] == '3_shadowflame' && isCritical) {
                            hasShadowflame = true;
                        }
                        if (e?.name[1] === '3_liandry' && this.onhit?.includes('skill') && this.damageType === 'magic') {
                            cooldownItem.liandry.duration = findItem('3_liandry').body.extra[1];
                        }
                    });

                    // 플레이어가 가지고 있는 아이템에 따라..
                    if (hasItem('3_shieldbow') && cooldownItem.shieldbow == 0 && players[team].hp[1] / players[team].hp[0] <= 0.35 && players[team].hp[1] > 0 && !this.onhit?.includes('objProjectile')) {
                        const shieldbow = findItem('3_shieldbow').body;

                        players[team].barrier.push([players[team].hp[0] * (shieldbow.extra[0] / 100) + shieldbow.extra[2], shieldbow.extra[3] * 100]);
                        cooldownItem.shieldbow = findItem("3_shieldbow").body.extra[1];
                    }

                    if (players[team].marker?.ezreal == true && !this.onhit?.includes('objProjectile')) {
                        absolutePosition[team].x += 3;
                        absolutePosition[team].y -= 3;

                        players[team].marker.ezreal = false;
                        totalDamage.magic += (
                            players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage
                        )
                    }
                    
                    // 챔피언별 온힛 효과
                    if (this.onhit?.includes('objProjectile')) {let a = 1;}
                    else if (this.onhit?.includes('sniper skill e2') || this.onhit?.includes('sniper skill shift')) {
                        players[team].marker.sniper = true;
                        players[team].status.cc.cantMove = 150;
                        this.isArrive = false;
                    } else if (this.onhit?.includes("ezreal") && this.onhit?.includes(" e")) {
                        absolutePosition[team].x -= 3;
                        absolutePosition[team].y += 3;
                        players[team].marker.ezreal = true;
                    } else if (this.onhit?.includes("samira")) {
                        socket.send(JSON.stringify({
                            body: {
                                msg: `samiraOnhit`, damageType: this.onhit?.split(' ')[this.onhit.split(' ').length - 1]
                            }
                        }));

                        if (this.onhit?.includes("samira skill e")) {
                            players[team].status.cc.stun += enemySkillInfo.e.duration * 10
                        }

                        
                        if (this.damage > 0) onhitCount[type] += 1;
                        socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy', type: "skill"}}));
                    } else if (char[getEnemyTeam()] == 'vayne') {
                        if (players[team].marker.vayne === undefined) players[team].marker.vayne = 0
                        players[team].marker.vayne += 1;
                        
                        if (players[team].marker.vayne == 3) {
                            players[team].marker.vayne = 0;
                            totalDamage.true += players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100;
                        }

                        if (this.onhit?.includes('bondage')) {
                            players[team].status.cc.stun += enemySkillInfo.shift.duration
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
                            totalDamage.melee += (4 + 0.3 * players[getEnemyTeam()].spec.ad);
                            //@ts-ignore
                            // players[team].hp[1] -= (4 + 0.3 * players[getEnemyTeam()].spec.ad) * damageCoefficient.melee;
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
                    } else if (this.onhit?.includes('ashe')) {
                        players[team].marker.ashe = 1;
                        slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.2;
                        
                        slowTime = 250;

                        if (this.onhit?.includes('ashe skill e')) {
                            skillHit.ashe = true;

                            setTimeout(() => {
                                skillHit.ashe = false;
                            }, 100);
                        } else if (this.onhit?.includes('ashe skill wheel')) {
                            players[team].status.cc.stun = enemySkillInfo.wheel.duration;

                            charClass.cooldown.q += enemySkillInfo.wheel.duration;
                            charClass.cooldown.e += enemySkillInfo.wheel.duration;
                            charClass.cooldown.shift += enemySkillInfo.wheel.duration;
                            charClass.cooldown.wheel += enemySkillInfo.wheel.duration;

                            atkWait += enemySkillInfo.wheel.duration;

                            // setTimeout(() => {
                            //     canMove = true;
                            // }, enemySkillInfo.wheel.duration * 10);
                        }
                    } else if (this.onhit?.includes('kaisa')) {
                        if (this.onhit?.includes('aa')) {
                            players[team].marker.kaisa += 1;
                        } else if (this.onhit?.includes('skill e')) {
                            players[team].marker.kaisa += 2;
                        }
                    } else if (this.onhit?.includes('ahri')) {
                        if (this.onhit?.includes('shift')) {
                            players[team].status.cc.stun = enemySkillInfo.shift.duration;
                            charClass.cooldown.q += enemySkillInfo.shift.duration;
                            charClass.cooldown.e += enemySkillInfo.shift.duration;
                            charClass.cooldown.shift += enemySkillInfo.shift.duration;
                            charClass.cooldown.wheel += enemySkillInfo.shift.duration;

                            atkWait += enemySkillInfo.shift.duration;

                            // setTimeout(() => {
                            //     canMove = true;
                            // }, enemySkillInfo.shift.duration * 10);
                        }
                    } else if (this.onhit?.includes('talon skill')) {
                        if (players[team].marker.talon.cooldown === 0) {
                            players[team].marker.talon.stack += 1;
                        }

                        if (this.onhit?.includes('talon skill e')) {
                            skillHit.talonE = true;
    
                            setTimeout(() => {
                                skillHit.talonE = false;
                            }, 50);
                        }
                    } else if (this.onhit?.includes('yasuo skill q2')) {
                        players[team].status.cc.stun += 100;
                        

                        charClass.cooldown.q += 100;
                        charClass.cooldown.e += 100;
                        charClass.cooldown.shift += 100;
                        charClass.cooldown.wheel += 100;

                        atkWait += 100;
                    } else if (this.onhit?.includes('akali')) {
                        if (this.onhit?.includes('skill q')) {
                            skillHit.akali = true;

                            setTimeout(() => {
                                skillHit.akali = false;
                            }, 50);
                        } else if (this.onhit?.includes('skill shift1')) {
                            players[team].marker.akali = true;
                            
                            setTimeout(() => {
                                players[team].marker.akali = false;
                            }, enemySkillInfo.shift.duration * 10)
                        }
                    } else if (this.onhit?.includes('kaisa')) {
                        if (this.onhit?.includes('aa')) {
                            players[team].marker.kaisa += 1;
                        } else if (this.onhit?.includes('skill e')) {
                            players[team].marker.kaisa += 2;
                        }
                    } else if (this.onhit?.includes('ahri')) {
                        if (this.onhit?.includes('shift')) {
                            players[team].status.cc.stun = enemySkillInfo.shift.duration;
                            charClass.cooldown.q += enemySkillInfo.shift.duration;
                            charClass.cooldown.e += enemySkillInfo.shift.duration;
                            charClass.cooldown.shift += enemySkillInfo.shift.duration;
                            charClass.cooldown.wheel += enemySkillInfo.shift.duration;

                            atkWait += enemySkillInfo.shift.duration;

                            // setTimeout(() => {
                            //     canMove = true;
                            // }, enemySkillInfo.shift.duration * 10);
                        }
                    } else if (this.onhit?.includes('talon skill')) {
                        if (players[team].marker.talon.cooldown === 0) {
                            players[team].marker.talon.stack += 1;
                        }

                        if (this.onhit?.includes('talon skill e')) {
                            skillHit.talonE = true;
    
                            setTimeout(() => {
                                skillHit.talonE = false;
                            }, 50);
                        }
                    } else if (this.onhit?.includes('yasuo skill q2')) {
                        players[team].status.cc.stun += 100;
                        

                        charClass.cooldown.q += 100;
                        charClass.cooldown.e += 100;
                        charClass.cooldown.shift += 100;
                        charClass.cooldown.wheel += 100;

                        atkWait += 100;
                    }

                    if (hasShadowflame && isCritical && !this.onhit?.includes('objProjectile')) {
                        // players[team].hp[1] -= this.damage * criticalDamage * damageCoefficient.magic;
                        totalDamage.magic *= (1 + this.critical[1] / 100);
                    }

                    let totalDamageSum = totalDamage.magic * damageCoefficient.magic + totalDamage.melee * damageCoefficient.melee + totalDamage.true

                    if (this.onhit?.includes('skill') && !this.onhit?.includes('objProjectile')) {
                        socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy', type: "skill", tags: this.onhit, damage: totalDamageSum}}));
                    } else {
                        socket.send(JSON.stringify({body: {msg: "onhit", target: 'enemy', type: "aa", tags: this.onhit, damage: totalDamageSum}}));
                        // console.log(totalDamageSum);
                    }


                    let isRange: number = this.onhit?.includes('range') ? 1 : 0;

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
                                ((totalDamage.melee * damageCoefficient.melee + totalDamage.magic * damageCoefficient.magic + totalDamage.true) * players[type].spec.vamp / 100) * (1 - isRange * 0.33),
                                false,
                                type
                            ]
                        }
                    }));
                    socket.send(JSON.stringify({
                        body: {
                            msg: 'damageAlert',
                            info: [
                                "true",
                                totalDamage.true ,
                                false,
                                type == 'blue' ? 'red' : 'blue'
                            ]
                        }
                    }));
                    damageAlert("melee", totalDamage.melee, isCritical, type == 'blue' ? 'red' : 'blue');
                    damageAlert("magic", totalDamage.magic, isCritical, type == 'blue' ? 'red' : 'blue');
                    damageAlert("true", totalDamage.true, isCritical, type == 'blue' ? 'red' : 'blue');
                    damageAlert("heal", ((totalDamage.melee * damageCoefficient.melee + damageCoefficient.magic * totalDamage.magic + totalDamage.true) * players[type].spec.vamp / 100) * (1 - isRange * 0.33), false, type);
                }

                let nexusIndex = {blue: [7, 8], red: [9, 10]};

                if (this.isCollideWithNexus(gameObjects[nexusIndex[team][1]].objSelector, _bullet) && gameObjects[nexusIndex[team][0]].isCollide(players[getEnemyTeam()].selector) && !this.isCollide) {
                    if (nexusHp[team][1] <= 0) return;
                    
                    nexusHp[team][1] -= (1 / (1 + 50 * 0.01)) * this.damage;
                    nexusHp[team][1] -= players[getEnemyTeam()].spec.ap * 0.7 * (1 / (1 + 30 * 0.01));
                    this.isCollide = true;

                    socket.send(JSON.stringify({body: {msg: 'onhit', target: 'nexus'}}));
                } else if (this.isCollideWithNexus(gameObjects[11].objSelector, _bullet) && !this.isCollide && !this.onhit?.includes('objProjectile')) {
                    if (objHp[1] <= 0) return;
                    
                    objHp[1] -= (1 / (1 + 50 * 0.01)) * this.damage;
                    objHp[1] -= players[getEnemyTeam()].spec.ap * 0.7 * (1 / (1 + 30 * 0.01));
                    this.isCollide = true;

                    socket.send(JSON.stringify({body: {msg: 'onhit', target: 'nexus'}}));
                }
            } else {
                if (this.isCollideWithPlayer(_bullet, type) && !this.isCollide) {
                    // 부메랑 회부 - 자기 화면
                    if (this.onhit?.includes('ahri skill q2')) {
                        this.isArrive = false;
                    } else if (this.onhit?.includes('talon skill e2')) {
                        this.isArrive = false;
                    } else if (this.onhit?.includes(`talon skill wheel2`) && this.targetEnemy[1] === getEnemyTeam()) {
                        this.isArrive = false;
                    }
                } else if (this.isCollideWithPlayer(_bullet, getEnemyTeam()) && !this.isCollide) {
                    let damageCoefficient: number = 0;

                    if (this.damageType == 'melee') damageCoefficient = (1 / (1 + (players[getEnemyTeam()].spec.armor * (1 - players[team].spec.ignoreArmorPercent / 100) - players[team].spec.ignoreArmor) * 0.01));
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
                    if (char[team] === 'aphelios' && this.onhit.includes('wheel')) {
                        if (apheliosWeapon[0] === 'Severum') {
                            let heal: number = players[team].hp[0] * 0.2 + players[team].spec.ad * 0.3
                            players[team].hp[1] += heal;
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
            });

            if (this._movedDistance >= this.reach * 1.5 && this.isArrive) {
                if (this.onhit?.includes("ahri skill q1") && type === team) {
                    projectiles[type].push(
                        new ProjectileBuilder()
                            .setDamage(skillInfo.q.damage + players[team].spec.ap * skillInfo.q.ap, "true")
                            .projOffset({x: this.absPos.x - absolutePosition[team].x, y: this.absPos.y - absolutePosition[team].y})
                            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                            .setDegree(0)
                            .setReach(5000)
                            .setSpeed(0)
                            .setTarget(true, type === 'blue' ? 'red' : 'blue')
                            .setSize({height: 40, width: 40})
                            .setStyle('rgb(145, 176, 202)')
                            .onHit(`ahri skill q2`)
                            .canPass(true)
                            .ignoreObj(true)
                            .build(team)
                    );
                }
                if (this.onhit?.includes("sniper skill e1") && type === team) {
                    projectiles[type].push(
                        new ProjectileBuilder()
                            .setDamage(0.1, skillInfo.q.type)
                            .setCritical(0, players[team].spec.criticD)
                            .projOffset({x: this.absPos.x - absolutePosition[team].x, y: this.absPos.y - absolutePosition[team].y})
                            .setReach(1)
                            .setSpeed(0.001)
                            .setSize({height: 30, width: 30})
                            .ignoreObj()
                            .onHit('sniper skill e2')
                            .build(team)
                    );
                }
                if (this.onhit?.includes("talon skill e1") || this.onhit?.includes("talon skill wheel")) {
                    this.speed = 0;
                    this.damage = 0;

                    if (!talonEBack) {
                        if (this.onhit?.includes("e1")) {
                            talonEBack = true;
    
                            setTimeout(() => {
                                this.isArrive = false;
                                skillHit.talonE = false;
    
                                if (team === type) {
                                    projectiles[type].push(
                                        new ProjectileBuilder()
                                            //@ts-ignore
                                            .setDamage(skillInfo.e.damages[1].damage + players[team].spec.ad * skillInfo.e.damages[1].ad, "melee")
                                            .projOffset({x: this.absPos.x - absolutePosition[team].x, y: this.absPos.y - absolutePosition[team].y})
                                            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                                            .setDegree(0)
                                            .setReach(5000)
                                            .setSpeed(20)
                                            .setTarget(true, type === 'blue' ? 'red' : 'blue')
                                            .setSize({height: 50, width: 50})
                                            .setStyle('rgb(110, 114, 124)')
                                            .onHit(`talon skill e2`)
                                            .canPass(true)
                                            .ignoreObj(true)
                                            .build(team)
                                    );
                                }
                            }, 700);
                        } else if (this.onhit?.includes('wheel')) {
                            talonEBack = true;
    
                            setTimeout(() => {
                                this.isArrive = false;
    
                                if (team === type) {
                                    projectiles[type].push(
                                        new ProjectileBuilder()
                                            //@ts-ignore
                                            .setDamage(skillInfo.wheel.damages[1].damage + players[team].spec.ad * skillInfo.wheel.damages[1].ad, "melee")
                                            .projOffset({x: this.absPos.x - absolutePosition[team].x, y: this.absPos.y - absolutePosition[team].y})
                                            .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                                            .setDegree(0)
                                            .setReach(5000)
                                            .setSpeed(40)
                                            .setTarget(true, talonHitWheel ? team : getEnemyTeam())
                                            .setSize({height: 60, width: 60})
                                            .setStyle('rgb(36, 37, 39)')
                                            .onHit(`talon skill wheel2`)
                                            .canPass(!talonHitWheel)
                                            .ignoreObj(true)
                                            .build(team)
                                    );
                                }
                            }, 2500);
                        }
                    }
                }

                if (!this.onhit?.includes('talon skill e1') && !this.onhit?.includes('talon skill wheel')) this.isArrive = false;
                // this.isArrive = false;
            }

            if (!this.isArrive) {
                clearInterval(update);
                _main.removeChild(_bullet);
            }

            this.selector = _bullet;
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
        // if (this.onhit?.includes('skill')) return false;
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

    public projOffset(offset: {x: number, y: number}): ProjectileBuilder {
        this.projectile.offset = offset;
        return this;
    }

    public setSelector(selector: HTMLDivElement): ProjectileBuilder {
        this.projectile.selector = selector;
        return this;
    }

    public build(type: "blue" | "red") {
        this.projectile.start(type);

        return this.projectile;
    }
}