const http = require('http');
const boardSensor = require('./photoresistor');
const port = 8080;
const sensorVals = [];

boardSensor(
  'A0',
  val => sensorVals.push(val),
)

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
  });

  let highVal;
  let lowVal;
  sensorVals.sort((a, b) => {
    return a > b ? 1 : -1;
  });

  res.write(`
<html>
  <head></head>
  <body>
    <h1>Sensor Vals</h1>
    <h5>Total: ${sensorVals.length}</h5>
    <h5>High: ${sensorVals[sensorVals.length - 1]}</h5>
    <h5>Low: ${sensorVals[0]}</h5>
  </body>
</html>

`);

  res.end();
});

server.listen(port);