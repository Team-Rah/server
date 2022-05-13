module.exports = {
    getUsersFromSocket: (socket) => {
        const users = [];
        for(let i = 0; i< socket.length;i++) {
            if (!users.includes(socket[i].userName)) {
                users.push({userName:socket[i].userName, user_id: socket[i].user_id});
            }
        }
        return users;
    },
    assignUserName: (socket , user) => {
        socket.userName = user.userName;
        if (user.user_id) {
            socket.user_id = user.user_id
        }
    },
    assignRoom: (socket, room) => {
        socket.join(room);
        socket.rooms = room;
    },
};