Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function () {
    return [Meteor.subscribe('currentPrice'), Meteor.subscribe('alerts')];
  }
});

Router.map(function() {

  this.route('index', {
    path: '/',
    template: 'index',
    onBeforeAction: function () {
      Session.setDefault("chartInterval", moment().subtract(1, 'hour').valueOf());
      this.next();
    },
    waitOn: function () {
      return Meteor.subscribe('prices', Session.get("chartInterval"));
    },
    data: function () {
      return {
        lastPrice: Prices.findOne({}, {sort: {createdAt: -1}})
      };
    }
  });

  this.route('about', {
    path: '/about',
    template: 'about'
  });

});
