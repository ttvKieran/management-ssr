const Chat = require("../../models/chats.model");
const User = require("../../models/users.model");
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;
    // Socket IO
    _io.once("connection", (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content
            })
            await chat.save();
            _io.emit("SERVER_RETURN_MESSAGE", {
                fullname: fullname,
                content: content,
                userId: userId
            });
        });
    })
    // End Socket IO
    
    // Get Data from DB
    const chats = await Chat.find({
        deleted: false
    });
    for(const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullname");
        chat.infoUser = infoUser;
    }
    // End Get Data from DB

    res.render("client/pages/chat/index", {
        titlePage: "Chat",
        chats: chats
    });
}