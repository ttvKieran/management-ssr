const express = require('express');
const routes = express.Router();
const dgram = require('dgram');

// Tạo UDP socket
const udpServer = dgram.createSocket('udp4');

// Route hiển thị form
routes.get('/', (req, res) => {
    res.render('client/pages/demo/index'); // Render file demo.ejs
});

// Route xử lý gửi form
routes.post('/', (req, res) => {
    const { username, password } = req.body;
    const data = `username=${username}&password=${password}`;

    // Gửi UDP broadcast
    const broadcastAddress = '192.168.120.255'; // Địa chỉ broadcast của mạng
    const port = 12345;

    udpServer.send(data, port, broadcastAddress, (err) => {
        if (err) {
            console.error('Error sending UDP broadcast:', err);
        } else {
            console.log('UDP broadcast sent');
        }
    });

    // Phản hồi cho client
    res.redirect("back");
    // res.send(`Received: Username = ${username}, Password = ${password}`);
});

module.exports = routes;