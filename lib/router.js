Router.configure({
  layoutTemplate: 'layout',
  waitOn: function () {
    return Meteor.subscribe('currentPrice');
  }
});

Router.map(function() {

  this.route('index', {
    path: '/',
    template: 'index',
    waitOn: function () {
      return Meteor.subscribe('prices');
    },
    data: function () {
      return {
        lastPrice: Prices.findOne({}, {sort: {createdAt: -1}})
      };
    }
  });

});
