module.exports = {
    getUsersFromSocket: (socket) => {
        const userNames = [];
        const users = [];
        for(let i = 0; i< socket.length;i++) {
            if (!userNames.includes(socket[i].user.userName)) {
                users.push(socket[i].user);
                userNames.push(socket[i].user.userName);
                // users.push({userName:socket[i].userName, user_id: socket[i].user_id});
            }
        }
        return users;
    },
    assignUserName: (socket , user) => {
        socket.user = user;
        
    },
    assignRoom: (socket, room) => {
        socket.join(room);
        socket.rooms = room;
    },
};