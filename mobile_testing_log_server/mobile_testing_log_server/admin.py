from django.contrib import admin

from mobile_testing_log_server.models import LogRecord

class LogRecordAdmin(admin.ModelAdmin):
    list_display = ('device', 'cpu_stress', 'disk_stress', 'network_stress', 'memory_stress', 'page', 'action', 'delay', 'create_time')


admin.site.register(LogRecord, LogRecordAdmin)