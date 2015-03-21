// Price trading history.

Prices = new Mongo.Collection("prices");

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
