from django.shortcuts import render_to_response
import json
from django.http import HttpResponse, Http404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import hashlib
from main.models import *
from main.helpers import *

def index(request):
    return render_to_response('index.html')

def register(request):
    email = request.GET['email']
    password = request.GET['password']
    username = get_user_hash(email)
    alreadyRegistered = (len(User.objects.filter(email=email)) > 0)
    if not alreadyRegistered:
        User.objects.create_user(username=username, email=email, password=password)
        #user = User.objects.filter(username=username)[0]
        #user.is_active = False
        #user.save()
        #user.email_user("testSubject", "testBody", "Ocho Cloud")

    response = {}
    response['alreadyRegistered'] = alreadyRegistered

    return HttpResponse(json.dumps(response))


def login(request):
    email = request.GET['email']
    password = request.GET['password']
    username = get_user_hash(email)
    user = authenticate(username=username, password=password)

    success = (user is not None and user.is_active)
    response = {}
    response['success'] = success
    response['userId'] = username

    return HttpResponse(json.dumps(response))

def confirm_email(request):
    user = get_user(request)
    user.is_active = True
    user.save()

    return render_to_response('index.html')

def get_user_hash(email):
    return hashlib.sha224(email).hexdigest()

def forgot_password(request):
    email = request.GET['email']
    username = get_user_hash(email)
    user = User.objects.filter(username=username)[0]

    subject = "Your Ocho Cloud Password"
    body = "Your password is " + user.password
    user.email_user(subject, body)

    response = {}
    response['success'] = True

    return HttpResponse(json.dumps(response.__dict__))

def get_devices(request):
    user = get_user(request)
    devices = Device.objects.filter(user=user).values('pk', 'name','deviceType__name')
    return HttpResponse(jsonify(devices))

def rename_device(request):
    deviceId = request.GET['deviceId']
    deviceName = request.GET['deviceName']
    device = Device.objects.filter(pk=deviceId)[0]
    device.name = deviceName;
    device.save()

    response = {'success': True}
    return HttpResponse(json.dumps(response))

def get_user(request):
    username = request.GET['userId']
    return User.objects.filter(username=username)[0]

def register_ocho(request):
    user = get_user(request)
    deviceId = request.GET['deviceId']
    devices = Device.objects.filter(pk=deviceId)
    if len(devices) != 0:
        device = devices[0]
        device.user = user
        device.save()
        success = True
    else:
        success= False

    response = {}
    response['success'] = success

    return HttpResponse(json.dumps(response))

def get_rules(request):
    user = get_user(request)
    return HttpResponse(jsonify(get_rule_response(Rule.objects.filter(user=user))))

def create_empty_rule(request):
    user = get_user(request)
    rule = Rule(user=user)
    rule.save()
    return HttpResponse(jsonify(get_rule_response(Rule.objects.filter(pk=rule.pk))[0]))

def get_rule_response(queryResult):
    flat_rule = queryResult.values('pk', 'base__name', 'base__pk', 'tag__name', 'tag__pk', 'condition','condition__pk', 'startTime', 'stopTime', 'alert__type__name', 'alert__contact', 'alert__pk')
    return flat_rule

def update_rule(request):
    rule = Rule.objects.get(pk=request["pk"])
    rule.base = Device.objects.get(pk=request['base__pk'])
    rule.tag = Device.objects.get(pk=request['tag__pk'])
    rule.condition = Condition.get(pk=request['condition__pk'])
    rule.startTime = request['startTime']
    rule.stopTime = request['stopTime']
    rule.alert = Alert.objects.get(pk=request['alert__pk'])
    rule.save()
    return HttpResponse(jsonify(get_rule_response(rule.pk)[0]))

def get_alerts(request):
    user = get_user(request)
    return HttpResponse(jsonify(get_alert_response(Alert.objects.filter(user=user))))

def create_new_alert(request):
    user = get_user(request)
    alert = Alert(user=user)
    alert.save()
    return HttpResponse(jsonify(get_alert_response(Alert.filter.objects(pk=alert.pk))[0]))

def update_alert(request):
    alert = Alert.objects.get(pk=request['pk'])
    alert.name = AlertType.objects.get(pk=request['type__pk'])
    alert.contact = request['contact']
    alert.save()
    return HttpResponse(jsonify(get_alert_response(alert.pk)[0]))

def get_alert_response(queryObject):
    alert_flat = queryObject.values('pk','name', 'contact', 'isValidated')
    return alert_flat
