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

App.PortalRoute = Ember.Route.extend({
  model: function() {
      return {
            email: 'anthony.garvan@gmail.com',
            passwordHash: '555',
            isAuthenticated: true
      }
  }
});

App.PortalEventsRoute = Ember.Route.extend({
    model: function() {
        return {events: [{id: 1, isScheduled: true, name:'Plug in cell phone', description: 'Email anthony.garvan@gmail.com', active:true},
            {id: 2, isSchedued: false, name:'Let Erin know I\'m late', description: 'Notify 222-234-5543', active:false}]}
        //return ['test1', 'test2'];
    }
});

App.PortalDevicesRoute = Ember.Route.extend({
    model: function() {
        return {devices: [{id: 1, type:"ocho-pad", name:"Tony's Ocho"}, {id: 2, type:"ocho-mini", name:"Erin's Ocho"}, {id: 3, type:"tag", name:"Erin's Keys"}]}
    }
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
            /*
            var loginLeft = $("#login").position()['left'];
            var loginRight = loginLeft + $("#login").outerWidth(true);
            var loginFormLeftPos = loginRight - $("#login-form").outerWidth(true);
            $("#login-form").css("left", loginFormLeftPos);
            */
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

App.PortalEventsView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        $('.table-row').hover(function() {
            var eventId = $(this).attr("data-id");
            var selector = ".del-event-" + eventId
            $(selector).show();
        }, function() {
            var eventId = $(this).attr("data-id");
            var selector = ".del-event-" + eventId
            $(selector).hide();})
    });}
});

App.PortalDevicesView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        $('.table-row').hover(function() {
            var deviceId = $(this).attr("data-id");
            var selector = ".rename-device-" + deviceId
            $(selector).show();
        }, function() {
            var deviceId = $(this).attr("data-id");
            var selector = ".rename-device-" + deviceId
            $(selector).hide();})
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
