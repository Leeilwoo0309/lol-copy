const charsBtn: NodeListOf<HTMLDivElement> = document.querySelectorAll('.char-btn');
const selectedP: HTMLParagraphElement = document.querySelector('.selected-display');
const des: HTMLParagraphElement = document.querySelector('.description');
const readyBtn: HTMLParagraphElement = document.querySelector('#ready-btn');
const runeSelectFinBtn: HTMLParagraphElement = document.querySelector('#done-btn');
const runeSelectStartBtn: HTMLParagraphElement = document.querySelector('#rune-btn');
const runeBtn: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('.rune-btn');
const _socket = new WebSocket("ws://kimchi-game.kro.kr:8001");

let selected: {ally: [string, number], enemy: [string, number]} = {ally: [undefined, undefined], enemy: [undefined, undefined]};
let chars: CharData = undefined;
let runeInfo: string = undefined;
let charName: string[] = ['teacher', 'sniper', 'ezreal', 'samira', 'vayne', 'exponent', 'graves', 'vampire', 'aphelios', 'assassin'];
let charNameKr: string[] = ['Prof. CB', '스나이퍼', '이즈리얼', '사미라', '베인', '엑스포넨트', '그레이브즈', '블라디미르', '아펠리오스', '어쌔신'];
let charNameKrToEng = {
    케이틀린: 'sniper',
    이즈리얼: 'ezreal',
    사미라: 'samira',
    베인: 'vayne',
    엑스포넨트: 'exponent',
    그레이브즈: 'graves',
    블라디미르: 'vampire',
    아펠리오스: 'aphelios',
    애쉬: 'ashe',
    카이사: 'kaisa',
    아리: 'ahri',
    탈론: 'talon',
    야스오: 'yasuo'
    // 아칼리: 'akali'
}
let charNameEngToKr = {
    sniper: '케이틀린',
    ezreal: '이즈리얼',
    samira: '사미라',
    vayne: '베인',
    exponent: '엑스포넨트',
    graves: '그레이브즈',
    vampire: '블라디미르',
    aphelios: '아펠리오스',
    ashe: '애쉬',
    undefined: '정하지 않음',
    kaisa: "카이사",
    ahri: '아리',
    talon: '탈론',
    yasuo: '야스오'
    // akali: '아칼리'
};
let runeNameKrToEnd = {
    "기민한 발놀림": "gibal",
    "정복자": "bokjaJung",
    "치명적 속도": "chisok",
    "감전": "gamjun"
};
let runeNameEngToKr = {
    bokjaJung: '정복자',
    chisok: '치명적 속도',
    gibal: '기민한 발놀림',
    gamjun: '감전'
}
let readyStatus: [boolean, boolean] = [false, false];
let selectedRune: string = undefined;

async function getRuneInfo() {
    runeInfo = await fetch('http://kimchi-game.kro.kr:1973/getRune')
        .then(r => r.json())
        .then(result => result.body)
        .catch(err => console.log(err));
}

async function getCharInfo(name: string) {
    chars = await fetch(`http://kimchi-game.kro.kr:1973/getChar?char=${ name }`, {method: 'GET'})
        .then(r => r.json())
        .then(result => result.body)
        .catch(err => console.log(err));
        

    updateSelected();
    // console.log(chars);
};

charsBtn.forEach((e, i) => {
    e.addEventListener('click', () => {
        if (readyStatus[0]) return;
        selected.ally = [charNameKrToEng[e.innerHTML], i];
        // console.log(selected);

        document.querySelector('.selected')?.classList.remove('selected');
        e.classList.add('selected');

        getCharInfo(selected.ally[0]);

        _socket.send(JSON.stringify({body: {selection: selected.ally}}));
    });
});

