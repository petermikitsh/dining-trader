Template.login.rendered = function () {
  $('#loginModal').on('shown.bs.modal', function() {
    $("#username").focus();
  });
};
