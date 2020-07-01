import json
from django.http import HttpResponse
from mobile_testing_log_server.models import LogRecord


def add_log(request):
    request.POST = json.loads(request.body.decode('utf-8'))
    device = request.POST.get("device")
    cpu_stress = int(request.POST.get("cpu_stress"))
    disk_stress = int(request.POST.get("disk_stress"))
    network_stress = int(request.POST.get("network_stress"))
    memory_stress = int(request.POST.get("memory_stress"))
    page = request.POST.get("page")
    action = request.POST.get("action")
    delay = int(request.POST.get("delay"))
    log_record = LogRecord(
        device=device,
        cpu_stress=cpu_stress,
        disk_stress=disk_stress,
        network_stress=network_stress,
        memory_stress=memory_stress,
        page=page,
        action=action,
        delay=delay)
    log_record.save()
    return HttpResponse("Success")