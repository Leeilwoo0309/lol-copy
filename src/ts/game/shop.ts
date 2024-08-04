const listDiv: HTMLParagraphElement = document.querySelector('#list');
const shopBtn: HTMLDivElement = document.querySelector('#gold-div');
const exitBtn: HTMLDivElement = document.querySelector('#shop-exit-btn');
const shopWin: HTMLDivElement = document.querySelector('#shop');
const resultItem: HTMLDivElement = document.querySelector('#result');

let itemInfo: number = undefined;
let isOpen: boolean = false;
let items: NodeListOf<HTMLDivElement>;
let isSellActive: boolean = false;
let hasBoots: boolean = false;

// 사는거
resultItem.addEventListener('click', () => {
    // 업그레이드하는 함수
    function upgradeLower() {
        let lower: string[] = [...itemData[itemInfo].lower];

        players[team].items.forEach((e, i) => {
            if (e !== undefined) {
                if (lower.includes(e.name[1])) {
                    if (e.ability.ad) players[team].specItem.ad -= e.ability.ad;
                    if (e.ability.ap) players[team].specItem.ap -= e.ability.ap;
                    if (e.ability.atkspd) players[team].specItem.atkspd -= e.ability.atkspd;
                    if (e.ability.armor) players[team].specItem.armor -= e.ability.armor;
                    if (e.ability.magicRegist) players[team].specItem.magicRegist -= e.ability.magicRegist;
                    if (e.ability.criticD) players[team].specItem.criticD -= e.ability.criticD;
                    if (e.ability.criticP) players[team].specItem.criticP -= e.ability.criticP;
                    if (e.ability.health) {
                        players[team].specItem.health -= e.ability.health;
                    
                        players[team].hp[1] -= itemData[itemInfo].ability.health;
                    }
                    if (e.ability.healthBoost) players[team].specItem.healthBoost -= e.ability.healthBoost;
                    if (e.ability.moveSpd) players[team].specItem.moveSpd -= e.ability.moveSpd;
                    if (e.ability.skillHaste) players[team].specItem.skillHaste -= e.ability.skillHaste;
                    if (e.ability.mana) players[team].specItem.mana -= e.ability.mana;
                    if (e.ability.manaR) players[team].specItem.manaR -= e.ability.manaR;
                    if (e.ability.vamp) players[team].specItem.vamp -= e.ability.vamp;
                    
                    lower = lower = lower.filter((element) => element !== e.name[1]);
                    players[team].items[i] = undefined;
                }
            }
        });

        return price;
    }

    let price: number = itemData[itemInfo].price;

    if (itemData[itemInfo].lower) price = getPrice(itemInfo);

    if (players[team].gold >= price && players[team].items.filter(e => e !== undefined).length < 6 + howManyLower(itemData[itemInfo].lower)) {
        if (itemData[itemInfo].name[1].includes('b_1') && hasBoots) return;
        if (itemData[itemInfo].name[1].includes('b_2') && hasItem("b_2atkspd") && hasBoots) return;

        players[team].gold -= price;

        if (itemData[itemInfo].ability.ad) players[team].specItem.ad += itemData[itemInfo].ability.ad;
        if (itemData[itemInfo].ability.ap) players[team].specItem.ap += itemData[itemInfo].ability.ap;
        if (itemData[itemInfo].ability.atkspd) players[team].specItem.atkspd += itemData[itemInfo].ability.atkspd;
        if (itemData[itemInfo].ability.moveSpd) players[team].specItem.moveSpd += itemData[itemInfo].ability.moveSpd;
        if (itemData[itemInfo].ability.skillHaste) players[team].specItem.skillHaste += itemData[itemInfo].ability.skillHaste;
        if (itemData[itemInfo].ability.armor) players[team].specItem.armor += itemData[itemInfo].ability.armor;
        if (itemData[itemInfo].ability.magicRegist) players[team].specItem.magicRegist += itemData[itemInfo].ability.magicRegist;
        if (itemData[itemInfo].ability.criticD) players[team].specItem.criticD += itemData[itemInfo].ability.criticD;
        if (itemData[itemInfo].ability.criticP) players[team].specItem.criticP += itemData[itemInfo].ability.criticP;
        if (itemData[itemInfo].ability.health) {
            players[team].specItem.health += itemData[itemInfo].ability.health

            players[team].hp[0] += itemData[itemInfo].ability.health;
            players[team].hp[1] += itemData[itemInfo].ability.health;
        };
        if (itemData[itemInfo].ability.vamp) players[team].specItem.vamp += itemData[itemInfo].ability.vamp;
        if (itemData[itemInfo].ability.healthBoost) players[team].specItem.healthBoost += itemData[itemInfo].ability.healthBoost;
        if (itemData[itemInfo].ability.mana) players[team].specItem.mana += itemData[itemInfo].ability.mana;
        if (itemData[itemInfo].ability.manaR) players[team].specItem.manaR += itemData[itemInfo].ability.manaR;

        if (itemData[itemInfo].lower) upgradeLower();
        if (itemData[itemInfo].name[1].includes('b_1') || itemData[itemInfo].name[1].includes('b_2')) hasBoots = true;

        for (let i = 0; i < 6; i++) {
            if (players[team].items[i] == undefined) {
                players[team].items[i] = itemData[itemInfo];
                break;
            }
        }
        
        if (itemData[itemInfo].name[1].includes('3_')) players[team].hp[1] += 190;
        refreshPrice();
        sellItems();
    }
});

