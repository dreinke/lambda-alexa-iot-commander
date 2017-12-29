const awsIoT = require('aws-iot-device-sdk');
const config = require('./config.json');
const device = awsIoT.device(config.params);

function send(data) {
  device.publish('server', data);
  console.log('SENT:', data);
}
function receive(topic, data) {
  console.log('RECEIVED:', data.toString());
}

function start() {
  send('Connected!');

  device.subscribe('thing');
  device.on('message', receive);
}

device.on('connect', start);
device.on('close', function() {
  console.log('close');
});
device.on('reconnect', function() {
  console.log('reconnect');
});
device.on('offline', function() {
  console.log('offline');
});
device.on('error', function(error) {
  console.log('error', error);
});