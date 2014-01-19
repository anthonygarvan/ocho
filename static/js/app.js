App = Ember.Application.create();

App.Router.map(function() {
    //this.route("index", { path: "/" });
    this.resource("site", function() {
        this.resource("public", function() {
            this.route("how-it-works", { path: "/how-it-works"});
            this.route("buy-an-ocho", { path: "/buy-an-ocho"});
            this.route("privacy-policy", { path: "/privacy-policy"});
            this.route("contact-us", { path: "/contact-us"});
            this.route("login", { path: "/login"});
            this.route("register", { path: "/register"});
        });
        this.resource("portal", function() {
            this.route("index", { path: "/"});
            this.resource("events", function() {
                this.route("scheduled-event", { path: "/scheduled-event"});
                this.route("touch-event", { path: "/touch-event"});
            });
            this.resource("devices", function() {
               this.route("ocho", { path: "/ocho"});
               this.route("tag", {path: "/tag"});
            });
        });
    })
});

App.PortalRoute = Ember.Route.extend({
  model: function() {
      return {
            email: 'anthony.garvan@gmail.com',
            passwordHash: '555',
            isAuthenticated: true
      }},
  didInsertElement : function(){
      this._super();
      Ember.run.scheduleOnce('afterRender', this, function(){
      var authId = 1234;
        if(!isAuthenticated(authId)){
            window.location.href = "/#/site/public/login";
        }
});}
});

App.EventsRoute = Ember.Route.extend({
    model: function() {
        return {events: [{id: 1, isScheduled: true, name:'Plug in cell phone', description: 'Email anthony.garvan@gmail.com', active:true},
            {id: 2, isSchedued: false, name:'Let Erin know I\'m late', description: 'Notify 222-234-5543', active:false}]}
        //return ['test1', 'test2'];
    }
});

App.EventsIndexRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('events');
    }
});

App.DevicesRoute = Ember.Route.extend({
    model: function() {
        var userId = getUserId();
        return getDevices(userId);
    }
});

var getDevices = function(userId) {
    var userId = getUserId();
    return $.getJSON('/ajax/get-devices/', {userId: userId});
}

var getUserId = function() {
    return $.cookie('userId');
}

App.DevicesIndexRoute = Ember.Route.extend({
    model: function() {
        return this.modelFor('devices');
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

App.PublicRegisterView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        $("#register").click(function() {
            var email = $("#email").val();
            var password = $("#password").val();
            var confirm = $("#confirm").val();
            var message = '';
            if(email.length > 3) {
                if(password === confirm) {
                    if(password.length>5) {
                         $.getJSON('/ajax/register/', {email: email, password:password},function (data) {
                                if(data.alreadyRegistered) {
                                    message = 'That email has already been registered';
                                } else {
                                    $('#login-form').hide()
                                    message = 'Check your email!  We have sent you an email, click on the link to finalize your regisration.'
                                }

                                if(message) {
                                    $('#error-message').text(message);
                                }
                            });
                    }
                    else {
                        message = "Your password must be at least 6 characters";
                    }
                } else {
                    message = "Your password and confirmed password do not match.";
            }} else {
                message = "Please enter a valid email address";
            }

            if(message) {
                $('#error-message').text(message);
            }
        });
    });}
});

App.PublicLoginView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        $("#sign-in").click(function() {
            var email = $("#email").val();
            var password = $("#password").val();
            var message = '';
            $.getJSON('/ajax/login/', {email: email, password:password},function (data) {
                if(data.success) {
                    $.cookie("userId", data.userId);
                    window.location.href = "/#/site/portal/";
                } else {
                    message = 'That username and password combination were not found.'
                }
                if(message) {
                    $('#error-message').text(message);
                }
            });

            if(message) {
                $('#error-message').text(message);
            }
        });
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
                    var authId = 1234;
                    if(!isAuthenticated(authId)){
                        window.location.href = "/#/site/public/login";
                    }
                }
            );
        });}
});

App.EventsIndexView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        requiresAuthentication();
        $('.table-row').hover(function() {
            var eventId = $(this).attr("data-id");
            var selector = ".del-event-" + eventId
            $(selector).show();
        }, function() {
            var eventId = $(this).attr("data-id");
            var selector = ".del-event-" + eventId
            $(selector).hide();})
    });
  }
});

App.DevicesIndexView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        requiresAuthentication();
        bindHover();

        $('.device-rename-cancel').click(function() {
            toNameView();
            bindHover();
        });
        that = this;
        $('.device-rename-ok').click(function() {
            var userId = getUserId();
            var deviceId = $(this).attr("data-id");
            var inputSelector = "#new-name-container-" + deviceId;
            var deviceName = $(inputSelector).children('input').val();
            $.getJSON('/ajax/rename-device/', {userId: userId, deviceId: deviceId, deviceName:deviceName}, function(data) {
                if(!data.success) {
                    alert("error: could not rename");
                } else {
                    $.getJSON('/ajax/get-devices/', {userId: userId}, function(data) {
                        that.controller.set('content', data);
                        toNameView();
                        bindHover();
                    });
                }
            });
        });

        $('.rename').click(function() {
            //alert("renaming");
            var deviceId = $(this).attr("data-id");
            var inputSelector = "#rename-device-input-" + deviceId;
            var nameSelector = "#device-name-" + deviceId;
            $('.table-row').unbind('mouseenter mouseleave');
            $(inputSelector).show();
            $(nameSelector).hide();
            $('.rename').hide();
        });
    });}
});

App.DevicesOchoView = Ember.View.extend({
    didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        requiresAuthentication();

        $('#register').click(function() {
            var deviceId = $('#deviceId').val();
            var userId = getUserId();
            $.getJSON('/ajax/register-ocho/', {userId: userId, deviceId: deviceId}, function(data) {
                if(data.success) {
                    alert("you have successfully registered!");
                } else {
                    alert("there wan an error with your device registation.")
                }
            });
        });

        $('#cancel').click(function() {
            window.location = '/#/site/portal/devices';
        })
    })
}});

var toNameView = function() {
    $('.rename-input-container').hide();
    $('.device-name-container').show();
}

var bindHover = function () {
        $('.table-row').hover(function() {
            var deviceId = $(this).attr("data-id");
            var selector = ".rename-device-" + deviceId
            $(selector).show();
        }, function() {
            var deviceId = $(this).attr("data-id");
            var selector = ".rename-device-" + deviceId
            $(selector).hide();})
}

App.PortalIndexView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
        requiresAuthentication();
        var lineChartData = {
			labels : ["January","February","March","April","May","June","July"],
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : [65,59,90,81,56,55,40]
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [28,48,40,19,96,27,100]
				}
			]

		}

	var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData);
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

var requiresAuthentication = function() {
    var authId = 1234;
        if(!isAuthenticated(authId)){
            window.location.href = "/#/site/public/login";
        };
};

var authenticate = function(email, password) {
    return 1234
}

var isAuthenticated = function(authId) {
    return true;
}