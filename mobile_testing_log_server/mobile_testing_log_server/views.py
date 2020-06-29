from django.http import HttpResponse
from mobile_testing_log_server.models import LogRecord


def add_log(request):
    device = request.POST.get("device")
    stress = request.POST.get("stress")
    page = request.POST.get("page")
    action = request.POST.get("action")
    delay = int(request.POST.get("delay"))
    log_record = LogRecord(device=device, stress=stress, page=page, action=action, delay=delay)
    log_record.save()
    return HttpResponse("Success")