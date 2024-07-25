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
        this.reach = -1;
    }
    Projectile.prototype.start = function (type) {
        var _this = this;
        if (type === void 0) { type = "ally"; }
        var _main = document.querySelector('.projectiles');
        var _bullet = document.createElement('div');
        _bullet.className = "".concat(type, " bullet");
        if (type == "ally") {
            _bullet.style.top = "".concat(-absolutePosition.ally.y - cameraPosition.y + 4, "px");
            _bullet.style.left = "".concat(absolutePosition.ally.x - cameraPosition.x + 4, "px");
            this.absPos.x = absolutePosition.ally.x;
            this.absPos.y = absolutePosition.ally.y;
        }
        else if (type == "enemy") {
            _bullet.style.top = "".concat(-absolutePosition.enemy.y - cameraPosition.y + 4, "px");
            _bullet.style.left = "".concat(absolutePosition.enemy.x - cameraPosition.x + 4, "px");
            this.absPos.x = absolutePosition.enemy.x;
            this.absPos.y = absolutePosition.enemy.y;
        }
        if (this.damage == 0) {
            _bullet.style.opacity = "20%";
            _bullet.style.backgroundColor = "black";
        }
        _main.appendChild(_bullet);
        var update = setInterval(function () {
            // _bullet.style.left = `${ this.absPos.x - cameraPosition.x }px`;
            // _bullet.style.top = `${ -this.absPos.y - cameraPosition.y }px`;
            // this.absPos.x = parseFloat(_bullet.style.left);
            // this.absPos.y = parseFloat(_bullet.style.top);
            _this._movedDistance += _this.speed;
            // const bulletX = parseFloat(_bullet.style.left);
            // const bulletY = parseFloat(_bullet.style.top);
            // const newX = bulletX - this.speed * Math.cos(this.angle);
            // const newY = bulletY + this.speed * Math.sin(this.angle);
            _this.absPos.x += -_this.speed * Math.cos(_this.angle);
            _this.absPos.y += -_this.speed * Math.sin(_this.angle);
            //  console.log(this.absPos);
            _bullet.style.left = "".concat(_this.absPos.x - cameraPosition.x, "px");
            _bullet.style.top = "".concat(-_this.absPos.y - cameraPosition.y, "px");
            // _bullet.style.left = `${ newX }px`;
            // _bullet.style.top = `${ newY }px`;
            // on-hit
            if (type == "enemy") {
                if (_this.isCollideWithPlayer(_bullet) && !_this.isCollide) {
                    console.log('맞음!1');
                    _this.isCollide = true;
                    players.ally.hp[1] -= _this.damage;
                }
            }
            var isNeedToDie = false;
            // 화면 밖으로 나가면 탄환 제거
            gameObjects.forEach(function (e) {
                if (e.isCollide(_bullet) && _this.isArrive) {
                    _this.isArrive = false;
                    _main.removeChild(_bullet);
                }
            });
            if (_this._movedDistance >= _this.reach * 1.5 && _this.isArrive) {
                _this.isArrive = false;
                _main.removeChild(_bullet);
            }
            if (!_this.isArrive) {
                clearInterval(update);
            }
        }, 16);
    };
    Projectile.prototype.isCollideWithPlayer = function (projectileSelector) {
        var r1 = players.ally.selector.offsetWidth / 2;
        var r2 = projectileSelector.offsetWidth / 2;
        var x1 = players.ally.selector.offsetLeft + r1;
        var y1 = players.ally.selector.offsetTop + r1;
        var x2 = projectileSelector.offsetLeft + r2;
        var y2 = projectileSelector.offsetTop + r2;
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
    ProjectileBuilder.prototype.setDamage = function (damage, random) {
        this.projectile.damage = damage;
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
    ProjectileBuilder.prototype.build = function (type) {
        if (type === void 0) { type = "ally"; }
        this.projectile.start(type);
        return this.projectile;
    };
    return ProjectileBuilder;
}());
