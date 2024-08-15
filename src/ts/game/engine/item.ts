class Item {
    public name: [string, ItemNamesEnglish];
    public price: number;
    public ability: Ability;
    public lower: string[];
    public grade: string = 'undefined';
    public cooldown: number = 0;
    public passive: () => {};
    public extra: number[];
    public des: string;

    public start() {
        if (this.passive) this.passive();
    }
}

class ItemBuilder {
    private item: Item;

    constructor() {
        this.item = new Item();
    }

    public setName(name: string, imgName: ItemNamesEnglish): ItemBuilder {
        this.item.name = [name, imgName];
        return this;
    }

    public setPrice(price: number): ItemBuilder {
        this.item.price = price;
        return this;
    }

    public setAbility(ability: Ability): ItemBuilder {
        this.item.ability = ability;
        return this;
    }

    public setLower(lowGradeItems: string[]): ItemBuilder {
        this.item.lower = lowGradeItems;
        return this;
    }

    public setGrade(grade: "시작" | "장화" | "기본" | "서사" | "전설"): ItemBuilder {
        this.item.grade = grade;
        return this;
    }

    public setPassive(passive: () => {}): ItemBuilder {
        this.item.passive = passive;
        return this;
    }

    public setCooldown(time: number): ItemBuilder {
        this.item.cooldown = time;
        return this;
    }

    public setExtra(ex: number[]): ItemBuilder {
        this.item.extra = ex;
        return this;
    }

    public setDescription(des: string): ItemBuilder {
        this.item.des = des;
        return this;
    }

    public build() {
        return this.item;
    }
}