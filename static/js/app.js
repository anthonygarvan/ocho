App = Ember.Application.create();

App.Router.map(function() {
    this.route("index", { path: "/" });
    this.route("how-it-works", { path: "/how-it-works" });
    this.route("buy-an-ocho", { path: "/buy-an-ocho" });
    this.route("privacy-policy", { path: "/privacy-policy" });
    this.route("contact-us", { path: "/contact-us" });
});

/*
App.IndexRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('index');
  }
});
*/
var toggleLogin = function() {
        if($('#login-form').is(":visible")) {
            $('#login-form').slideUp();
        } else {
            $('#login-form').slideDown();
        }
};

App.IndexView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        $("#slides").slidesjs({
            width: 800,
            height: 550,
            navigation: false,
            play: {
              active: false,
              auto: true,
              interval: 7000,
              swap: false
            }
          })
        $('#slides').css('overflow', 'visible');
        $('#login').unbind("click").click(
            function() {
                toggleLogin();
                //alert("clicked!");
            }
        );
        //$('.slidesjs-play').css('display', 'none');
        //$('.slidesjs-stop').css('display', 'none');
    });}
});
