const PORT = {ws: 8000, api: 1972};
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: PORT.ws });

const fs = require("fs");
// const express = require("express");
// const cors = require('cors');
// const app = express();

const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({message: "disconnect"}));
            }
        });
    });
});

console.log(`WSS server is running in: http://localhost:${ PORT.ws }`);



// app.use(cors());
// app.use(express.static('js'))

// app.get('/getData', (req, res) => {
//     fs.readFile('./jsons/data.json', (err, data) => {
//         if (err) throw err;

//         const jobData = {data: JSON.parse(data.toString())};

//         res.send(JSON.stringify(jobData));
//     });
// });

// app.get('/statistics/init', (req, res) => {
//     const query =  req.query;

//     const job = query.job;
//     const userSkill = query.userskill;

//     fs.readFile('./jsons/statistics.json', (err, data) => {
//         if (err) throw err;

//         let statisticsJson;

//         statisticsJson = JSON.parse(data.toString());
        
//         statisticsJson.job[job].pick += 1;
//         statisticsJson.userSkill[userSkill].pick += 1;
//         statisticsJson.games += 0.5;

//         fs.writeFile('./jsons/statistics.json', JSON.stringify(statisticsJson), (err) => {if (err) throw err})
//     })

//     res.send(req.query)
// });

// app.get('/statistics/gameover', (req, res) => {
//     const query =  req.query;

//     const job = query.job;
//     const userSkill = query.userskill;
//     const result = query.result;

//     fs.readFile('./jsons/statistics.json', (err, data) => {
//         if (err) throw err;

//         let statisticsJson = JSON.parse(data.toString());
        
//         statisticsJson.job[job][result] += 1;
//         statisticsJson.userSkill[userSkill][result] += 1;

//         fs.writeFile('./jsons/statistics.json', JSON.stringify(statisticsJson), (err) => {if (err) throw err})
//     })

//     res.send(req.query);
// });

// app.get('/statistics/get', (req, res) => {
//     fs.readFile('./jsons/statistics.json', (err, data) => {
//         if (err) throw err;

//         res.send(data.toString());
//     })
// });

// app.get('/statistics', (req, res) => {
//     res.sendFile(__dirname + '/html/statistics.html')
// })

// app.listen(PORT.api, () => {
//     console.log(`API server is running in: http://localhost:${ PORT.api }`)
// })