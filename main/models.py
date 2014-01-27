from django.db import models
from django.contrib.auth.models import User

class DeviceType(models.Model):
    name = models.CharField(max_length=50, unique=True)

class Device(models.Model):
    user = models.ForeignKey(User, db_index=True)
    name = models.CharField(max_length=50)
    deviceType = models.ForeignKey(DeviceType)
    dateActivated = models.DateTimeField(auto_now=True)

# saturday, sunday, etc
class DayOfWeek(models.Model):
    name = models.CharField(max_length=50)

# push notification, email, Ocho alert
class AlertType(models.Model):
    name = models.CharField(max_length=50)

# list of emails, phone numbers, ocho Ids
class Alert(models.Model):
    user = models.ForeignKey(User, db_index=True)
    type = models.ForeignKey(AlertType)
    contact = models.CharField(max_length=100)
    isValidated = models.BooleanField()

# touch, untouch, is present, is absent
class Condition(models.Model):
    name = models.CharField(max_length=50)

# primary rule object linking all data
class Rule(models.Model):
    user = models.ForeignKey(User, db_index=True)
    name = models.CharField(max_length=50)
    base = models.ForeignKey(Device, related_name='rule_base_device', null=True)
    tag = models.ForeignKey(Device, related_name='rule_tag_device', null=True)
    condition = models.ForeignKey(Condition, null=True)
    startTime = models.DateTimeField(null=True)
    stopTime = models.DateTimeField(null=True)
    alert = models.ForeignKey(Alert, null=True)
    active = models.BooleanField(default=True)

# table of days active for each rule
class ActiveDay(models.Model):
    rule = models.ForeignKey(Rule, db_index=True)
    day = models.ForeignKey(DayOfWeek)

# touch, untouch
class EventType(models.Model):
    name = models.CharField(max_length=50)

# (big) table of all events for all users
class Event(models.Model):
    user = models.ForeignKey(User, db_index=True)
    base = models.ForeignKey(Device, related_name='event_base_device')
    tag = models.ForeignKey(Device, related_name='event_tag_device')
    type = models.ForeignKey(EventType)
    timestamp = models.DateTimeField(auto_now=True)
