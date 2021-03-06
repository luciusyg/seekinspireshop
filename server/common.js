Meteor.publish("allUsers", function() {
    return Meteor.users.find();
});

Meteor.publish("UserData", function() {
    return UserData.find();
});

Meteor.publish("itemData", function() {
    return itemData.find();
});

Accounts.validateNewUser(function (user){
	UserData.insert({
						userId: user._id,
						username: user.username,
						cropImage: "profileImages/defaultprofile",
						imageCloudId: "pending",
						userDesc: "hello you can place your desc here"
						});
	return true;
});