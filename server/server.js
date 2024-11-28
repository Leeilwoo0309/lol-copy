const PORT = {ws: 8001, api: 1973};
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: PORT.ws });

const fs = require("fs");
const express = require("express");
const cors = require('cors');
const app = express();
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const clients = new Set();

console.clear();

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // ws.on('close', () => {
    //     clients.delete(ws);
    //     clients.forEach((client) => {
    //         if (client !== ws && client.readyState === WebSocket.OPEN) {
    //             client.send(JSON.stringify({message: "disconnect"}));
    //         }
    //     });
    // });
});

console.log(`WSS server is running in: http://localhost:${ PORT.ws }`);

// const corsOptions = {
//     origin: 'http://kimchi-game.kro.kr:5500',
//     methods: 'GET,POST,PUT,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
//     credentials: true
// };

// app.options('*', cors(corsOptions));
app.use(cors());
// app.use(cors({
//     origin: 'http://kimchi-game.kro.kr:5500', // 웹 페이지의 도메인과 포트
//     methods: 'GET',
//     credentials: true
// }));
// app.use(cors({
//     origin: 'file:///C:/Users/leeil/OneDrive/%EB%B0%94%ED%83%95%20%ED%99%94%EB%A9%B4/loljjapr/src/js', // 웹 페이지의 도메인과 포트
//     methods: 'GET',
//     credentials: true
// }));


app.get('/getChar', (req, res) => {
    const query = req.query.char;
    const charList = ['teacher', 'sniper', 'samira', 'ezreal', 'vayne', 'exponent', 'graves', 'assassin', 'vampire', 'aphelios', 'ashe', 'kaisa', 'akali', 'ahri', 'talon', 'yasuo'];

    if (query === undefined) {
        return res.send(JSON.stringify({
            body: {err: "챔 이름이 같이 안보내짐"}
        }))
    } else if (!charList.includes(query)) {
        return res.send(JSON.stringify({
            body: {err: `챔 이름이 유효하지 않음: ${ query }`}
        }))
    }

    fs.readFile(`./jsons/${ query }.json`, (err, data) => {
        if (err) throw err;

        const charData = {body: JSON.parse(data.toString())};

        return res.send(JSON.stringify(charData));
    });
});

app.get('/getItem', (req, res) => {
    fs.readFile(`./jsons/items.json`, (err, data) => {
        if (err) throw err;

        const itemData = {body: JSON.parse(data.toString())};

        return res.send(JSON.stringify(itemData));
    });
});

app.get('/getRune', (req, res) => {
    fs.readFile(`./jsons/runes.json`, (err, data) => {
        if (err) throw err;

        const itemData = {body: JSON.parse(data.toString())};

        return res.send(JSON.stringify(itemData));
    });
});


app.get('/game', (req, res) => {
    return res.sendFile('C:\\Users\\leeil\\OneDrive\\바탕 화면\\loljjapr\\public\\title.html');
});

app.get('/addPlay', async (req, res) => {
    let data;

    try {
        data = JSON.parse(atob(unescape(encodeURIComponent(req.query.data))));
    } catch (err) {
        console.error(err)
        return;
    }
    
    // console.log(data);

    const db = await open({
        filename: './db/playdata.db',
        driver: sqlite3.Database,
    });

    let items = {blue: [], red: []};

    // try {
    //     data.items.blue.forEach((e, i) => {
    //         items.blue.push(e.name[1] ?? '')
    //     })
        
    //     data.items.red.forEach((e, i) => {
    //         items.red.push(e.name[1] ?? '')
    //     });
    // } catch (err) {
    //     items = {blue: [], red: []};
        
    //     JSON.parse(data.items.blue).forEach((e, i) => {
    //         items.blue.push(e.name[1] ?? '')
    //     })
        
    //     JSON.parse(data.items.red).forEach((e, i) => {
    //         items.red.push(e.name[1] ?? '')
    //     });
    // }

    let addBlue = await db.all(`INSERT INTO ${ data.char.blue }
        ("enemy", "items", "projectileHit", "damage", "result")
        VALUES
        ("${ data.char.red }", "${ data.items.blue }", ${ data.onhitCount.blue }, ${ data.dmg.red  }, "${ data.team == 'blue' && data.result == 'win' }")
        `);

    let addRed = await db.all(`INSERT INTO ${ data.char.red }
        ("enemy", "items", "projectileHit", "damage", "result")
        VALUES
        ("${ data.char.blue }", "${ data.items.red }", ${ data.onhitCount.red }, ${ data.dmg.blue  }, "${ data.team == 'red' && data.result == 'win' }")
        `);

    let addPlayData = await db.all(`
        INSERT INTO d_plays ("win", "date", "champion", "items", "runes", "dmgs", "projectileHit")
        VALUES
        ('${ data.team }', '${ new Date().toISOString() }', '${ JSON.stringify(data.char) }', '${ JSON.stringify(data.items) }', '${ JSON.stringify(data.rune) }', '${ JSON.stringify(data.dmg) }', '${ JSON.stringify(data.onhitCount) }')
        `)

    // INSERT INTO 'main'."d_plays" ("win", "champion", "items", "runes", "dmgs", "projectileHit") VALUES ('', '', '{"blue":[],"red":[]}', '', '{"blue":0,"red":0}', '{"blue":0,"red":0}');

    // return res.send(data);
});

app.get('/get/char/:name', async (req, res) => {
    const charName = req.params.name;
    const charList = ["sniper", "ezreal", "samira", "vayne", "exponent", "graves", 'vampire', 'aphelios', 'ashe'];

    const db = await open({
        filename: './db/playdata.db',
        driver: sqlite3.Database,
    });

    if (charName === 'all') {
        let pushData = await db.all(`SELECT * FROM d_plays`);

        return res.send(pushData);
        // let data = {};

        // charList.forEach(async e => {
        //     // let pushData = await db.all(`SELECT * FROM ${ e }`);

        //     data[e] = pushData;
        // });

        // const ret = setInterval(() => {
        //     if (data != []) {
        //         clearInterval(ret);
        //         return res.send(data);
        //     };
        // }, 16);
    } else {
        // console.log(`SELECT * FROM d_plays WHERE champion LIKE "%${ charName }"%`);
        let data = await db.all(`SELECT * FROM d_plays WHERE champion LIKE "%${ charName }%"`);
    
        return res.send(data);
    }
});

app.get('/get/char-old/:name', async (req, res) => {
        const charName = req.params.name;
        const charList = ["sniper", "ezreal", "samira", "vayne", "exponent", "graves", 'vampire', 'aphelios', 'ashe', 'kaisa', 'akali', 'ahri'];
    
        const db = await open({
            filename: './db/playdata (~241125).db',
            driver: sqlite3.Database,
        });
    
        if (charName === 'all') {
            let data = {};
    
            charList.forEach(async e => {
                let pushData = await db.all(`SELECT * FROM ${ e }`);
    
                data[e] = pushData;
            });
    
            const ret = setInterval(() => {
                if (data != []) {
                    clearInterval(ret);
                    return res.send(data);
                };
            }, 16);
        } else {
            let data = await db.all(`SELECT * FROM ${ charName }`);
        
            return res.send(data);
        }
    });
    

app.get('/get/image/:name', (req, res) => {
    const type = req.params.name;

    if (type == 'item') {
        const itemName = req.query.item;

        return res.sendFile(`C:\\Users\\leeil\\OneDrive\\바탕 화면\\loljjapr\\public\\assets\\items\\${itemName}.png`);
    }
})

app.listen(PORT.api, () => {
    console.log(`API server is running in: http://localhost:${ PORT.api }`);
});