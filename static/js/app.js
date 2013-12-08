App = Ember.Application.create();

App.Router.map(function() {
    //this.route("index", { path: "/" });
    this.resource("site", function() {
        this.resource("public", function() {
            this.route("how-it-works", { path: "/how-it-works"});
            this.route("buy-an-ocho", { path: "/buy-an-ocho"});
            this.route("privacy-policy", { path: "/privacy-policy"});
            this.route("contact-us", { path: "/contact-us"});
        });
        this.resource("portal", function() {
            this.route("index", { path: "/"});
            this.route("events", { path: "/events"});
            this.route("devices", { path: "/devices"});
        });
    })
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('public');
  }
});

App.IndexView = Ember.View.extend();

App.PublicView = Ember.View.extend();

App.PublicIndexView = Ember.View.extend({
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
          });
        $('#slides').css('overflow', 'visible');
    });}
});

App.SiteView = Ember.View.extend({
    didInsertElement: function() {
        this._super();
        Ember.run.scheduleOnce('afterRender', this, function(){
            var loginLeft = $("#login").position()['left'];
            var loginRight = loginLeft + $("#login").outerWidth(true);
            var loginFormLeftPos = loginRight - $("#login-form").outerWidth(true);
            $("#login-form").css("left", loginFormLeftPos);
            $('#login').unbind("click").click(
                function() {
                    toggleLogin();
                    //alert("clicked!");
                }
            );
            $("#sign-in").unbind("click").click(function() {
                    window.location.href = "/#/site/portal";
                    toggleLogin();
                });
        });}
});

var toggleLogin = function() {
        if($('#login-form').is(":visible")) {
            $('#login-form').slideUp();
            $('#login span').text("▼");
        } else {
            $('#login-form').slideDown();
            $('#login span').text("▲");
        }
};
