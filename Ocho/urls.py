from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
     url(r'^$', 'main.views.index', name='index'),
     url(r'^ajax/register/', 'main.views.register', name='register'),
     url(r'^ajax/login/', 'main.views.login', name='login'),
     url(r'^ajax/forgot-password/', 'main.views.forgot_password', name='forgot_password'),
     url(r'^ajax/get-devices/', 'main.views.get_devices', name='get_devices'),
     url(r'^ajax/rename-device/', 'main.views.rename_device', name='rename_device'),
     url(r'^ajax/register-ocho/', 'main.views.register_ocho', name='register_ocho'),
     url(r'^ajax/get-rules/', 'main.views.get_rules', name='get_rules'),
     url(r'^ajax/create-empty-rule/', 'main.views.create_empty_rule', name='create_empty_rule'),
     url(r'^ajax/update-rule/', 'main.views.update_rule', name='update_rule'),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