function sellItems() {
    if (!isSellActive) {
        isSellActive = true;
        
        const itemVault: NodeListOf<HTMLDivElement> = document.querySelectorAll('.item-vault');
        
        itemVault.forEach((e, i) => {
            e.addEventListener('mousedown', (event) => {
                if (event.button) {
                    let sellitem = findItem(players[team].items[i].name[1]);

                    if (sellitem.body.name[1].includes('b_1') || sellitem.body.name[1].includes('b_2'))
                        hasBoots = false;

                    players[team].gold += players[team].items[i].price * 0.5;
                    players[team].items[i] = undefined;
                    
                    if (sellitem.body.ability.ad) players[team].specItem.ad -= sellitem.body.ability.ad;
                    if (sellitem.body.ability.ap) players[team].specItem.ap -= sellitem.body.ability.ap;
                    if (sellitem.body.ability.atkspd) players[team].specItem.atkspd -= sellitem.body.ability.atkspd;
                    if (sellitem.body.ability.moveSpd) players[team].specItem.moveSpd -= sellitem.body.ability.moveSpd;
                    if (sellitem.body.ability.skillHaste) players[team].specItem.skillHaste -= sellitem.body.ability.skillHaste;
                    if (sellitem.body.ability.armor) players[team].specItem.armor -= sellitem.body.ability.armor;
                    if (sellitem.body.ability.magicRegist) players[team].specItem.magicRegist -= sellitem.body.ability.magicRegist;
                    if (sellitem.body.ability.criticD) players[team].specItem.criticD -= sellitem.body.ability.criticD;
                    if (sellitem.body.ability.criticP) players[team].specItem.criticP -= sellitem.body.ability.criticP;
                    if (sellitem.body.ability.healthBoost) players[team].specItem.healthBoost -= sellitem.body.ability.healthBoost;
                    if (sellitem.body.ability.vamp) players[team].specItem.vamp -= sellitem.body.ability.vamp;
                    if (sellitem.body.ability.health) {
                        players[team].specItem.health -= sellitem.body.ability.health
                        // players[team].hp[1] -= sellitem.body.ability.health;
                    };
                    if (itemData[itemInfo].ability.mana) players[team].specItem.mana -= itemData[itemInfo].ability.mana;
                    if (itemData[itemInfo].ability.manaR) players[team].specItem.manaR -= itemData[itemInfo].ability.manaR;
                }
            })
        })
    }
}

function refreshPrice() {
    listDiv.innerHTML = ''
    itemData.forEach((e, i) => {
        if (e.grade !== "undefined") {
            listDiv.innerHTML += `
            <div id="item-selling-${ i }" class="item ${ e.grade }" style="background-image: url(./assets/items/${ e.name[1] }.png);">
                <p class="price">G${ e.lower ? getPrice(i) : e.price }</p>
            </div>`
        } else {
            listDiv.innerHTML += `
            <div id="item-selling-${ i }" class="item" style="background-image: url(./assets/items/${ e.name[1] }.png);">
                <p class="price">G${ e.lower ? getPrice(i) : e.price }</p>
            </div>`
        }
    })

    items = document.querySelectorAll('#list>.item');
    items.forEach((e, i) => {
        e.addEventListener('click', () => {
            refreshShop(e, i);
        });
    });
}

function shopOpen(boolean: boolean = isOpen) {
    isOpen = boolean;
    if (!isOpen) {
        listDiv.innerHTML = '';

        refreshPrice();


        shopWin.style.display = '';
        isOpen = true;

        // items.forEach((e, i) => {
        //     e.addEventListener('click', () => {
        //         refreshShop(e, i);
        //     });
        // });
    } else {
        shopWin.style.display = 'none';
        isOpen = false;
    }
}

shopBtn.addEventListener('click', () => {
    shopOpen();
});

exitBtn.addEventListener('click', () => {
    shopOpen();
});

shopBtn.addEventListener('mouseenter', () => { game.style.cursor = 'pointer'; });
shopBtn.addEventListener('mouseleave', () => { game.style.cursor = ''; });

