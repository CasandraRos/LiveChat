const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const favicon = require("serve-favicon");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Handle room creation and redirection
app.get('/chat', (req, res) => {
    const roomId = req.query.id;
    if (!roomId) {
        return res.status(400).send('Room ID is required');
    }
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Simpan riwayat pesan per room
const messageHistory = {};

io.on('connection', (socket) => {

    socket.on('join', (roomId, username) => {
        if (!username || username.trim() === '') {
            // Jika username tidak ada atau kosong, tolak koneksi
            socket.emit('invalidUsername');
            return;
        }

        // Bergabung ke room
        socket.join(roomId);

        // Kirim riwayat pesan kepada pengguna yang baru bergabung
        if (messageHistory[roomId]) {
            messageHistory[roomId].forEach((message) => {
                socket.emit('chatMessage', message);
            });
        }

        // Kirim pesan selamat datang ke semua pengguna di room
        io.to(roomId).emit('chatMessage', { username: 'System', message: `${username} has joined the chat` });

        // Tangani pesan dari pengguna
        socket.on('chatMessage', (message) => {
            const chatMessage = { username, message };
            // Kirim pesan ke semua pengguna di room
            io.to(roomId).emit('chatMessage', chatMessage);
            // Tambah pesan ke riwayat
            if (!messageHistory[roomId]) {
                messageHistory[roomId] = [];
            }
            messageHistory[roomId].push(chatMessage);
        });

        // Tangani saat pengguna keluar (disconnect)
        socket.on('disconnect', () => {
            io.to(roomId).emit('chatMessage', { username: 'System', message: `${username} has left the chat` });
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});