class GameObject {
    public position: ObjPosition = {x: 0, y: 0};
    public size: ObjSize;
    public style: {color: string} = {color: 'rgb(80, 80, 80)'};
    public objSelector: HTMLDivElement;
    public extra = { canCollide: true };
    public INIT: {position: ObjPosition, size: ObjSize} = {position: {x: 0, y: 0}, size: {height: 0, width: 0}};
    public event = {onclick: undefined};
    public role: string = undefined;
    public team: string = undefined;

    public isCollide(subjectDiv: HTMLDivElement): boolean {
        const rect1 = subjectDiv.getBoundingClientRect();
        const rect2 = this.objSelector.getBoundingClientRect();

        if (!this.extra.canCollide) {
            const r1 = this.objSelector.offsetWidth / 2;
            const r2 = subjectDiv.offsetWidth / 2;
    
            const x1 = this.objSelector.offsetLeft + r1;
            const y1 = this.objSelector.offsetTop + r1;
            const x2 = subjectDiv.offsetLeft + r2;
            const y2 = subjectDiv.offsetTop + r2;
    
            const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
            return distance <= (r1 + r2);
        }

        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    public onClick(callback: () => void) {
        this.event.onclick = callback;

        this.objSelector.addEventListener('click', () => { callback() });
        this.objSelector.addEventListener('mouseenter', () => { game.style.cursor = 'pointer'; });
        this.objSelector.addEventListener('mouseleave', () => { game.style.cursor = ''; });

        return this;
    }

    public start() {
        this.INIT = {position: this.position, size: this.size}

        setInterval(() => {
            this.update();
        }, 16);

        if (this.event.onclick) this.onClick(this.event.onclick);
    }

    private update() {
        this.objSelector.style.left = `${ this.position.x }px`;
        this.objSelector.style.top = `${ this.position.y }px`;
    }
}

class GameObjectBuilder {
    private obj: GameObject;

    constructor() {
        this.obj = new GameObject();
    }

    public setPosition(x: number, y: number): GameObjectBuilder {
        this.obj.position = {x: x, y: y};
        this.obj.INIT.position = {x: x, y: y};
        
        return this;
    }

    public setSize(width: number, height: number): GameObjectBuilder {
        this.obj.size = {width: width, height: height};
        this.obj.INIT.size = {width: width, height: height};

        return this;
    }

    public setCollideSetting(boolean: boolean): GameObjectBuilder {
        this.obj.extra.canCollide = boolean;
        
        return this;
    }

    public setColor(color: string): GameObjectBuilder {
        this.obj.style.color = color;
        
        return this;
    }

    public setRole(role: 'nexus'): GameObjectBuilder {
        this.obj.role = role;
        
        return this;
    }

    public setTeam(team: 'blue' | 'red'): GameObjectBuilder {
        this.obj.team = team;
        
        return this;
    }

    public build(): GameObject {
        let game: HTMLElement = document.querySelector('main');
        const object: HTMLDivElement = document.createElement('div');

        if (!this.obj.extra.canCollide) {
            game = document.querySelector('.cancollide');
            object.style.borderRadius = '100%';
        }
        
        object.style.width = `${ this.obj.size.width }px`;
        object.style.height = `${ this.obj.size.height }px`;
        object.style.left = `${ this.obj.position.x }px`;
        object.style.top = `${ this.obj.position.y }px`;
        
        object.style.backgroundColor = this.obj.style.color;
        object.style.position = 'absolute';

        if (this.obj.role == 'nexus') {
            const hpBar: HTMLDivElement = document.createElement('div');
            const hpBarProgress: HTMLDivElement = document.createElement('div');
            const hpBarProgressLater: HTMLDivElement = document.createElement('div');

            hpBar.className = `nexus hp ${ this.obj.team }`;
            hpBarProgress.className = `hp-progress nexus ${ this.obj.team }`;
            hpBarProgressLater.className = `hp-progress later nexus ${ this.obj.team }`;

            object.appendChild(hpBar);
            hpBar.appendChild(hpBarProgressLater);
            hpBar.appendChild(hpBarProgress);

            object.className = 'nexus'
        }

        this.obj.objSelector = object;

        game.appendChild(object);
        this.obj.start();

        return this.obj
    }
}