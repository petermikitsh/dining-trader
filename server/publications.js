Meteor.publish('currentPrice', function () {
  return Prices.find({}, {sort: {createdAt: -1}, limit: 1});
});

Meteor.publish('prices', function (createdAt) {
  return Prices.find({createdAt: {$gte: createdAt}});
});

Meteor.publish('alerts', function () {
  return Alerts.find();
});
