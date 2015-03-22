// Price trading history.

Prices = new Mongo.Collection("prices");

if (Meteor.isServer) {
  Prices._ensureIndex({createdAt: 1});
}

var priceSchema = new SimpleSchema({
  price: {
    type: Number,
    decimal: true,
    min: 0
  },
  createdAt: {
    type: Number
  }
});

Prices.attachSchema(priceSchema);
