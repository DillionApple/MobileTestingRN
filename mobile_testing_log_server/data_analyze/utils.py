import pickle as pkl

from django.conf import settings
import django
from mobile_testing_log_server.settings import DATABASES, INSTALLED_APPS
settings.configure(DATABASES=DATABASES, INSTALLED_APPS=INSTALLED_APPS)
django.setup()
from mobile_testing_log_server.models import LogRecord

from django.db import connection
cursor = connection.cursor()


CLASSES = {
    "UI": ["UITestScreen"],
    "Video": ["VideoActionAndAnimation"],
    "Audio": ["AudioPlayList", "AudioScreen"],
    "Map": ["AnimatedMarkers", "AnimatedNavigation", "DefaultMarkers", "ViewsAsMarkers"],
    "File System": ["FileSystemScreen"],
    "Download": ["FileDownloaderItem"],
    "3D": ["WebGLScreen"],
    "Camera": ["CameraScreen"],
    # "All": ["All"],
}

def get_devices():
    ret = []
    query = """
        select distinct device from mobile_testing_log_server_logrecord
     """
    cursor.execute(query)
    for each in cursor:
        if each != 'apple': # TODO - delete
            ret.append(each[0])
    return ret

def get_data(device, page, no_stress=False):
    ret = []
    if page == "All":
        for each_class in CLASSES:
            for page in CLASSES[each_class]:
                if page != "All":
                    ret += get_data(device, page, no_stress)
        return ret
    if not no_stress:
        records = LogRecord.objects.filter(device=device, page=page)
    else:
        records = LogRecord.objects.filter(device=device, page=page, cpu_stress=0, disk_stress=0, memory_stress=0,
                                           network_stress=0)
    for record in records:
        ret.append(record.delay)
    return ret

def get_avg(l):
    return sum(l) / len(l)

def get_data_div_avg(data):
    avg = get_avg(data)
    return [each / avg for each in data]


def save_pkl(obj, filepath):
    with open(filepath, "wb") as f:
        pkl.dump(obj, f)

