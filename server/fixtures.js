if (process.env.NODE_ENV != "production") {

  if (Orders.find().count() == 0) {
    Meteor.setTimeout(function () {
      Meteor.call('createOrder', {type: "Buy"});
      Meteor.call('createOrder', {type: "Sell", limitPrice: 1});
    }, 0);

    Meteor.setTimeout(function () {
      Meteor.call('createOrder', {type: "Buy", limitPrice: 1.1});
      Meteor.call('createOrder', {type: "Sell"});
    }, 5000);

    Meteor.setTimeout(function () {
      Meteor.call('createOrder', {type: "Sell"});
      Meteor.call('createOrder', {type: "Buy", limitPrice: 1.2});
    }, 10000);

    Meteor.setTimeout(function () {
      Meteor.call('createOrder', {type: "Sell", limitPrice: 1.3});
      Meteor.call('createOrder', {type: "Buy"});
    }, 25000);
  }

  if (Alerts.find().count() == 0) {
    Alerts.insert({message: "This application instance is running in development mode."});
  }
}
