var NonProjectile = /** @class */ (function () {
    function NonProjectile() {
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
    NonProjectile.prototype.start = function (type) {
        var _this = this;
        var _main = document.querySelector('.projectiles');
        var _bullet = document.createElement('div');
        _bullet.className = "".concat(type, " sword");
        _bullet.style.width = "".concat(this.size.width, "px");
        _bullet.style.height = "".concat(this.size.height, "px");
        _bullet.style.rotate = "".concat(-this.angle + Math.PI / 2 - 0.9, "rad");
        _bullet.style.marginTop = "".concat(players[team].specINIT.projectileSize[0] / 2, "px");
        var offsetX = players[team].size / 2 - this.size.width / 2;
        var offsetY = -players[type].size / 2 + this.size.height / 2 - 2;
        // let offsetY = -30;
        // let offsetX = 30;
        if (type === team) {
            _bullet.style.left = "".concat(absolutePosition[team].x - cameraPosition.x + offsetX, "px");
            _bullet.style.top = "".concat(-absolutePosition[team].y - cameraPosition.y - offsetY, "px");
            this.absPos.x = absolutePosition[team].x + offsetX;
            this.absPos.y = absolutePosition[team].y - offsetY;
        }
        else {
            _bullet.style.left = "".concat(absolutePosition[getEnemyTeam()].x - cameraPosition.x + offsetX, "px");
            _bullet.style.top = "".concat(-absolutePosition[getEnemyTeam()].y - cameraPosition.y - offsetY, "px");
            this.absPos.x = absolutePosition[getEnemyTeam()].x + offsetX;
            this.absPos.y = absolutePosition[getEnemyTeam()].y - offsetY;
        }
        if (this.damage == 0) {
            _bullet.style.opacity = "20%";
            _bullet.style.backgroundColor = "black";
        }
        if (this.style.color !== undefined)
            _bullet.style.backgroundColor = "".concat(this.style.color);
        _main.appendChild(_bullet);
        var index = 0.9;
        var update = setInterval(function () {
            var _a;
            // clearInterval(update);
            _this._movedDistance += _this.speed;
            var totalDamage = { melee: 0, magic: 0 };
            _bullet.style.rotate = "".concat(-_this.angle + Math.PI / 2 - index, "rad");
            index -= 0.1;
            _this.absPos.x = absolutePosition[type].x + offsetX;
            _this.absPos.y = absolutePosition[type].y - offsetY;
            _bullet.style.left = "".concat(_this.absPos.x - cameraPosition.x, "px");
            _bullet.style.top = "".concat(-_this.absPos.y - cameraPosition.y - offsetY * 2, "px");
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
                    if ((_a = _this.onhit) === null || _a === void 0 ? void 0 : _a.includes('skill')) {
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "skill" } }));
                    }
                    else {
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "aa" } }));
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
            if (index < -0.9) {
                clearInterval(update);
                _this.isArrive = false;
            }
            if (!_this.isArrive) {
                clearInterval(update);
                _main.removeChild(_bullet);
            }
        }, 16);
    };
    NonProjectile.prototype.isCollideWithPlayer = function (projectileSelector, team) {
        var r1 = players[team].selector.offsetWidth / 2;
        var r2 = projectileSelector.offsetWidth / 2;
        var x1 = players[team].selector.offsetLeft + r1;
        var y1 = players[team].selector.offsetTop + r1;
        var x2 = projectileSelector.offsetLeft + r2;
        var y2 = projectileSelector.offsetTop + r2;
        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        return distance <= (r1 + r2);
    };
    NonProjectile.prototype.isCollideWithPlayer2 = function (projectileSelector, team) {
        var rect1 = players[team].selector.getBoundingClientRect();
        var rect2 = projectileSelector.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };
    NonProjectile.prototype.isCollideWithNexus = function (victim, projectileSelector) {
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
    return NonProjectile;
}());
var NonProjectileBuilder = /** @class */ (function () {
    function NonProjectileBuilder() {
        this.projectile = new NonProjectile();
    }
    NonProjectileBuilder.prototype.setDegree = function (degree) {
        this.projectile.angle = degree;
        return this;
    };
    NonProjectileBuilder.prototype.setDamage = function (damage, type, random) {
        this.projectile.damage = damage;
        this.projectile.damageType = type;
        return this;
    };
    NonProjectileBuilder.prototype.setSpeed = function (spd) {
        this.projectile.speed = spd;
        return this;
    };
    NonProjectileBuilder.prototype.setPos = function (x, y) {
        this.projectile.absPos.x = x;
        this.projectile.absPos.y = y;
        return this;
    };
    NonProjectileBuilder.prototype.setReach = function (time) {
        this.projectile.reach = time;
        return this;
    };
    NonProjectileBuilder.prototype.setCritical = function (chance, damage) {
        this.projectile.critical = [chance, damage];
        return this;
    };
    NonProjectileBuilder.prototype.setSize = function (size) {
        this.projectile.size = size;
        return this;
    };
    NonProjectileBuilder.prototype.setStyle = function (color) {
        this.projectile.style.color = color;
        return this;
    };
    NonProjectileBuilder.prototype.onHit = function (msg) {
        this.projectile.onhit = msg;
        return this;
    };
    NonProjectileBuilder.prototype.ignoreObj = function (boolean) {
        if (boolean === void 0) { boolean = true; }
        this.projectile.ignoreObj = boolean;
        return this;
    };
    NonProjectileBuilder.prototype.setTarget = function (boolean, tarTeam) {
        if (boolean === void 0) { boolean = true; }
        if (tarTeam === void 0) { tarTeam = team; }
        this.projectile.targetEnemy = [boolean, tarTeam];
        return this;
    };
    NonProjectileBuilder.prototype.canPass = function (boolean) {
        if (boolean === void 0) { boolean = true; }
        this.projectile.canPass = boolean;
        return this;
    };
    NonProjectileBuilder.prototype.build = function (type) {
        this.projectile.start(type);
        return this.projectile;
    };
    return NonProjectileBuilder;
}());
