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
            color: undefined,
            opacity: undefined,
        };
        this.ignoreObj = false;
        this.onhit = undefined;
        this.targetEnemy = [false, team];
        this.canPass = false;
        this.offset = { x: 0, y: 0 };
    }
    Projectile.prototype.start = function (type) {
        var _this = this;
        var _main = document.querySelector('.projectiles');
        var _bullet = document.createElement('div');
        var talonEBack = false;
        _bullet.className = "".concat(type, " bullet");
        _bullet.style.width = "".concat(this.size.width, "px");
        _bullet.style.height = "".concat(this.size.height, "px");
        _bullet.style.rotate = "".concat(-this.angle + Math.PI / 2, "rad");
        var offsetX = players[team].size / 2 - this.size.width / 2;
        // let offsetY = players[team].size / 2 - this.size.height / 1.5
        // let offsetX = 4;
        var offsetY = -players[type].size / 2 + this.size.height / 2;
        if (type === team) {
            _bullet.style.left = "".concat(absolutePosition[team].x - cameraPosition.x + offsetX, "px");
            _bullet.style.top = "".concat(-absolutePosition[team].y - cameraPosition.y - offsetY, "px");
            // this.absPos.x = absolutePosition[team].x + offsetX;
            // this.absPos.y = absolutePosition[team].y - offsetY;
            this.absPos.x = absolutePosition[team].x + offsetX + this.offset.x;
            this.absPos.y = absolutePosition[team].y - offsetY + this.offset.y;
        }
        else {
            _bullet.style.left = "".concat(absolutePosition[getEnemyTeam()].x - cameraPosition.x + offsetX, "px");
            _bullet.style.top = "".concat(-absolutePosition[getEnemyTeam()].y - cameraPosition.y - offsetY, "px");
            // this.absPos.x = absolutePosition[getEnemyTeam()].x + offsetX - this.absPos.x;
            // this.absPos.y = absolutePosition[getEnemyTeam()].y - offsetY + this.absPos.y;
            this.absPos.x = absolutePosition[getEnemyTeam()].x + offsetX + this.offset.x;
            this.absPos.y = absolutePosition[getEnemyTeam()].y - offsetY + this.offset.y;
        }
        if (this.damage == 0) {
            _bullet.style.opacity = "20%";
            _bullet.style.backgroundColor = "black";
        }
        if (this.style.color !== undefined)
            _bullet.style.backgroundColor = "".concat(this.style.color);
        if (this.style.opacity !== undefined)
            _bullet.style.opacity = "".concat(this.style.opacity, "%");
        _main.appendChild(_bullet);
        var update = setInterval(function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
            // clearInterval(update);
            _this._movedDistance += _this.speed;
            var enemyTar = _this.targetEnemy[1] == 'blue' ? 'red' : 'blue';
            var totalDamage = { melee: 0, magic: 0, true: 0 };
            if (_this.targetEnemy[0]) {
                if (deathCoolDown[_this.targetEnemy[1] === 'blue' ? 'red' : 'blue'] > 0)
                    _this.isArrive = false;
                _this.angle = Math.atan2(absolutePosition[enemyTar].y - _this.absPos.y - offsetY, absolutePosition[enemyTar].x - _this.absPos.x + offsetX);
                _this.absPos.x += _this.speed * Math.cos(_this.angle);
                _this.absPos.y += _this.speed * Math.sin(_this.angle);
            }
            else {
                _this.absPos.x += -_this.speed * Math.cos(_this.angle);
                _this.absPos.y += -_this.speed * Math.sin(_this.angle);
            }
            if ((_a = _this.onhit) === null || _a === void 0 ? void 0 : _a.includes("ahri skill q1")) {
                _this.speed -= 0.3;
            }
            else if ((_b = _this.onhit) === null || _b === void 0 ? void 0 : _b.includes("ahri skill q2")) {
                _this.speed += 0.3;
            }
            _bullet.style.left = "".concat(_this.absPos.x - cameraPosition.x + offsetX, "px");
            _bullet.style.top = "".concat(-_this.absPos.y - cameraPosition.y - 2 * offsetY, "px");
            // on-hit
            var isCritical = Math.random() <= _this.critical[0] / 100;
            var hasShadowflame = false;
            if (type === getEnemyTeam() && _this.damage > 0) {
                if (_this.isCollideWithPlayer2(_bullet, getEnemyTeam())) {
                    // 부메랑 회수 - 상대 화면
                    if ((_c = _this.onhit) === null || _c === void 0 ? void 0 : _c.includes('ahri skill q2')) {
                        _this.isArrive = false;
                    }
                    else if ((_d = _this.onhit) === null || _d === void 0 ? void 0 : _d.includes('talon skill e2')) {
                        _this.isArrive = false;
                    }
                    else if (((_e = _this.onhit) === null || _e === void 0 ? void 0 : _e.includes("talon skill wheel2")) && _this.targetEnemy[1] === team) {
                        _this.isArrive = false;
                    }
                }
                if (_this.isCollideWithPlayer2(_bullet, team) && !_this.isCollide) {
                    var damageCoefficient = {
                        melee: (1 / (1 + (players[team].spec.armor * (1 - players[getEnemyTeam()].spec.ignoreArmorPercent / 100) - players[getEnemyTeam()].spec.ignoreArmor) * 0.01)),
                        magic: (1 / (1 + players[team].spec.magicRegist * 0.01)),
                        true: 1
                    };
                    var criticalDamage = _this.damage * (1.75 + _this.critical[1] / 100);
                    _this.isCollide = true;
                    if (!_this.canPass)
                        _this.isArrive = false;
                    if (skillHit.vampire == true)
                        return;
                    if (skillHit.ashe == true)
                        return;
                    if (skillHit.talonE == true)
                        return;
                    if (players[team].marker.zhonya) {
                        _this.canPass = true;
                        return;
                    }
                    ;
                    // 크리티컬 데미지
                    if (isCritical) {
                        totalDamage[_this.damageType] += criticalDamage;
                    }
                    else {
                        totalDamage[_this.damageType] += _this.damage;
                    }
                    ;
                    // 아이템 감지  
                    players[getEnemyTeam()].items.forEach(function (e) {
                        var _a, _b, _c;
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_molwang' && !((_a = _this.onhit) === null || _a === void 0 ? void 0 : _a.includes('skill'))) {
                            totalDamage.melee += players[team].hp[1] * (e.extra[0] / 100);
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_nashor' && !((_b = _this.onhit) === null || _b === void 0 ? void 0 : _b.includes('skill'))) {
                            totalDamage.magic += e.extra[0];
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_rapid_firecannon') {
                            var alphaDamage = playerDistance / findItem('3_rapid_firecannon').body.extra[1] / 2; // 1000에서 1.2가 나오도록
                            // console.log(alphaDamage, playerDistance);
                            if (alphaDamage > findItem('3_rapid_firecannon').body.extra[0])
                                alphaDamage = findItem('3_rapid_firecannon').body.extra[0];
                            totalDamage.melee += _this.damage * alphaDamage;
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_collector') {
                            if (players[team].hp[1] / players[team].hp[0] <= findItem('3_collector').body.extra[0] / 100) {
                                totalDamage.true += 9999;
                            }
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) == '3_shadowflame' && isCritical) {
                            hasShadowflame = true;
                        }
                        if ((e === null || e === void 0 ? void 0 : e.name[1]) === '3_liandry' && ((_c = _this.onhit) === null || _c === void 0 ? void 0 : _c.includes('skill')) && _this.damageType === 'magic') {
                            cooldownItem.liandry.duration = findItem('3_liandry').body.extra[1];
                        }
                    });
                    // 플레이어가 가지고 있는 아이템에 따라..
                    if (hasItem('3_shieldbow') && cooldownItem.shieldbow == 0 && players[team].hp[1] / players[team].hp[0] <= 0.35 && players[team].hp[1] > 0) {
                        var shieldbow = findItem('3_shieldbow').body;
                        players[team].barrier.push([players[team].hp[0] * (shieldbow.extra[0] / 100) + shieldbow.extra[2], shieldbow.extra[3] * 100]);
                        cooldownItem.shieldbow = findItem("3_shieldbow").body.extra[1];
                    }
                    if (((_f = players[team].marker) === null || _f === void 0 ? void 0 : _f.ezreal) == true) {
                        absolutePosition[team].x += 3;
                        absolutePosition[team].y -= 3;
                        players[team].marker.ezreal = false;
                        totalDamage.magic += (players[getEnemyTeam()].spec.ap * enemySkillInfo.passive.ap +
                            players[getEnemyTeam()].spec.ad * enemySkillInfo.passive.ad +
                            enemySkillInfo.passive.damage);
                    }
                    // 챔피언별 온힛 효과
                    if (((_g = _this.onhit) === null || _g === void 0 ? void 0 : _g.includes("ezreal")) && ((_h = _this.onhit) === null || _h === void 0 ? void 0 : _h.includes(" e"))) {
                        absolutePosition[team].x -= 3;
                        absolutePosition[team].y += 3;
                        players[team].marker.ezreal = true;
                    }
                    else if ((_j = _this.onhit) === null || _j === void 0 ? void 0 : _j.includes("samira")) {
                        socket.send(JSON.stringify({
                            body: {
                                msg: "samiraOnhit", damageType: (_k = _this.onhit) === null || _k === void 0 ? void 0 : _k.split(' ')[_this.onhit.split(' ').length - 1]
                            }
                        }));
                        if ((_l = _this.onhit) === null || _l === void 0 ? void 0 : _l.includes(" e")) {
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
                        if (players[team].marker.vayne == 3) {
                            players[team].marker.vayne = 0;
                            totalDamage.true += players[team].hp[0] * (enemySkillInfo.passive.damage + enemySkillInfo.passive.ap * players[getEnemyTeam()].spec.ap) / 100;
                        }
                        if ((_m = _this.onhit) === null || _m === void 0 ? void 0 : _m.includes('bondage')) {
                            canMove = false;
                            setTimeout(function () {
                                canMove = true;
                            }, enemySkillInfo.shift.duration * 10);
                        }
                    }
                    else if ((_o = _this.onhit) === null || _o === void 0 ? void 0 : _o.includes('vampire skill e')) {
                        skillHit.vampire = true;
                        setTimeout(function () {
                            skillHit.vampire = false;
                        }, 100);
                    }
                    else if ((_p = _this.onhit) === null || _p === void 0 ? void 0 : _p.includes('aphelios')) {
                        if (players[team].marker.aphelios.Calibrum && _this.onhit.includes('aa') && _this.onhit.includes('Cali-true')) {
                            players[team].marker.aphelios.Calibrum = false;
                            players[team].marker.aphelios.CalibrumWheel = false;
                            //@ts-ignore
                            totalDamage.melee += (4 + 0.3 * players[getEnemyTeam()].spec.ad);
                            //@ts-ignore
                            // players[team].hp[1] -= (4 + 0.3 * players[getEnemyTeam()].spec.ad) * damageCoefficient.melee;
                        }
                        // if (players[team].marker.aphelios === undefined) players[team].marker.aphelios = {Calibrum: false, Gravitum: false};
                        if ((_q = _this.onhit) === null || _q === void 0 ? void 0 : _q.includes('sub-Calibrum')) {
                            players[team].marker.aphelios.Calibrum = true;
                            if ((_r = _this.onhit) === null || _r === void 0 ? void 0 : _r.includes('wheel')) {
                                players[team].marker.aphelios.CalibrumWheel = true;
                            }
                        }
                        else if ((_s = _this.onhit) === null || _s === void 0 ? void 0 : _s.includes('ravitum')) {
                            players[team].marker.aphelios.Gravitum = true;
                            slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.25;
                            slowTime = 400;
                            if (_this.onhit.includes('wheel')) {
                                slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.7;
                                setTimeout(function () {
                                    slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.25;
                                }, 150);
                            }
                        }
                        else if ((_t = _this.onhit) === null || _t === void 0 ? void 0 : _t.includes('sub-Crescendum')) {
                            socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                            if ((_u = _this.onhit) === null || _u === void 0 ? void 0 : _u.includes('wheel')) {
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                                socket.send(JSON.stringify({ body: { msg: "aphlios-crescendum" } }));
                            }
                        }
                    }
                    else if ((_v = _this.onhit) === null || _v === void 0 ? void 0 : _v.includes('ashe')) {
                        players[team].marker.ashe = 1;
                        slowness = (players[team].specINIT.moveSpd + players[team].specItem.moveSpd) * 0.2;
                        slowTime = 250;
                        if ((_w = _this.onhit) === null || _w === void 0 ? void 0 : _w.includes('ashe skill e')) {
                            skillHit.ashe = true;
                            setTimeout(function () {
                                skillHit.ashe = false;
                            }, 100);
                        }
                        else if ((_x = _this.onhit) === null || _x === void 0 ? void 0 : _x.includes('ashe skill wheel')) {
                            canMove = false;
                            charClass.cooldown.q += enemySkillInfo.wheel.duration;
                            charClass.cooldown.e += enemySkillInfo.wheel.duration;
                            charClass.cooldown.shift += enemySkillInfo.wheel.duration;
                            charClass.cooldown.wheel += enemySkillInfo.wheel.duration;
                            atkWait += enemySkillInfo.wheel.duration;
                            setTimeout(function () {
                                canMove = true;
                            }, enemySkillInfo.wheel.duration * 10);
                        }
                    }
                    else if ((_y = _this.onhit) === null || _y === void 0 ? void 0 : _y.includes('kaisa')) {
                        if ((_z = _this.onhit) === null || _z === void 0 ? void 0 : _z.includes('aa')) {
                            players[team].marker.kaisa += 1;
                        }
                        else if ((_0 = _this.onhit) === null || _0 === void 0 ? void 0 : _0.includes('skill e')) {
                            players[team].marker.kaisa += 2;
                        }
                    }
                    else if ((_1 = _this.onhit) === null || _1 === void 0 ? void 0 : _1.includes('ahri')) {
                        if ((_2 = _this.onhit) === null || _2 === void 0 ? void 0 : _2.includes('shift')) {
                            canMove = false;
                            charClass.cooldown.q += enemySkillInfo.shift.duration;
                            charClass.cooldown.e += enemySkillInfo.shift.duration;
                            charClass.cooldown.shift += enemySkillInfo.shift.duration;
                            charClass.cooldown.wheel += enemySkillInfo.shift.duration;
                            atkWait += enemySkillInfo.shift.duration;
                            setTimeout(function () {
                                canMove = true;
                            }, enemySkillInfo.shift.duration * 10);
                        }
                    }
                    else if ((_3 = _this.onhit) === null || _3 === void 0 ? void 0 : _3.includes('talon skill')) {
                        if (players[team].marker.talon.cooldown === 0) {
                            players[team].marker.talon.stack += 1;
                        }
                        if ((_4 = _this.onhit) === null || _4 === void 0 ? void 0 : _4.includes('talon skill e')) {
                            skillHit.talonE = true;
                            setTimeout(function () {
                                skillHit.talonE = false;
                            }, 50);
                        }
                    }
                    if (hasShadowflame && isCritical) {
                        // players[team].hp[1] -= this.damage * criticalDamage * damageCoefficient.magic;
                        totalDamage.magic *= (1 + _this.critical[1] / 100);
                    }
                    var totalDamageSum = totalDamage.magic * damageCoefficient.magic + totalDamage.melee * damageCoefficient.melee + totalDamage.true;
                    if ((_5 = _this.onhit) === null || _5 === void 0 ? void 0 : _5.includes('skill')) {
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "skill", tags: _this.onhit, damage: totalDamageSum } }));
                    }
                    else {
                        socket.send(JSON.stringify({ body: { msg: "onhit", target: 'enemy', type: "aa", tags: _this.onhit, damage: totalDamageSum } }));
                        // console.log(totalDamageSum);
                    }
                    var isRange = ((_6 = _this.onhit) === null || _6 === void 0 ? void 0 : _6.includes('range')) ? 1 : 0;
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
                                totalDamage.true,
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
                var nexusIndex = { blue: [7, 8], red: [9, 10] };
                if (_this.isCollideWithNexus(gameObjects[nexusIndex[team][1]].objSelector, _bullet) && gameObjects[nexusIndex[team][0]].isCollide(players[getEnemyTeam()].selector) && !_this.isCollide) {
                    if (nexusHp[team][1] <= 0)
                        return;
                    nexusHp[team][1] -= (1 / (1 + 50 * 0.01)) * _this.damage;
                    nexusHp[team][1] -= players[getEnemyTeam()].spec.ap * 0.7 * (1 / (1 + 30 * 0.01));
                    _this.isCollide = true;
                    socket.send(JSON.stringify({ body: { msg: 'onhit', target: 'nexus' } }));
                }
            }
            else {
                if (_this.isCollideWithPlayer(_bullet, type) && !_this.isCollide) {
                    // 부메랑 회부 - 자기 화면
                    if ((_7 = _this.onhit) === null || _7 === void 0 ? void 0 : _7.includes('ahri skill q2')) {
                        _this.isArrive = false;
                    }
                    else if ((_8 = _this.onhit) === null || _8 === void 0 ? void 0 : _8.includes('talon skill e2')) {
                        _this.isArrive = false;
                    }
                    else if (((_9 = _this.onhit) === null || _9 === void 0 ? void 0 : _9.includes("talon skill wheel2")) && _this.targetEnemy[1] === getEnemyTeam()) {
                        _this.isArrive = false;
                    }
                }
                else if (_this.isCollideWithPlayer(_bullet, getEnemyTeam()) && !_this.isCollide) {
                    var damageCoefficient = 0;
                    if (_this.damageType == 'melee')
                        damageCoefficient = (1 / (1 + (players[getEnemyTeam()].spec.armor * (1 - players[team].spec.ignoreArmorPercent / 100) - players[team].spec.ignoreArmor) * 0.01));
                    if (_this.damageType == 'magic')
                        damageCoefficient = (1 / (1 + players[getEnemyTeam()].spec.magicRegist * 0.01));
                    if (_this.damageType == 'true')
                        damageCoefficient = 1;
                    if (isCritical) {
                        var criticalDamage = _this.damage * (1.75 + _this.critical[1] / 100);
                        // damageAlert(this.damageType, damageCoefficient * criticalDamage, true, type == 'blue' ? 'red' : 'blue');
                    }
                    else {
                        // damageAlert(this.damageType, this.damage * damageCoefficient, isCritical, type == 'blue' ? 'red' : 'blue');
                    }
                    ;
                    if (_this.damage > 0)
                        onhitCount[type] += 1;
                    if (!_this.canPass)
                        _this.isArrive = false;
                    if (char[team] == 'ezreal' && ((_10 = _this.onhit) === null || _10 === void 0 ? void 0 : _10.includes('skill'))) {
                        _this.isCollide = true;
                        charClass.cooldown.q -= skillInfo.passive.skillHaste;
                        charClass.cooldown.e -= skillInfo.passive.skillHaste;
                        charClass.cooldown.shift -= skillInfo.passive.skillHaste;
                        charClass.cooldown.wheel -= skillInfo.passive.skillHaste;
                    }
                    if (char[team] == 'sniper' && charClass.isActive.q)
                        charClass.isActive.q = false;
                    if (char[team] === 'aphelios' && _this.onhit.includes('wheel')) {
                        if (apheliosWeapon[0] === 'Severum') {
                            var heal = players[team].hp[0] * 0.2 + players[team].spec.ad * 0.3;
                            players[team].hp[1] += heal;
                            damageAlert("heal", heal, false, team);
                        }
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
                if (((_11 = _this.onhit) === null || _11 === void 0 ? void 0 : _11.includes("ahri skill q1")) && type === team) {
                    projectiles[type].push(new ProjectileBuilder()
                        .setDamage(skillInfo.q.damage + players[team].spec.ap * skillInfo.q.ap, "true")
                        .projOffset({ x: _this.absPos.x - absolutePosition[team].x, y: _this.absPos.y - absolutePosition[team].y })
                        .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                        .setDegree(0)
                        .setReach(5000)
                        .setSpeed(0)
                        .setTarget(true, type === 'blue' ? 'red' : 'blue')
                        .setSize({ height: 40, width: 40 })
                        .setStyle('rgb(145, 176, 202)')
                        .onHit("ahri skill q2")
                        .canPass(true)
                        .ignoreObj(true)
                        .build(team));
                }
                if (((_12 = _this.onhit) === null || _12 === void 0 ? void 0 : _12.includes("talon skill e1")) || ((_13 = _this.onhit) === null || _13 === void 0 ? void 0 : _13.includes("talon skill wheel"))) {
                    _this.speed = 0;
                    _this.damage = 0;
                    if (!talonEBack) {
                        if ((_14 = _this.onhit) === null || _14 === void 0 ? void 0 : _14.includes("e1")) {
                            talonEBack = true;
                            setTimeout(function () {
                                _this.isArrive = false;
                                skillHit.talonE = false;
                                if (team === type) {
                                    projectiles[type].push(new ProjectileBuilder()
                                        //@ts-ignore
                                        .setDamage(skillInfo.e.damages[1].damage + players[team].spec.ad * skillInfo.e.damages[1].ad, "melee")
                                        .projOffset({ x: _this.absPos.x - absolutePosition[team].x, y: _this.absPos.y - absolutePosition[team].y })
                                        .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                                        .setDegree(0)
                                        .setReach(5000)
                                        .setSpeed(20)
                                        .setTarget(true, type === 'blue' ? 'red' : 'blue')
                                        .setSize({ height: 50, width: 50 })
                                        .setStyle('rgb(110, 114, 124)')
                                        .onHit("talon skill e2")
                                        .canPass(true)
                                        .ignoreObj(true)
                                        .build(team));
                                }
                            }, 700);
                        }
                        else if ((_15 = _this.onhit) === null || _15 === void 0 ? void 0 : _15.includes('wheel')) {
                            talonEBack = true;
                            setTimeout(function () {
                                _this.isArrive = false;
                                if (team === type) {
                                    projectiles[type].push(new ProjectileBuilder()
                                        //@ts-ignore
                                        .setDamage(skillInfo.wheel.damages[1].damage + players[team].spec.ad * skillInfo.wheel.damages[1].ad, "melee")
                                        .projOffset({ x: _this.absPos.x - absolutePosition[team].x, y: _this.absPos.y - absolutePosition[team].y })
                                        .setCritical(players[team].spec.criticP, players[team].spec.criticD)
                                        .setDegree(0)
                                        .setReach(5000)
                                        .setSpeed(40)
                                        .setTarget(true, talonHitWheel ? team : getEnemyTeam())
                                        .setSize({ height: 60, width: 60 })
                                        .setStyle('rgb(36, 37, 39)')
                                        .onHit("talon skill wheel2")
                                        .canPass(!talonHitWheel)
                                        .ignoreObj(true)
                                        .build(team));
                                }
                            }, 2500);
                        }
                    }
                }
                if (!((_16 = _this.onhit) === null || _16 === void 0 ? void 0 : _16.includes('talon skill e1')) && !((_17 = _this.onhit) === null || _17 === void 0 ? void 0 : _17.includes('talon skill wheel')))
                    _this.isArrive = false;
                // this.isArrive = false;
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
    ProjectileBuilder.prototype.setStyle = function (color, opacity) {
        this.projectile.style.color = color;
        this.projectile.style.opacity = opacity;
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
    ProjectileBuilder.prototype.projOffset = function (offset) {
        this.projectile.offset = offset;
        return this;
    };
    ProjectileBuilder.prototype.build = function (type) {
        this.projectile.start(type);
        return this.projectile;
    };
    return ProjectileBuilder;
}());
