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
    device = Device.objects.filter(pk=deviceId)[0]
    device.user = user
    device.save()

    response = {}
    response['success'] = True

    return HttpResponse(json.dumps(response))
