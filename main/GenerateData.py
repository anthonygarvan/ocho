__author__ = 'tony'
from main.models import *
from datetime import datetime

def generate_data():
    deleteAllData()
    deviceTypes = ['ocho-pad', 'ocho-mini', 'ocho-tag']
    DaysOfWeek = ['Sun','Mon','Tue', 'Wed','Thu','Fri','Sat']
    AlertTypes= ['email', 'push', 'ocho-display', 'ocho-alarm']
    EventTypes= ['touch', 'untouch']
    Conditions = ['touch', 'untouch', 'isPresent', 'isAbsent']
    Contacts = ['anthony.garvan@gmail.com', '224-307-9240', '4','4']
    modelSet = [DeviceType, DayOfWeek, AlertType, EventType, Condition]
    dataSet = [deviceTypes, DaysOfWeek, AlertTypes, EventTypes, Conditions]

    print [modelSet, dataSet]
    for x in xrange(0, len(modelSet)):
        model = modelSet[x]
        data = dataSet[x]
        for name in data:
            print name
            m = model()
            m.name = name
            m.save()

    types = DeviceType.objects.all()
    users = User.objects.all()
    names = ['Tony', 'Erin']

    for user in users:
        for name in names:
            for type in types:
                d = Device()
                d.name = name
                d.user = user
                d.deviceType = type
                d.save()
        for i in xrange(0,len(AlertTypes)):
            a = Alert()
            a.user = user
            a.type = AlertType.objects.get(name=AlertTypes[i])
            a.contact = Contacts[i]
            a.isValidated = True
            a.save()

    r = Rule()
    r.user = users[0]
    r.name = 'test rule1'
    r.condition = Condition.objects.get(pk=1)
    r.base = Device.objects.get(pk=1)
    r.tag = Device.objects.get(pk=2)
    r.startTime = datetime.now()
    r.stopTime = datetime.now()
    r.alert = Alert.objects.filter(user=user)[0]
    r.save()

    r = Rule()
    r.user = users[1]
    r.name = 'test rule2'
    r.condition = Condition.objects.get(pk=2)
    r.base = Device.objects.get(pk=2)
    r.tag = Device.objects.get(pk=1)
    r.startTime = datetime.now()
    r.stopTime = datetime.now()
    r.alert = Alert.objects.filter(user=user)[1]
    r.save()

def deleteAllData():
    deleteSet = [DeviceType, Device, DayOfWeek, ActiveDay, AlertType, Condition, Rule, Event, EventType, Alert, Rule]

    for mdlType in deleteSet:
        objList = mdlType.objects.all()
        for o in objList:
            o.delete()