readyBtn.addEventListener('click', () => {
    if (selected.ally[0] === undefined) {
        alert("올바른 챔피언을 선택해주세요.");
        return;
    } else if (selectedRune === undefined) {
        alert("올바른 룬을 선택해주세요.");
        return;
    }
    
    console.log(selected.ally);

    // if (document.querySelectorAll('.char-btn')[selected.ally[1] - 1].classList.contains('developing')) {
    //     alert("그거 아직 만드는 중임ㅎ");
    //     return;
    // }

    // if (selected.ally >= 9) {
    //     alert("그챔 아직 안만듦~~");
    //     return;
    // }

    readyStatus[0] = !readyStatus[0];

    _socket.send(JSON.stringify({
        body: {
            msg: "changeReadyStatus"
        }
    }));
})

_socket.onopen = () => {
    _socket.send('{"body": {"msg": "connected"}}');

    _socket.onmessage = (event) => {
        const blob = event.data;

        const reader = new FileReader();
        reader.onload = function() {
            //@ts-ignore
            const sentJson: {body: any} = JSON.parse(reader.result);

            // console.log(sentJson);

            if (sentJson.body) {
                if (sentJson.body.selection !== undefined) {
                    selected.enemy = sentJson.body.selection;
                    updateSelected();
                } else if (sentJson.body.msg == "connected") {
                    readyStatus[1] = false;
                    readyStatus[0] = false;

                    selected.enemy = undefined;
                    _socket.send(JSON.stringify({
                        body: {
                            selection: selected.ally
                        }
                    }));

                } else if (sentJson.body.msg == "changeReadyStatus") {
                    readyStatus[1] = !readyStatus[1];

                    if (readyStatus[0] && readyStatus[1]) {
                        _socket.send(JSON.stringify({
                            body: {
                                msg: "start"
                            }
                        }));

                        window.location.href = `../public/game.html?team=blue&char=${ chars.cn }&rune=${ selectedRune }`;
                    }
                } else if (sentJson.body.msg == "start") {
                    window.location.href = `../public/game.html?team=red&char=${ chars.cn }&rune=${ selectedRune }`;
                }
            }

            // console.log(sentJson);
        };

        reader.readAsText(blob);
    };
}


