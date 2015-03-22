// Site-wide alerts.

Alerts = new Mongo.Collection("alerts");

var alertSchema = new SimpleSchema({
  message: {
    type: String
  }
});

Alerts.attachSchema(alertSchema);
