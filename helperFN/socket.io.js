module.exports = {
    getUsersFromSocket: (socket) => {
        const users = [];
        for(let i = 0; i< socket.length;i++) {
            if (!users.includes(socket[i].username)) {
                users.push(socket[i].username);
            }
        }
        return users;
    },
    assignUserName: (socket , user) => {
        socket.username = user.userName;
        if (user.user_id) {
            socket.user_id = user.user_id
        }
    },
    assignRoom: (socket, room) => {
        socket.join(room);
        socket.rooms = room;
    },
};