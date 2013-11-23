App = Ember.Application.create();

App.Router.map(function() {
    this.route("index", { path: "/" });
    this.route("how-it-works", { path: "/how-it-works" });
    this.route("buy-an-ocho", { path: "/buy-an-ocho" });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  }
});
