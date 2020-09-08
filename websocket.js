const http = require('http');
const WebSocketServer = require('websocket').server;
const sensor = require('./photoresistor');

const port = 8080;
const log = msg => console.log(`${new Date().toISOString()} >>> ${msg}`);
const originIsAllowed = origin => true;

const server = http.createServer((req, res) => {
  log(`Receieved request for "${req.url}"`);
  res.writeHead(404);
  res.end();
});

server.listen(port, () => {
  log(`HTTP server listening on port ${port}`);
})

const socket = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

let conn;
sensor('A0', val => {
  if (conn) {
    log(`sent val ${val} over socket.`);
    conn.sendUTF(val);
  }
});

socket.on('request', req => {
  if (!originIsAllowed(req.origin)) {
    req.reject();
    log(`Request from "${req.origin}" rejected!`);
    return;
  }

  conn = req.accept(null, req.origin);
  log(`connection is ${conn}`);

  // receive messages
  conn.on('message', msg => {
    if (msg.type !== 'utf8') {
      log('Message rejected. Wrong type!');
      return;
    }

    // echo it back
    log(`sending message "${msg.utf8Data}" back`);
    conn.sendUTF(msg.utf8Data)
  });

  // close
  conn.on('close', (reasonCode, desc) => {
    log(`Connection closed because "${reasonCode}" - "${desc}"`);
  })
});
