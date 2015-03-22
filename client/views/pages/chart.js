Template.chart.events({
  'click .btn': function (e, template) {
    var date;
    switch (e.currentTarget.textContent) {
      case "1 Hour": date = moment().subtract(1, 'hour'); break;
      case "1 Day": date = moment().subtract(1, 'day'); break;
      case "7 Day": date = moment().subtract(7, 'days'); break;
      case "1 Month": date = moment().subtract(1, 'month'); break;
      case "3 Month": date = moment().subtract(3, 'months'); break;
      case "1 Year": date = moment().subtract(1, 'year'); break;
      case "5 Year": date = moment().subtract(5, 'years'); break;
      case "Max": date = moment.unix(0); break;
      default: date = moment().subtract(1, 'day'); 
    }
    Session.set("chartInterval", date.valueOf());
  }
});

Template.chart.rendered = function () {
  var chart = c3.generate({
    bindto: this.find('.chart'),
    point: {
      r: 0,
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: function (date) { return new moment(date).format("HH:mm:ss"); }
        }
      }
    },  
    data: {
      x: 'x',
      xFormat: '%m/%d/%Y %H:%M:%S',
      colors: {
        Price: "#F36E21"
      },
      columns: [['x'],['data1']]
    }
  });

  this.autorun(function (tracker) {
    var prices = Prices.find({}, {sort: {createdAt: 1}}).fetch(),
        x = ['x'],
        data1 = ['Price'];

    _.each(prices, function (price) {
      x.push(new moment(price.createdAt).format("MM/DD/YYYY HH:mm:ss"));
      data1.push(price.price);
    });

    chart.load({
      columns: [x, data1]
    });
  });
};
