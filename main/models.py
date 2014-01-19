from django.db import models
from django.contrib.auth.models import User

class DeviceType(models.Model):
    name = models.CharField(max_length=50, unique=True)

class Device(models.Model):
    name = models.CharField(max_length=50)
    deviceType = models.ForeignKey(DeviceType)
    dateActivated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)

