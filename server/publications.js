Meteor.publish('currentPrice', function () {
  return Prices.find({}, {sort: {createdAt: -1}, limit: 1});
});

Meteor.publish('prices', function () {
  return Prices.find();
});
