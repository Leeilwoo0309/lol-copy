var GameObject = /** @class */ (function () {
    function GameObject() {
        this.position = { x: 0, y: 0 };
        this.style = { color: 'rgb(80, 80, 80)' };
        this.extra = { canCollide: true };
        this.INIT = { position: { x: 0, y: 0 }, size: { height: 0, width: 0 } };
        this.event = { onclick: undefined };
        this.role = undefined;
        this.team = undefined;
    }
    GameObject.prototype.isCollide = function (subjectDiv) {
        var rect1 = subjectDiv.getBoundingClientRect();
        var rect2 = this.objSelector.getBoundingClientRect();
        if (!this.extra.canCollide) {
            var r1 = this.objSelector.offsetWidth / 2;
            var r2 = subjectDiv.offsetWidth / 2;
            var x1 = this.objSelector.offsetLeft + r1;
            var y1 = this.objSelector.offsetTop + r1;
            var x2 = subjectDiv.offsetLeft + r2;
            var y2 = subjectDiv.offsetTop + r2;
            var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
            return distance <= (r1 + r2);
        }
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };
    GameObject.prototype.onClick = function (callback) {
        this.event.onclick = callback;
        this.objSelector.addEventListener('click', function () { callback(); });
        this.objSelector.addEventListener('mouseenter', function () { game.style.cursor = 'pointer'; });
        this.objSelector.addEventListener('mouseleave', function () { game.style.cursor = ''; });
        return this;
    };
    GameObject.prototype.start = function () {
        var _this = this;
        this.INIT = { position: this.position, size: this.size };
        setInterval(function () {
            _this.update();
        }, 16);
        if (this.event.onclick)
            this.onClick(this.event.onclick);
    };
    GameObject.prototype.update = function () {
        this.objSelector.style.left = "".concat(this.position.x, "px");
        this.objSelector.style.top = "".concat(this.position.y, "px");
    };
    return GameObject;
}());
var GameObjectBuilder = /** @class */ (function () {
    function GameObjectBuilder() {
        this.obj = new GameObject();
    }
    GameObjectBuilder.prototype.setPosition = function (x, y) {
        this.obj.position = { x: x, y: y };
        this.obj.INIT.position = { x: x, y: y };
        return this;
    };
    GameObjectBuilder.prototype.setSize = function (width, height) {
        this.obj.size = { width: width, height: height };
        this.obj.INIT.size = { width: width, height: height };
        return this;
    };
    GameObjectBuilder.prototype.setCollideSetting = function (boolean) {
        this.obj.extra.canCollide = boolean;
        return this;
    };
    GameObjectBuilder.prototype.setColor = function (color) {
        this.obj.style.color = color;
        return this;
    };
    GameObjectBuilder.prototype.setRole = function (role) {
        this.obj.role = role;
        return this;
    };
    GameObjectBuilder.prototype.setTeam = function (team) {
        this.obj.team = team;
        return this;
    };
    GameObjectBuilder.prototype.build = function () {
        var game = document.querySelector('main');
        var object = document.createElement('div');
        if (!this.obj.extra.canCollide) {
            game = document.querySelector('.cancollide');
            object.style.borderRadius = '100%';
        }
        object.style.width = "".concat(this.obj.size.width, "px");
        object.style.height = "".concat(this.obj.size.height, "px");
        object.style.left = "".concat(this.obj.position.x, "px");
        object.style.top = "".concat(this.obj.position.y, "px");
        object.style.backgroundColor = this.obj.style.color;
        object.style.position = 'absolute';
        if (this.obj.role == 'nexus') {
            var hpBar = document.createElement('div');
            var hpBarProgress = document.createElement('div');
            var hpBarProgressLater = document.createElement('div');
            object.style.transition = 'opacity 3s';
            hpBar.className = "nexus hp ".concat(this.obj.team);
            hpBarProgress.className = "hp-progress nexus ".concat(this.obj.team);
            hpBarProgressLater.className = "hp-progress later nexus ".concat(this.obj.team);
            object.appendChild(hpBar);
            hpBar.appendChild(hpBarProgressLater);
            hpBar.appendChild(hpBarProgress);
            object.className = 'nexus';
        }
        this.obj.objSelector = object;
        game.appendChild(object);
        this.obj.start();
        return this.obj;
    };
    return GameObjectBuilder;
}());
