var Projectile = /** @class */ (function () {
    function Projectile() {
        this.angle = 0;
        this.absPos = { x: 0, y: 0 };
        this.speed = 15;
        this._movedDistance = 0;
        this.isArrive = true;
        this.isSent = false;
        this.isCollide = false;
        this.damage = 0;
        this.critical = [0, 0];
        this.reach = -1;
        this.style = {
            color: undefined
        };
        this.ignoreObj = false;
        this.onhit = undefined;
        this.targetEnemy = [false, team];
        this.canPass = false;
    }
    Projectile.prototype.start = function (type) {
        var _this = this;
        var _main = document.querySelector('.projectiles');
        var _bullet = document.createElement('div');
        _bullet.className = "".concat(type, " bullet");
        _bullet.style.width = "".concat(this.size.width, "px");
        _bullet.style.height = "".concat(this.size.height, "px");
        _bullet.style.rotate = "".concat(-this.angle + Math.PI / 2, "rad");
        if (this.style.color !== undefined)
            _bullet.style.backgroundColor = "".concat(this.style.color);
        if (type === team) {
            _bullet.style.top = "".concat(-absolutePosition[team].y - cameraPosition.y + 4, "px");
            _bullet.style.left = "".concat(absolutePosition[team].x - cameraPosition.x + 4, "px");
            this.absPos.x = absolutePosition[team].x + 4;
            this.absPos.y = absolutePosition[team].y + 4;
        }
        else {
            _bullet.style.top = "".concat(-absolutePosition[getEnemyTeam()].y - cameraPosition.y + 4, "px");
            _bullet.style.left = "".concat(absolutePosition[getEnemyTeam()].x - cameraPosition.x + 4, "px");
            this.absPos.x = absolutePosition[getEnemyTeam()].x + 4;
            this.absPos.y = absolutePosition[getEnemyTeam()].y + 4;
        }
        if (this.damage == 0) {
            _bullet.style.opacity = "20%";
            _bullet.style.backgroundColor = "black";
        }
        _main.appendChild(_bullet);
        var update = setInterval(function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            _this._movedDistance += _this.speed;
            var enemyTar = _this.targetEnemy[1] == 'blue' ? 'red' : 'blue';
            var totalDamage = { melee: 0, magic: 0 };
            if (_this.targetEnemy[0]) {
                _this.angle = Math.atan2(absolutePosition[enemyTar].y - _this.absPos.y, absolutePosition[enemyTar].x - _this.absPos.x);
                _this.absPos.x += _this.speed * Math.cos(_this.angle);
                _this.absPos.y += _this.speed * Math.sin(_this.angle);
            }
            else {
                _this.absPos.x += -_this.speed * Math.cos(_this.angle);
                _this.absPos.y += -_this.speed * Math.sin(_this.angle);
            }
            _bullet.style.left = "".concat(_this.absPos.x - cameraPosition.x, "px");
            _bullet.style.top = "".concat(-_this.absPos.y - cameraPosition.y, "px");
            // on-hit
            var isCritical = Math.random() <= _this.critical[0] / 100;
            if (type === getEnemyTeam() && _this.damage > 0) {
                if (_this.isCollideWithPlayer2(_bullet, team) && !_this.isCollide) {
                    var damageCoefficient_1 = {
                        melee: (1 / (1 + (players[team].spec.armor - players[getEnemyTeam()].spec.ignoreArmor) * 0.01)),
                        magic: (1 / (1 + players[team].spec.magicRegist * 0.01)),
                        true: 1
                    };
                    var criticalDamage = _this.damage * (1.75 + _this.critical[1] / 100);
                    _this.isCollide = true;
                    if (!_this.canPass)
                        _this.isArrive = false;
                    // 크리티컬 데미지
                    if (isCritical) {
                        players[team].hp[1] -= criticalDamage * damageCoefficient_1[_this.damageType];
                        totalDamage[_this.damageType] += criticalDamage * damageCoefficient_1[_this.damageType];
                        damageAlert(_this.damageType, damageCoefficient_1[_this.damageType] * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    }
                    else {
                        players[team].hp[1] -= _this.damage * damageCoefficient_1[_this.damageType];
                        totalDamage[_this.damageType] += _this.damage * damageCoefficient_1[_this.damageType];
                        damageAlert(_this.damageType, _this.damage * damageCoefficient_1[_this.damageType], false, type == 'blue' ? 'red' : 'blue');
                    }
                    ;
                    // 아이템 감지
                    players[getEnemyTeam()].items.forEach(function (e) {
                        var _a, _b;
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_molwang' && !((_a = _this.onhit) === null || _a === void 0 ? void 0 : _a.includes('skill'))) {
                            players[team].hp[1] -= players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient_1.melee;
                            totalDamage.melee += players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient_1.melee;
                            socket.send(JSON.stringify({
                                body: {
                                    msg: 'damageAlert',
                                    info: [
                                        "melee",
                                        players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient_1.melee,
                                        false,
                                        type == 'blue' ? 'red' : 'blue'
                                    ]
                                }
                            }));
                            damageAlert("melee", players[team].hp[1] * (e.extra[0] / 100) * damageCoefficient_1.melee, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_nashor' && !((_b = _this.onhit) === null || _b === void 0 ? void 0 : _b.includes('skill'))) {
                            players[team].hp[1] -= e.extra[0] * damageCoefficient_1.magic;
                            totalDamage.magic += e.extra[0] * damageCoefficient_1.magic;
                            socket.send(JSON.stringify({
                                body: {
                                    msg: 'damageAlert',
                                    info: [
                                        "magic",
                                        e.extra[0] * damageCoefficient_1.magic,
                                        false,
                                        type == 'blue' ? 'red' : 'blue'
                                    ]
                                }
                            }));
                            damageAlert("magic", e.extra[0] * damageCoefficient_1.magic, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_rapid_firecannon') {
                            var alphaDamage = playerDistance / 500;
                            if (alphaDamage > 1.5)
                                alphaDamage = 1.5;
                            players[team].hp[1] -= _this.damage * alphaDamage * damageCoefficient_1.melee;
                            totalDamage.melee += _this.damage * alphaDamage * damageCoefficient_1.melee;
                            socket.send(JSON.stringify({
                                body: {
                                    msg: 'damageAlert',
                                    info: [
                                        "melee",
                                        _this.damage * playerDistance / 3000 * damageCoefficient_1.melee,
                                        false,
                                        type == 'blue' ? 'red' : 'blue'
                                    ]
                                }
                            }));
                            damageAlert("melee", e.extra[0] * _this.damage * playerDistance / 3000 * damageCoefficient_1.melee, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_collector') {
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
                                damageAlert("melee", e.extra[0] * _this.damage * playerDistance / 3000 * damageCoefficient_1.melee, false, type == 'blue' ? 'red' : 'blue');
                            }
                        }
                    });
                    if (((_a = players[team].marker) === null || _a === void 0 ? void 0 : _a.ezreal) == true) {
                        absolutePosition[team].x += 3;
                        absolutePosition[team].y -= 3;
                        players[team].hp[1] -= (players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage) * damageCoefficient_1.magic;
                        players[team].marker.ezreal = false;
                        totalDamage.magic += (players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage) * damageCoefficient_1.magic;
                        damageAlert("magic", (players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage) * damageCoefficient_1.magic, false, type == 'blue' ? 'red' : 'blue');
                        socket.send(JSON.stringify({
                            body: {
                                msg: 'damageAlert',
                                info: [
                                    "magic",
                                    (players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                                        players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                                        enemySkillInfo.passive.damage) * damageCoefficient_1.magic,
                                    false,
                                    type == 'blue' ? 'red' : 'blue'
                                ]
                            }
                        }));
                    }
                    // 캐릭터별 온힛 효과
                    if ((_b = _this.onhit) === null || _b === void 0 ? void 0 : _b.includes("ezreal")) {
                        absolutePosition[team].x -= 3;
                        absolutePosition[team].y += 3;
                        players[team].marker.ezreal = true;
                    }
                    else if ((_c = _this.onhit) === null || _c === void 0 ? void 0 : _c.includes("samira")) {
                        socket.send(JSON.stringify({
                            body: {
                                msg: "samiraOnhit", damageType: (_d = _this.onhit) === null || _d === void 0 ? void 0 : _d.split(' ')[_this.onhit.split(' ').length - 1]
                            }
                        }));
                        if ((_e = _this.onhit) === null || _e === void 0 ? void 0 : _e.includes(" e")) {
                            canMove = false;
                            setTimeout(function () {
                                canMove = true;
                            }, enemySkillInfo.e.duration * 10);
                        }
                        if (_this.damage > 0)
                            onhitCount[type] += 1;
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "skill" } }));
                    }
                    else if (char[getEnemyTeam()] == 'vayne') {
                        if (players[team].marker.vayne === undefined)
                            players[team].marker.vayne = 0;
                        players[team].marker.vayne += 1;
                        console.log(players[team].marker.vayne);
                        if (players[team].marker.vayne == 3) {
                            players[team].marker.vayne = 0;
                            players[team].hp[1] -= players[team].hp[0] * enemySkillInfo.passive.damage / 100;
                            socket.send(JSON.stringify({
                                body: {
                                    msg: 'damageAlert',
                                    info: [
                                        "true",
                                        players[team].hp[0] * enemySkillInfo.passive.damage / 100,
                                        false,
                                        type == 'blue' ? 'red' : 'blue'
                                    ]
                                }
                            }));
                            damageAlert("true", players[team].hp[0] * enemySkillInfo.passive.damage / 100, false, type == 'blue' ? 'red' : 'blue');
                        }
                        if ((_f = _this.onhit) === null || _f === void 0 ? void 0 : _f.includes('bondage')) {
                            console.log('묶는다');
                            canMove = false;
                            setTimeout(function () {
                                canMove = true;
                            }, enemySkillInfo.shift.duration * 10);
                        }
                    }
                    if ((_g = _this.onhit) === null || _g === void 0 ? void 0 : _g.includes('skill')) {
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "skill" } }));
                        console.log("ㄴ");
                    }
                    else {
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "aa" } }));
                        console.log("ㅇ");
                    }
                }
                var nexusIndex = { blue: [7, 8], red: [9, 10] };
                if (_this.isCollideWithNexus(gameObjects[nexusIndex[team][1]].objSelector, _bullet) && gameObjects[nexusIndex[team][0]].isCollide(players[getEnemyTeam()].selector) && !_this.isCollide) {
                    if (nexusHp[team][1] <= 0)
                        return;
                    nexusHp[team][1] -= _this.damage;
                    _this.isCollide = true;
                    socket.send(JSON.stringify({ body: { msg: 'onhit', target: 'nexus' } }));
                }
            }
            else {
                if (_this.isCollideWithPlayer(_bullet, getEnemyTeam()) && !_this.isCollide) {
                    var damageCoefficient = 0;
                    if (_this.damageType == 'melee')
                        damageCoefficient = (1 / (1 + (players[getEnemyTeam()].spec.armor - players[team].spec.ignoreArmor) * 0.01));
                    if (_this.damageType == 'magic')
                        damageCoefficient = (1 / (1 + players[getEnemyTeam()].spec.magicRegist * 0.01));
                    if (_this.damageType == 'true')
                        damageCoefficient = 1;
                    if (isCritical) {
                        var criticalDamage = _this.damage * (1.75 + _this.critical[1] / 100);
                        damageAlert(_this.damageType, damageCoefficient * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    }
                    else {
                        damageAlert(_this.damageType, _this.damage * damageCoefficient, isCritical, type == 'blue' ? 'red' : 'blue');
                    }
                    ;
                    if (_this.damage > 0)
                        onhitCount[type] += 1;
                    if (!_this.canPass)
                        _this.isArrive = false;
                    if (char[team] == 'ezreal' && ((_h = _this.onhit) === null || _h === void 0 ? void 0 : _h.includes('skill'))) {
                        _this.isCollide = true;
                        charClass.cooldown.q -= skillInfo.passive.skillHaste;
                        charClass.cooldown.e -= skillInfo.passive.skillHaste;
                        charClass.cooldown.shift -= skillInfo.passive.skillHaste;
                        charClass.cooldown.wheel -= skillInfo.passive.skillHaste;
                    }
                }
            }
            // 화면 밖으로 나가면 탄환 제거
            gameObjects.forEach(function (e) {
                if (_this.ignoreObj)
                    return false;
                if (e.isCollide(_bullet) && e.extra.canCollide && _this.isArrive) {
                    _this.isArrive = false;
                }
            });
            if (_this._movedDistance >= _this.reach * 1.5 && _this.isArrive) {
                _this.isArrive = false;
            }
            if (!_this.isArrive) {
                clearInterval(update);
                _main.removeChild(_bullet);
            }
        }, 16);
    };
    Projectile.prototype.isCollideWithPlayer = function (projectileSelector, team) {
        var r1 = players[team].selector.offsetWidth / 2;
        var r2 = projectileSelector.offsetWidth / 2;
        var x1 = players[team].selector.offsetLeft + r1;
        var y1 = players[team].selector.offsetTop + r1;
        var x2 = projectileSelector.offsetLeft + r2;
        var y2 = projectileSelector.offsetTop + r2;
        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        return distance <= (r1 + r2);
    };
    Projectile.prototype.isCollideWithPlayer2 = function (projectileSelector, team) {
        var rect1 = players[team].selector.getBoundingClientRect();
        var rect2 = projectileSelector.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };
    Projectile.prototype.isCollideWithNexus = function (victim, projectileSelector) {
        var _a;
        if ((_a = this.onhit) === null || _a === void 0 ? void 0 : _a.includes('skill'))
            return false;
        var r1 = projectileSelector.offsetWidth / 2;
        var r2 = victim.offsetWidth / 2;
        var x1 = projectileSelector.offsetLeft + r1;
        var y1 = projectileSelector.offsetTop + r1;
        var x2 = victim.offsetLeft + r2;
        var y2 = victim.offsetTop + r2;
        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        return distance <= (r1 + r2);
    };
    return Projectile;
}());
var ProjectileBuilder = /** @class */ (function () {
    function ProjectileBuilder() {
        this.projectile = new Projectile();
    }
    ProjectileBuilder.prototype.setDegree = function (degree) {
        this.projectile.angle = degree;
        return this;
    };
    ProjectileBuilder.prototype.setDamage = function (damage, type, random) {
        this.projectile.damage = damage;
        this.projectile.damageType = type;
        return this;
    };
    ProjectileBuilder.prototype.setSpeed = function (spd) {
        this.projectile.speed = spd;
        return this;
    };
    ProjectileBuilder.prototype.setPos = function (x, y) {
        this.projectile.absPos.x = x;
        this.projectile.absPos.y = y;
        return this;
    };
    ProjectileBuilder.prototype.setReach = function (time) {
        this.projectile.reach = time;
        return this;
    };
    ProjectileBuilder.prototype.setCritical = function (chance, damage) {
        this.projectile.critical = [chance, damage];
        return this;
    };
    ProjectileBuilder.prototype.setSize = function (size) {
        this.projectile.size = size;
        return this;
    };
    ProjectileBuilder.prototype.setStyle = function (color) {
        this.projectile.style.color = color;
        return this;
    };
    ProjectileBuilder.prototype.onHit = function (msg) {
        this.projectile.onhit = msg;
        return this;
    };
    ProjectileBuilder.prototype.ignoreObj = function (boolean) {
        if (boolean === void 0) { boolean = true; }
        this.projectile.ignoreObj = boolean;
        return this;
    };
    ProjectileBuilder.prototype.setTarget = function (boolean, tarTeam) {
        if (boolean === void 0) { boolean = true; }
        if (tarTeam === void 0) { tarTeam = team; }
        this.projectile.targetEnemy = [boolean, tarTeam];
        return this;
    };
    ProjectileBuilder.prototype.canPass = function (boolean) {
        if (boolean === void 0) { boolean = true; }
        this.projectile.canPass = boolean;
        return this;
    };
    ProjectileBuilder.prototype.build = function (type) {
        this.projectile.start(type);
        return this.projectile;
    };
    return ProjectileBuilder;
}());
