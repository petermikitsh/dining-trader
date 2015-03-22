// Global event handler. Use judiciously.

Template.layout.events({
  'click .login': function (event, template) {
    if (Meteor.settings.public.AUTH_STRATEGY == "LDAP") {
      $('#loginModal').modal('show');
    } else {
      throwError("Login is currently unavailable.")
    }
  }
});