function updateSelected() {
    function generateDes(des: string, chars) {
        return des
            ?.replace(/\$pdu/g, ((chars.skills.passive?.duration) / 100)?.toString())
            ?.replace(/\$pd/g, (chars.skills.passive?.damage)?.toString())
            ?.replace(/\$psh/g, (chars.skills.passive?.skillHaste / 100)?.toString())
            ?.replace(/\$pmv/g, (chars.skills.passive?.moveSpd)?.toString())
            ?.replace(/\$pas/g, (chars.skills.passive?.atkspd * 100)?.toString())
            ?.replace(/\$par/g, (chars.skills.passive?.armor)?.toString())
            ?.replace(/\$pmr/g, (chars.skills.passive?.magicRegist)?.toString())
            ?.replace(/\$phe/g, (chars.skills.passive?.health)?.toString())
            ?.replace(/\$pra/g, (chars.skills.passive?.range)?.toString())
            ?.replace(/\$pad/g, (chars.skills.passive?.ad)?.toString())
            ?.replace(/\$pap/g, (chars.skills.passive?.ap)?.toString())
            ?.replace(/\$pcd/g, (chars.skills.passive?.cooldown / 100)?.toString())

            ?.replace(/\$qdu/g, (chars.skills.E?.duration / 100)?.toString())
            ?.replace(/\$qd/g, chars.skills.Q?.damage?.toString())
            ?.replace(/\$qad/g, chars.skills.Q?.ad?.toString())
            ?.replace(/\$qap/g, chars.skills.Q?.ap?.toString())
            ?.replace(/\$qcd/g, (chars.skills.Q?.cooldown / 100)?.toString())
            ?.replace(/\$qas/g, (chars.skills.Q?.atkspd * 100)?.toString())
            ?.replace(/\$qar/g, (chars.skills.Q?.armor)?.toString())
            
            ?.replace(/\$edu/g, (chars.skills.E?.duration / 100)?.toString())
            ?.replace(/\$ed/g, chars.skills.E?.damage?.toString())
            ?.replace(/\$ead/g, chars.skills.E?.ad?.toString())
            ?.replace(/\$eap/g, chars.skills.E?.ap?.toString())
            ?.replace(/\$ecd/g, (chars.skills.E?.cooldown / 100)?.toString())
            ?.replace(/\$eas/g, (chars.skills.E?.atkspd * 100)?.toString())
            ?.replace(/\$ear/g, (chars.skills.E?.armor)?.toString())
            ?.replace(/\$emv/g, (chars.skills.E?.moveSpd)?.toString())
            
            ?.replace(/\$sdu/g, (chars.skills.Shift?.duration / 100)?.toString())
            ?.replace(/\$sd/g, chars.skills.Shift?.damage?.toString())
            ?.replace(/\$sad/g, chars.skills.Shift?.ad?.toString())
            ?.replace(/\$sap/g, chars.skills.Shift?.ap?.toString())
            ?.replace(/\$scd/g, (chars.skills.Shift?.cooldown / 100)?.toString())
            ?.replace(/\$sas/g, (chars.skills.Shift?.atkspd * 100)?.toString())
            ?.replace(/\$sra/g, (chars.skills.Shift?.range)?.toString())
            ?.replace(/\$sar/g, (chars.skills.Shift?.armor)?.toString())
            
            ?.replace(/\$wdu/g, (chars.skills.Wheel?.duration / 100)?.toString())
            ?.replace(/\$wd/g, chars.skills.Wheel?.damage?.toString())
            ?.replace(/\$wad/g, chars.skills.Wheel?.ad?.toString())
            ?.replace(/\$wap/g, chars.skills.Wheel?.ap?.toString())
            ?.replace(/\$wcd/g, (chars.skills.Wheel?.cooldown / 100)?.toString())
            ?.replace(/\$was/g, (chars.skills.Wheel?.atkspd * 100)?.toString())
            ?.replace(/\$war/g, (chars.skills.Wheel?.armor)?.toString())
            
            ?.replace(/물리 피해/g, `<b style="color: rgb(243, 117, 0)">물리 피해</b>`)
            ?.replace(/공격력/g, `<b style="color: rgb(243, 117, 0)">공격력</b>`)
            ?.replace(/마법 피해/g, `<b style="color: rgb(0, 162, 255)">마법 피해</b>`)
            ?.replace(/주문력/g, `<b style="color: rgb(0, 162, 255)">주문력</b>`)
            ?.replace(/이동 속도/g, `<b style="color: gray">이동 속도</b>`)
            ?.replace(/체력/g, `<b style="color: rgb(0, 190, 0)">체력</b>`)
            ?.replace(/방어력/g, `<b style="color: rgb(255, 190, 0)">방어력</b>`)
            ?.replace(/마법 저항력/g, `<b style="color: rgb(0, 190, 255)">마법 저항력</b>`)
            ?.replace(/사거리/g, `<b>사거리</b>`)
    }
    if (chars) {
        des.innerHTML = `
                <h2>${ chars.name }</h2>
                <hr />
                <p>체력: ${ chars.defaultSpec.health }</p>
                <p>체력 재생: ${ chars.defaultSpec.healthBoost }</p>
                <p>공격력: ${ chars.defaultSpec.ad }</p>
                <p>공격 속도: ${ chars.defaultSpec.atkspd }</p>
                <p>방어력: ${ chars.defaultSpec.armor }</p>
                <p>마법 저항력: ${ chars.defaultSpec.magicRegist }</p>
                <p>사거리: ${ chars.defaultSpec.range }</p>
                <p>이동 속도: ${ chars.defaultSpec.moveSpd }</p>
                <p><b>기본 지속 효과</b><span> - ${ generateDes(chars.des.passive, chars) }</span></p>
                <p><b>스킬 Q</b><span> - ${ generateDes(chars.des.Q, chars) } </span></p>
                <p><b>스킬 E</b><span> - ${ generateDes(chars.des.E, chars) } </span></p>
                <p><b>스킬 Shift</b><span> - ${ generateDes(chars.des.Shift, chars) } </span></p>
                <p><b>스킬 Wheel (궁극기)</b><span> - ${ generateDes(chars.des.Wheel, chars) } </span></p>
        `
    }
    if (selectedRune) {
        document.querySelector('#rune-modal>div.description').innerHTML = `
            <h2>${ runeNameEngToKr[selectedRune] }</h2>
            <hr />
            <p>${ runeInfo[selectedRune].des }</p>
        `
    }
    selectedP.innerHTML = `<b>${ charNameEngToKr[selected.ally[0]] ?? "정하지 않음" } (나)</b> vs <span>${ charNameEngToKr[selected.enemy[0]] ??  "정하지 않음" } (상대)</span>`
}

