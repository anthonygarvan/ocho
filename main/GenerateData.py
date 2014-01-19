__author__ = 'tony'
from main.models import *

def generate_data():
    names = ['ocho-pad', 'ocho-mini', 'ocho-tag']

    for name in names:
        t1 = DeviceType()
        t1.name = name
        t1.save()

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

generate_data()