function refreshShop(element, index) {
    const buyInfo: HTMLDivElement = document.querySelector('#buy-info');

    buyInfo.style.display = '';
    itemInfo = index;

    
    const underItem: HTMLDivElement = document.querySelector('#need-items');
    const des: HTMLDivElement = document.querySelector('#item-des');
    
    resultItem.style.backgroundImage = `url(./assets/items/${ itemData[index].name[1] }.png)`;
    resultItem.innerHTML = `<p class="price">${
        (itemData[index].name[1].includes('b_1') || itemData[index].name[1].includes('b_2')) && hasBoots ?
        "소유중" :
        "G" + itemData[index].price
    }</p>`;
    underItem.innerHTML = '';
    des.innerHTML = '';
    if (itemData[itemInfo].lower) {
        resultItem.innerHTML = `<p class="price">G${ getPrice(index) }</p>`;
    }
    
    des.innerHTML = `<h2>${ itemData[itemInfo].name[0] }</h2>`
    if (itemData[itemInfo].ability.ad) des.innerHTML += `<p>공격력: ${itemData[itemInfo].ability.ad}</p>`;
    if (itemData[itemInfo].ability.ap) des.innerHTML += `<p>주문력: ${itemData[itemInfo].ability.ap}</p>`;
    if (itemData[itemInfo].ability.mana) des.innerHTML += `<p>마나: ${itemData[itemInfo].ability.mana}</p>`;
    if (itemData[itemInfo].ability.manaR) des.innerHTML += `<p>마나 재생: ${itemData[itemInfo].ability.manaR}</p>`;
    if (itemData[itemInfo].ability.skillHaste) des.innerHTML += `<p>스킬 가속: ${itemData[itemInfo].ability.skillHaste}</p>`;
    if (itemData[itemInfo].ability.armor) des.innerHTML += `<p>방어력: ${itemData[itemInfo].ability.armor}</p>`;
    if (itemData[itemInfo].ability.magicRegist) des.innerHTML += `<p>마법 저항력: ${itemData[itemInfo].ability.magicRegist}</p>`;
    if (itemData[itemInfo].ability.health) des.innerHTML += `<p>체력: ${itemData[itemInfo].ability.health}</p>`;
    if (itemData[itemInfo].ability.atkspd) des.innerHTML += `<p>공격 속도: ${itemData[itemInfo].ability.atkspd}%</p>`;
    if (itemData[itemInfo].ability.vamp) des.innerHTML += `<p>모든 피해 흡혈: ${itemData[itemInfo].ability.vamp}%</p>`;
    if (itemData[itemInfo].ability.criticP) des.innerHTML += `<p>치명타 확률: ${itemData[itemInfo].ability.criticP}%</p>`;
    if (itemData[itemInfo].ability.criticD) des.innerHTML += `<p>추가 치명타 피해: ${itemData[itemInfo].ability.criticD}%</p>`;
    if (itemData[itemInfo].ability.moveSpd) des.innerHTML += `<p>이동 속도: ${itemData[itemInfo].ability.moveSpd}</p>`;
    if (itemData[itemInfo].ability.healthBoost) des.innerHTML += `<p>체력 회복 속도 증가: ${itemData[itemInfo].ability.healthBoost}%</p>`;
    if (itemData[itemInfo].des) des.innerHTML += `<br/><b>기본 지속 효과</b> - ${ itemData[itemInfo].des
        ?.replace(/\$e1/g, (itemData[itemInfo].extra[0]).toFixed())
        ?.replace(/\$e2/g, (itemData[itemInfo].extra[1] / 100).toFixed())
        ?.replace(/\$e3/g, (itemData[itemInfo].extra[2]).toFixed())
        ?.replace(/\$e4/g, (itemData[itemInfo].extra[3]).toFixed()) }`
    const aText: HTMLParagraphElement = document.querySelector('#need-items-text');

    


    itemData[index].lower?.forEach((e, i) => {
        underItem.style.display = '';
        aText.style.display = '';
        
        underItem.innerHTML += `<div id="need-item-${i}" class="item need itid-${ findItem(e).index }" style="background-image: url(./assets/items/${ e }.png)">
        <p class="price">G${ findItem(e).body.price }</p>
        </div>`;
    });
    
    if (!itemData[index].lower) {
        underItem.style.display = 'none';
        aText.style.display = 'none';
    }

    const lowerItemsSelector: NodeListOf<HTMLDivElement> = document.querySelectorAll('.need');

    lowerItemsSelector?.forEach(e => {
        e.addEventListener('click', () => {
            refreshShop(element, parseInt(e.classList[2].split("-")[1]));
        })
    })
}

function getPrice(index) {
    let price: number = itemData[index].price;
    let lower: string[] = [...itemData[index].lower];
    
    players[team].items.forEach((e) => {
        if (e !== undefined) {
            if (lower.includes(e.name[1])) {
                lower = lower.filter((element) => element !== e.name[1]);
                price -= e.price;
            }
        }
    });
    return price;
}

function hasItem(name: string) {
    let ret: boolean = false;

    players[team].items.forEach(e => {
        if (e !== undefined) {
            if (e.name[1] == name) ret = true;
        }
    });

    return ret;
}

function findItem(engName: string): {body: Item, index: number} {
    let ret: {body: Item, index: number} = {body: undefined, index: undefined};

    itemData.forEach((e, i) => {
        if (e.name[1] === engName) {
            ret.index = i;
            ret.body = e;
        }
    });

    return ret;
}

function howManyLower(lower: string[]) {
    let ret: number = 0;

    if (!lower) return 0;

    let restLower: string[] = [...lower];

    players[team].items.forEach(e => {
        if (restLower.includes(e?.name[1])) {
            restLower = restLower.filter((element) => element !== e.name[1]);
            ret += 1;
        }
    })

    return ret;
}