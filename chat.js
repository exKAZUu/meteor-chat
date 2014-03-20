// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");
Messages = new Meteor.Collection("messages");

if (Meteor.isClient) {
  Template.chat.me = function () {
    return Players.findOne(Session.get("me"));
  };

  Template.chat.players = function () {
    return Players.find({}, {sort: {id: 1, name: 1}});
  };

  Template.chat.messages = function () {
    return Messages.find({});
  };

  Template.chat.events({
    'click #enter': function () {
      var myId = Players.insert({
        name: $("#name").val(),
        ready: false
      });
      Session.set("me", myId);
    },
    'click #ready': function () {
      Players.update(Session.get("me"), {$set: {ready: true}});
    },
    'click #clear': function () {
      Meteor.call('clear');
    },
    'click #send': function () {
      var me = Template.chat.me();
      Messages.insert({
        name: me.name,
        msg: $("#chat_msg").val()
      });
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    return Meteor.methods({
      clear: function() {
        Players.remove({});
        Messages.remove({});
      }
    });
  });
}
