game.style.cursor = 'pointer';
document.oncontextmenu = () => false;

gameObjects[8].objSelector.classList.add('ally');
gameObjects[10].objSelector.classList.add('enemy');
document.querySelector('.hp-bar.hp-progress').classList.add(team);

console.log(team == 'red' ? "빨갱이팀" : "자본주의자팀");

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.key === '+' || event.key === '-' || event.key === '0')) {
        event.preventDefault();
    }
});

// 마우스 휠 확대/축소 방지
document.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
    }

    if (keyDown[e.key.toLowerCase()] === false) {
        keyDown[e.key.toLowerCase()] = true;
    } else if (e.key == ' ') keyDown.space = true;
});

body.addEventListener('keyup', (e) => {
    if (keyDown[e.key.toLowerCase()] === true)
        keyDown[e.key.toLowerCase()] = false;
    else if (e.key == ' ') keyDown.space = false;
});

body.addEventListener('mousemove', e => {
    absolutePointerPosition.x = e.clientX + cameraPosition.x;
    absolutePointerPosition.y = -e.clientY - cameraPosition.y;

    // keyDown.arrowright = false;
    // keyDown.arrowdown = false;
    // keyDown.arrowleft = false;
    // keyDown.arrowup = false;

    // if (e.clientX < window.innerWidth * 0.1) keyDown.arrowleft = true;
    // if (e.clientX > window.innerWidth * 0.9) keyDown.arrowright = true;
    // if (e.clientY < window.innerHeight * 0.13) keyDown.arrowup = true;
    // if (e.clientY > window.innerHeight * 0.8) keyDown.arrowdown = true;
});

body.addEventListener('mousedown', (e) => {
    keyDown.mouse[e.button] = true;
});

body.addEventListener('mouseup', (e) => {
    keyDown.mouse[e.button] = false;
});

skillBtns.forEach((e, i) => {
    //@ts-ignore
    let key: 'q' | 'e' | 'shift' | 'wheel' = ['q', 'e', 'shift', 'wheel'][i];
    const damageDisplayer: HTMLParagraphElement = document.querySelector('#skill-damage');

    e.addEventListener('mouseenter', () => {
        let damage: number = 0;
        let damageInfo: string = '';

        if (skillInfo[key].damage) {
            damage += skillInfo[key].damage
            damageInfo += `${ skillInfo[key].damage }`
        }
        if (skillInfo[key].ad) {
            damage += skillInfo[key].ad * players[team].spec.ad
            damageInfo += ` + 공격력 (${ players[team].spec.ad }) * ${ skillInfo[key].ad }`
        };
        if (skillInfo[key].ap) {
            damage += skillInfo[key].ap * players[team].spec.ap
            damageInfo += ` + 주문력 (${ players[team].spec.ap }) * ${ skillInfo[key].ap }`
        };

        if (skillInfo[key].damage > 0) {
            damageDisplayer.innerHTML = `${ key.toUpperCase() } ${skillInfo[key].des == "burf-heal" ? "회복량": "스킬 피해량"}: ${ Math.floor(damage) } <span style="font-size: 15px">(${
            damageInfo
                ?.replace("물리 피해", `<span style="color: rgb(243, 117, 0)">물리 피해</span>`)
                ?.replace("공격력", `<span style="color: rgb(243, 117, 0)">공격력</span>`)
                ?.replace("마법 피해", `<span style="color: rgb(0, 162, 255)">마법 피해</span>`)
                ?.replace("주문력", `<span style="color: rgb(0, 162, 255)">주문력</span>`)
                ?.replace("이동 속도", `<span style="color: gray">이동 속도</span>`) })</span>`;
            damageDisplayer.style.display = '';
        } else if (skillInfo[key].atkspd > 0) {
            damageInfo = '';
            damage = 0;

            if (skillInfo[key].atkspd) {
                damage += skillInfo[key].atkspd * 100
                damageInfo += `${ skillInfo[key].atkspd * 100 }%`
            }
            if (skillInfo[key].ad) {
                damage += skillInfo[key].ad * players[team].spec.ad
                damageInfo += ` + 공격력 (${ players[team].spec.ad }) * ${ skillInfo[key].ad }`
            };
            if (skillInfo[key].ap) {
                damage += skillInfo[key].ap * players[team].spec.ap
                damageInfo += ` + 주문력 (${ players[team].spec.ap }) * ${ skillInfo[key].ap }`
            };

            damageDisplayer.innerHTML = `${ key.toUpperCase() } 공격속도 증가량: ${ Math.floor(damage) }% <span style="font-size: 15px">(${
                damageInfo
                    ?.replace("물리 피해", `<span style="color: rgb(243, 117, 0)">물리 피해</span>`)
                    ?.replace("공격력", `<span style="color: rgb(243, 117, 0)">공격력</span>`)
                    ?.replace("마법 피해", `<span style="color: rgb(0, 162, 255)">마법 피해</span>`)
                    ?.replace("주문력", `<span style="color: rgb(0, 162, 255)">주문력</span>`)
                    ?.replace("이동 속도", `<span style="color: gray">이동 속도</span>`) })</span>`;
            damageDisplayer.style.display = '';
        } else if (skillInfo[key].duration > 0) {
            damageInfo = '';

            if (skillInfo[key].duration) {
                damage += skillInfo[key].duration
                damageInfo += `${ skillInfo[key].duration / 100 }초`
            }
            if (skillInfo[key].ad) {
                damage += skillInfo[key].ad * players[team].spec.ad * 100
                damageInfo += ` + 공격력 (${ players[team].spec.ad }) * ${ skillInfo[key].ad }`
            };
            if (skillInfo[key].ap) {
                damage += skillInfo[key].ap * players[team].spec.ap * 100
                damageInfo += ` + 주문력 (${ players[team].spec.ap }) * ${ skillInfo[key].ap }`
            };

            damageDisplayer.innerHTML = `${ key.toUpperCase() } 지속 시간: ${ Math.floor(damage) / 100 }초 <span style="font-size: 15px">(${
                damageInfo
                    ?.replace("물리 피해", `<span style="color: rgb(243, 117, 0)">물리 피해</span>`)
                    ?.replace("공격력", `<span style="color: rgb(243, 117, 0)">공격력</span>`)
                    ?.replace("마법 피해", `<span style="color: rgb(0, 162, 255)">마법 피해</span>`)
                    ?.replace("주문력", `<span style="color: rgb(0, 162, 255)">주문력</span>`)
                    ?.replace("이동 속도", `<span style="color: gray">이동 속도</span>`) })</span>`;
            damageDisplayer.style.display = '';
        }
    });
    
    e.addEventListener('mouseleave', () => {
        damageDisplayer.style.display = 'none';
    });
})