setInterval(() => {
    updateSelected();
    if (readyStatus[1]) {
        readyBtn.innerHTML = `준비하기 (상대방 준비완료)`;
        readyBtn.style.fontSize = '15px';
        readyBtn.style.top = `675px`;
        readyBtn.style.background = 'linear-gradient(60deg, rgb(165, 0, 0), rgb(63, 0, 6))';
        readyBtn.style.boxShadow = '0px 0px 5px rgb(128, 15, 0)';
    } else if (readyStatus[0]) {
        readyBtn.innerHTML = `준비취소`
        readyBtn.style.fontSize = '30px';
        readyBtn.style.top = `660px`;
        readyBtn.style.background = 'linear-gradient(60deg, rgb(0, 0, 65), rgb(6, 0, 20))';
        readyBtn.style.boxShadow = '0px 0px 5px rgb(0, 15, 64)';
        readyBtn.style.borderRadius = '30px'
        readyBtn.style.animation = 'readyTrue 500ms cubic-bezier(0, 0.79, 0.47, 1.01)'
    } else {
        readyBtn.innerHTML = `준비하기`
        readyBtn.style.fontSize = '30px';
        readyBtn.style.top = `660px`;
        readyBtn.style.background = 'linear-gradient(60deg, rgb(0, 71, 165), rgb(6, 31, 63))';
        readyBtn.style.boxShadow = '0px 0px 5px rgb(0, 15, 128)';
        readyBtn.style.borderRadius = '10px';
        readyBtn.style.animation = ''
        readyBtn.style.animation = 'readyFalse 500ms cubic-bezier(0, 0.79, 0.47, 1.01)'
    }

    let modal: HTMLDivElement = document.querySelector('.modal');

    modal.style.height = `${window.innerHeight}px`;
    modal.style.width = `${window.innerWidth}px`;
}, 16);

// 룬 선택
runeBtn.forEach((e, i) => {
    e.addEventListener('click', () => {
        getRuneInfo()

        console.log('clicked');
        if (readyStatus[0]) return;
        selectedRune = runeNameKrToEnd[e.innerHTML];
        // console.log(selected);

        document.querySelector('.selected')?.classList.remove('selected');
        e.classList.add('selected');

        // getCharInfo(selected.ally[0]);
    });
});

runeSelectFinBtn.addEventListener('click', () => {
    let modal: HTMLDivElement = document.querySelector('.modal');

    modal.classList.add('off')
});

runeSelectStartBtn.addEventListener('click', () => {
    let modal: HTMLDivElement = document.querySelector('.modal');

    modal.className = 'modal';
});

runeSelectStartBtn.addEventListener('mouseover', () => {
    runeSelectStartBtn.innerHTML = runeNameEngToKr[selectedRune] ?? '정하지 않음';
    runeSelectStartBtn.style.fontSize = '20px';
    runeSelectStartBtn.style.top = '670px';
});

runeSelectStartBtn.addEventListener('mouseleave', () => {
    runeSelectStartBtn.innerHTML = '룬 선택'
    runeSelectStartBtn.style.fontSize = '25px';
    runeSelectStartBtn.style.top = '665px';
})

export {};