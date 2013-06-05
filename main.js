$(function() {
  var appView = new AppView();

  $("body").html(appView.render().$el);
});