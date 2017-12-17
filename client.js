const net = require('net');
const client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
    console.log('Connected');
    const buff = new ArrayBuffer(16);
    let messageId = new Uint8Array(buff, 0, 1);
    let address = new Uint8Array(buff, 1, 4);
    let deviceId = new Uint8Array(buff, 5, 1);
    let chipId = new Uint16Array(buff, 6, 2);
    let freeHeap = new Uint16Array(buff, 10, 2);
    let softVersion = new Uint16Array(buff, 14, 1);
    messageId[0] = 1;

    address[0] = 192;
    address[1] = 168;
    address[2] = 0;
    address[3] = 105;
    
    deviceId[0] = 1;

    chipId[0] = 255;

    freeHeap[0] = 8888;

    softVersion[0] = 0;

    client.write(new Buffer(buff));
});

client.on('data', function(data) {
	console.log('Received ' + data);
	client.destroy(); 
});

client.on('close', function() {
	console.log('Connection closed');
});