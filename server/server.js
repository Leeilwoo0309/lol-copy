const PORT = {ws: 8001, api: 1973};
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: PORT.ws });

const fs = require("fs");
const express = require("express");
const cors = require('cors');
const app = express();

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



app.use(cors());
app.use(express.static('js'))

app.get('/getChar', (req, res) => {
    const query = req.query.char;
    const charList = ['teacher', 'sniper', 'samira'];

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

        const jobData = {body: JSON.parse(data.toString())};

        return res.send(JSON.stringify(jobData));
    });
});

app.listen(PORT.api, () => {
    console.log(`API server is running in: http://localhost:${ PORT.api }`)
})