async function getCharInfo(char: string) {
    return await fetch(`http://kimchi-game.kro.kr:1973/getChar?char=${ char }`)
        .then(r => r.json())
        .then(result => result.body);
}

async function getItemInfo() {
    return await fetch(`http://kimchi-game.kro.kr:1973/getItem`)
        .then(r => r.json())
        .then(result => result.body);
}

async function getData() {
    let fetched = await getCharInfo(char[team])
    players[team].specINIT = fetched.defaultSpec;
    players[team].hp[0] = players[team].specINIT.health;
    players[team].hp[1] = players[team].specINIT.health;

    
    skillInfo.passive = fetched.skills.passive;
    skillInfo.q = fetched.skills.Q;
    skillInfo.e = fetched.skills.E;
    skillInfo.shift = fetched.skills.Shift;
    skillInfo.wheel = fetched.skills.Wheel;
    skillInfo.growth = fetched.growth;
    
    if (char[team] === 'aphelios') {
        apheliosSkillInfo.q.Calibrum = fetched.skills.Q.Calibrum;
        apheliosSkillInfo.q.Severum = fetched.skills.Q.Severum;
        apheliosSkillInfo.q.Infernum = fetched.skills.Q.Infernum;
        apheliosSkillInfo.q.Gravitum = fetched.skills.Q.Gravitum;
        apheliosSkillInfo.q.Crescendum = fetched.skills.Q.Crescendum;

        skillInfo.q = fetched.skills.Q.Calibrum;
        
    }

    let fetched2 = await getCharInfo(char[getEnemyTeam()])
    enemySkillInfo.wheel = fetched2.skills.Wheel;
    enemySkillInfo.passive = fetched2.skills.passive;
    enemySkillInfo.q = fetched2.skills.Q;
    enemySkillInfo.e = fetched2.skills.E;
    enemySkillInfo.shift = fetched2.skills.Shift;

    players[getEnemyTeam()].specINIT = await getCharInfo(char[getEnemyTeam()]);
    players[getEnemyTeam()].hp[0] = players[getEnemyTeam()].specINIT.health;
    players[getEnemyTeam()].hp[1] = players[getEnemyTeam()].specINIT.health;

    makeEzreal();
    makeSniper();
    makeSamira();
    makeVayne();
    makeExponent();
    makeAssassin();
    makeGraves();
    makeVampire();
    makeAphelios();
    makeAshe();

    if (char[team] == 'ezreal') {
        charClass = ezreal;
    } else if (char[team] == 'sniper') {
        charClass = sniper;
    } else if (char[team] == 'samira') {
        charClass = samira;
    } else if (char[team] == 'vayne') {
        charClass = vayne;
    } else if (char[team] == 'exponent') {
        charClass = exponent;
    } else if (char[team] == 'assassin') {
        charClass = assassin;
    } else if (char[team] == 'graves') {
        charClass = graves;
    } else if (char[team] == 'vampire') {
        charClass = vampire;
    } else if (char[team] == 'aphelios') {
        charClass = aphelios;
    } else if (char[team] == 'ashe') {
        charClass = ashe;
    }

    let fetchedItemData: ItemData[] = await getItemInfo();
    itemData = [];
    fetchedItemData.forEach(e => {
        if (e.enable) {
            let item = new ItemBuilder()
                .setName(e.name[0], e.name[1]).setPrice(e.price)
                .setAbility(e.ability)
            
            if (e.lower) item.setLower(e.lower);
            if (e.grade) item.setGrade(e.grade);
            if (e.extra) item.setExtra(e.extra);
            if (e.des) item.setDescription(e.des);
            if (e.active) item.setActive(e.active);
    
            itemData.push(
                item.build()
            );
        }
    });
}

function reload() {
    getData();

    socket.send(JSON.stringify({
        body: {msg: "reload"}
    }));
}