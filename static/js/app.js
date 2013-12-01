App = Ember.Application.create();

App.Router.map(function() {
    this.route("index", { path: "/" });
    this.route("how-it-works", { path: "/how-it-works" });
    this.route("buy-an-ocho", { path: "/buy-an-ocho" });
});

App.IndexRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('index');
  }
});

App.IndexView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        $("#slides").slidesjs({
            width: 800,
            height: 550,
            navigation: false
          })
        $('#slides').css('overflow', 'visible');
    });}
});
