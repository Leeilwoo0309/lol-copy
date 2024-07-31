const charsBtn: NodeListOf<HTMLDivElement> = document.querySelectorAll('.char-btn');
const selectedP: HTMLParagraphElement = document.querySelector('.selected-display');
const des: HTMLParagraphElement = document.querySelector('.description');
const readyBtn: HTMLParagraphElement = document.querySelector('#ready-btn');
const _socket = new WebSocket("ws://localhost:8001");

let selected: {ally: number, enemy: number} = {ally: undefined, enemy: undefined};
let chars: CharData = undefined;
let charName: string[] = ['teacher', 'sniper', 'ezreal', 'samira'];
let charNameKr: string[] = ['Prof. CB', '스나이퍼', '이즈리얼', '사미라'];
let readyStatus: [boolean, boolean] = [false, false];

async function getCharInfo(name: string) {
    chars = await fetch(`http://localhost:1973/getChar?char=${ name }`)
        .then(r => r.json())
        .then(result => result.body)
        .catch(err => console.log(err));
    
    updateSelected();
};

charsBtn.forEach((e, i) => {
    e.addEventListener('click', () => {
        if (i === 0) {
            alert("아직 안만듦~~");
            return;
        }
        selected.ally = i;

        document.querySelector('.selected')?.classList.remove('selected');
        e.classList.add('selected');

        getCharInfo(charName[selected.ally]);

        _socket.send(JSON.stringify({body: {selection: i}}));
    });
});

readyBtn.addEventListener('click', () => {
    if (selected.ally === undefined) {
        alert("챔피언을 선택해주세요.");
        return;
    }

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

                        window.location.href = `../public/game.html?team=blue&char=${ chars.cn }`;
                    }
                } else if (sentJson.body.msg == "start") {
                    window.location.href = `../public/game.html?team=red&char=${ chars.cn }`;
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
            ?.replace(/\$psh/g, (chars.skills.passive?.skillHaste / 100)?.toString())
            ?.replace(/\$pdu/g, ((chars.skills.passive?.duration) / 100)?.toString())
            ?.replace(/\$pmv/g, (chars.skills.passive?.moveSpd)?.toString())
            ?.replace(/\$pas/g, (chars.skills.passive?.atkspd * 100)?.toString())

            ?.replace(/\$qdu/g, (chars.skills.E?.duration / 100)?.toString())
            ?.replace(/\$qd/g, chars.skills.Q?.damage?.toString())
            ?.replace(/\$qad/g, chars.skills.Q?.ad?.toString())
            ?.replace(/\$qap/g, chars.skills.Q?.ap?.toString())
            ?.replace(/\$qcd/g, (chars.skills.Q?.cooldown / 100)?.toString())
            ?.replace(/\$qas/g, (chars.skills.Q?.atkspd * 100)?.toString())
            
            ?.replace(/\$edu/g, (chars.skills.E?.duration / 100)?.toString())
            ?.replace(/\$ed/g, chars.skills.E?.damage?.toString())
            ?.replace(/\$ead/g, chars.skills.E?.ad?.toString())
            ?.replace(/\$eap/g, chars.skills.E?.ap?.toString())
            ?.replace(/\$ecd/g, (chars.skills.E?.cooldown / 100)?.toString())
            ?.replace(/\$eas/g, (chars.skills.E?.atkspd * 100)?.toString())
            
            ?.replace(/\$sdu/g, (chars.skills.Shift?.duration / 100)?.toString())
            ?.replace(/\$sd/g, chars.skills.Shift?.damage?.toString())
            ?.replace(/\$sad/g, chars.skills.Shift?.ad?.toString())
            ?.replace(/\$sap/g, chars.skills.Shift?.ap?.toString())
            ?.replace(/\$scd/g, (chars.skills.Shift?.cooldown / 100)?.toString())
            ?.replace(/\$sas/g, (chars.skills.Shift?.atkspd * 100)?.toString())
            
            ?.replace(/\$wdu/g, (chars.skills.Wheel?.duration / 100)?.toString())
            ?.replace(/\$wd/g, chars.skills.Wheel?.damage?.toString())
            ?.replace(/\$wad/g, chars.skills.Wheel?.ad?.toString())
            ?.replace(/\$wap/g, chars.skills.Wheel?.ap?.toString())
            ?.replace(/\$wcd/g, (chars.skills.Wheel?.cooldown / 100)?.toString())
            ?.replace(/\$was/g, (chars.skills.Wheel?.atkspd * 100)?.toString())

            ?.replace("물리 피해", `<span style="color: rgb(243, 117, 0)">물리 피해</span>`)
            ?.replace("공격력", `<span style="color: rgb(243, 117, 0)">공격력</span>`)
            ?.replace("마법 피해", `<span style="color: rgb(0, 162, 255)">마법 피해</span>`)
            ?.replace("주문력", `<span style="color: rgb(0, 162, 255)">주문력</span>`)
            ?.replace("이동 속도", `<span style="color: gray">이동 속도</span>`)
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
                <p>사거리: ${ chars.defaultSpec.range }</p>
                <p>이동 속도: ${ chars.defaultSpec.moveSpd }</p>
                <p><b>기본 지속 효과</b><span> - ${ generateDes(chars.des.passive, chars) }</span></p>
                <p><b>스킬 Q</b><span> - ${ generateDes(chars.des.Q, chars) } </span></p>
                <p><b>스킬 E</b><span> - ${ generateDes(chars.des.E, chars) } </span></p>
                <p><b>스킬 Shift</b><span> - ${ generateDes(chars.des.Shift, chars) } </span></p>
                <p><b>스킬 Wheel (궁극기)</b><span> - ${ generateDes(chars.des.Wheel, chars) } </span></p>
        `
    }
    selectedP.innerHTML = `<b>${ charNameKr[selected.ally] ?? "정하지 않음" } (나)</b> vs <span>${ charNameKr[selected.enemy] ??  "정하지 않음" } (상대)</span>`
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
        readyBtn.innerHTML = `준비완료`
        readyBtn.style.fontSize = '30px';
        readyBtn.style.top = `660px`;
        readyBtn.style.background = 'linear-gradient(60deg, rgb(0, 0, 65), rgb(6, 0, 20))';
        readyBtn.style.boxShadow = '0px 0px 5px rgb(0, 15, 64)';
    } else {
        readyBtn.innerHTML = `준비하기`
        readyBtn.style.fontSize = '30px';
        readyBtn.style.top = `660px`;
        readyBtn.style.background = 'linear-gradient(60deg, rgb(0, 71, 165), rgb(6, 31, 63))';
        readyBtn.style.boxShadow = '0px 0px 5px rgb(0, 15, 128)';
    }
}, 16);

export {};