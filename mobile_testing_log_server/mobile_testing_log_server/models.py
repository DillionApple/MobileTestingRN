from django.db import models

class LogRecord(models.Model):
    device = models.CharField(max_length=64)
    stress = models.CharField(max_length=256)
    page = models.CharField(max_length=64)
    action = models.CharField(max_length=64)
    delay = models.IntegerField()
    create_time = models.DateTimeField(auto_now_add=True)