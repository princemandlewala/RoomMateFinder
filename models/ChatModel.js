const mongoose = require('mongoose');
const mongo = require('mongodb');
const Schema = mongoose.Schema;

var senderReceiverChatMessageSchema = new Schema({
	user1Email:{
		type: String,
		required: true
	},
	user2Email:{
		type: String,
		required: true
	},
	Objectarray: [{senderID: String, message: String}]
});

mongoose.model('SomeModel', senderReceiverChatMessageSchema);

/*function addMessage(Email1, Email2, msg, sndr){
    SomeModel.
    var abc = SomeModel.find( 'user1Email' ).where(user1Email: Email1, user2Email: Email2);
    console.log(abc);
}*/

var MongoClient = mongo.MongoClient;
var url = "mongodb://127.0.0.1:27017";
function insertToChat(Email1, Email2, msg, sender, callback) {
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		console.log(Email1+" inside insert chat");
		console.log(Email2+" inside insert chat");
		var dbo = db.db("roomMateFinder");
		var nesObj = {senderID: sender, message: msg, timeStamp: new Date()};
		var myobj = {user1Email: Email1, user2Email: Email2, ObjectArray: [nesObj]};
		var query = {user1Email: Email1, user2Email: Email2};
		var query2 = {user1Email: Email2, user2Email: Email1};
		var update = {$push: {ObjectArray: nesObj}};

		dbo.collection("ChatModel",function(err, roomMateFinderCollection){
			roomMateFinderCollection.findOne(query, function(err, conversation){
				if(err)
					throw err;
				console.log("Conversation Found! ",conversation);
				var checker = 9;
				if(conversation == null){
					checker = 0;
				}
				if(conversation == null && roomMateFinderCollection.findOne(query2) == null) {
					roomMateFinderCollection.insert(myobj, function (err, res) {
						if (err) throw err;
						console.log("1 document inserted");
                            //console.log(res);
                            db.close();
                        })

				}else{
					if(checker == 9) {
						roomMateFinderCollection.update(query, update, function (err, res1) {
							if (err) throw err;
							console.log("1 document inserted");
                                //console.log(res1);
                                db.close();
                            })
					}else{
						roomMateFinderCollection.update(query2, update, function (err, res1) {
							if (err) throw err;
							console.log("1 document inserted");
                                //console.log(res1);
                                db.close();
                            })
					}
				}
				roomMateFinderCollection.findOne(query).then(function (value) {
						if (value != null) {
							return callback(value);
					}
				})
				roomMateFinderCollection.findOne(query2).then(function (value) {
						if (value != null) {
							return callback(value);
					}
				})
			});
		});




	});
}


function viewChat(Email1, Email2, callback) {
	MongoClient.connect(url,function (err,db) {
		if (err) throw err;
		var dbo = db.db("roomMateFinder");
		var result;
		var query = {user1Email: Email1, user2Email: Email2};
		var query2 = {user1Email: Email2, user2Email: Email1};

		dbo.collection("ChatModel", function (err, roomMateFinderCollection) {
			if (roomMateFinderCollection == null) {
				throw err;
			}
			roomMateFinderCollection.findOne(query).then(function (value) {
				if (value != null) {
					return callback(value);
				}
			})

			roomMateFinderCollection.findOne(query2).then(function (value) {
				if (value != null) {
					return callback(value);
				}
			})

		})
	})
}




module.exports.viewChat = viewChat;
module.exports.insertToChat = insertToChat;
