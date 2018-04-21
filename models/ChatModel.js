//Require Mongoose
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var senderReceiverChatMessageSchema = new Schema({
    user1Email:{
        type: String,
        required: true
    },
    user2Email:{
        type: String,
        required: true
    },
    Objectarray: [{senderID: String, Message: String, timeStamp: Date}]
});

var SomeModel = mongoose.model('SomeModel', senderReceiverChatMessageSchema);