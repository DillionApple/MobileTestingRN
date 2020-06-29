from django.contrib import admin

from mobile_testing_log_server.models import LogRecord

class LogRecordAdmin(admin.ModelAdmin):
    list_display = ('device', 'stress', 'page', 'action', 'delay', 'create_time')


admin.site.register(LogRecord, LogRecordAdmin)