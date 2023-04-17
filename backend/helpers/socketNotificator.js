let onlineUsers = []

exports.sendNotificationToClient = (payload, userAddress) => {
    const reciever = onlineUsers.find(user => user.address === userAddress)

    if (!reciever) return

    const { sock } = reciever

    sock.emit('notification', payload)
}

exports.addOnlineUser = (user) => {
    onlineUsers.push(user)
}

exports.removeOnlineUser = (id) => {
    onlineUsers = onlineUsers.filter(user => user.id !== id)
}