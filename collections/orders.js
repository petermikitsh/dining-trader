// User-placed orders (buys and sells).

Orders = new Mongo.Collection("orders");

var orderSchema = new SimpleSchema({
  type: {
    type: String,
    label: "Type",
    allowedValues: ['Buy', 'Sell']
  },
  limitPrice: {
    type: Number,
    label: "Limit Price",
    min: 0,
    decimal: true,
    exclusiveMin: false,
    optional: true,
    autoform: {
      placeholder: "Leave blank to accept the market price."
    }
  },
  fulfilledAt: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  price: {
    type: Number,
    min: 0,
    decimal: true,
    exclusiveMin: false,
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Number,
    autoform: {
      omit: true
    }
  }
});

Orders.attachSchema(orderSchema);

Orders.isMarketOrder = function isMarketOrder (order) {
  return (order.limitPrice != Number.MAX_VALUE && order.limitPrice != 0);
}

Meteor.methods({
  createOrder: function (doc) {
    var order = _.pick(doc, 'type', 'limitPrice');
    order.createdAt = new Date().getTime();
    // Market Buy (take the lowest seller price)
    if (order.type == "Buy" && _.isUndefined(order.limitPrice)) {
      order.limitPrice = Number.MAX_VALUE;
    }
    // Market Sell (take the highest buyer price)
    if (order.type == "Sell" && _.isUndefined(order.limitPrice)) {
      order.limitPrice = 0;
    }
    check(order, orderSchema);
    return Orders.insert(order);
  }
});

Orders.after.insert(function (userId, doc) {
  var buyer = Orders.findOne(
    {type: "Buy", fulfilledAt: {$exists: false}},
    {sort: {limitPrice: -1, createdAt: 1}}
  );
  var seller = Orders.findOne(
    {type: "Sell", fulfilledAt: {$exists: false}},
    {sort: {limitPrice: 1, createdAt: 1}}
  );
  if (buyer && seller &&
     buyer.limitPrice > seller.limitPrice) {
       onMatch(buyer, seller);
  }
});

function onMatch (buyer, seller) {
  var matchTime = new Date().getTime();
  Orders.update(buyer._id, {$set: {fulfilledAt: matchTime}});
  Orders.update(seller._id, {$set: {fulfilledAt: matchTime}});
  var price = calculateMatchPrice(buyer, seller);
  Prices.insert({price: price, createdAt: matchTime});
  Orders.update(buyer._id, {$set: {price: price}});
  Orders.update(seller._id, {$set: {price: price}});
}

function calculateMatchPrice (buyer, seller) {
  // Buyer is market order
  if (Orders.isMarketOrder(buyer) && !Orders.isMarketOrder(seller)) {
    return buyer.limitPrice;
  }
  // Seller is market order
  else if (!Orders.isMarketOrder(buyer) && Orders.isMarketOrder(seller)) {
    return seller.limitPrice;
  }
  // Both are market orders; return the older price
  else {
    return buyer.createdAt < seller.createdAt ? buyer.limitPrice : seller.limitPrice;
  }
}
