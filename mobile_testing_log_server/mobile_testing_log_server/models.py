from django.db import models

class LogRecord(models.Model):
    device = models.CharField(max_length=64)
    cpu_stress = models.IntegerField(default=-1)
    disk_stress = models.IntegerField(default=-1)
    network_stress = models.IntegerField(default=-1)
    memory_stress = models.IntegerField(default=-1)
    page = models.CharField(max_length=64)
    action = models.CharField(max_length=64)
    delay = models.IntegerField()
    create_time = models.DateTimeField(auto_now_add=True)