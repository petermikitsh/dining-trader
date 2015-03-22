Template.header.helpers({
  currentPrice: function () {
    return Prices.findOne({}, {sort: {createdAt: -1}});
  }
});
