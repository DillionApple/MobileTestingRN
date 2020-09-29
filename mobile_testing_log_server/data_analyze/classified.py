from django.conf import settings
import django
from mobile_testing_log_server.settings import DATABASES, INSTALLED_APPS
settings.configure(DATABASES=DATABASES, INSTALLED_APPS=INSTALLED_APPS)
django.setup()
from mobile_testing_log_server.models import LogRecord

from django.db import connection
cursor = connection.cursor()

import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import halfnorm, norm

classes = {
    "UI": ["UITestScreen"],
    "Video": ["VideoActionAndAnimation"],
    "Audio": ["AudioPlayList", "AudioScreen"],
    "Map": ["AnimatedMarkers", "AnimatedNavigation", "DefaultMarkers", "ViewsAsMarkers"],
    "File System": ["FileSystemScreen"],
    "Download": ["FileDownloaderItem"],
    "3D": ["WebGLScreen"],
    "Camera": ["CameraScreen"],
    "All": ["All"],
}

ROOT_PATH="./classified"

def get_devices():
    ret = []
    query = """
        select distinct device from mobile_testing_log_server_logrecord
     """
    cursor.execute(query)
    for each in cursor:
        ret.append(each[0])
    return ret

def get_data(device, page):
    if page == "All":
        return device_data[device]
    ret = []
    # records = LogRecord.objects.filter(device=device, page=page, cpu_stress=0, disk_stress=0, memory_stress=0, network_stress=0)
    records = LogRecord.objects.filter(device=device, page=page)
    for record in records:
        ret.append(record.delay)
    return ret

def draw_all(page, action):
    # fig, axs = plt.subplots(2, 2, figsize=(6, 4))
    fig = plt.subplot()
    x_limit_left = 0
    x_limit_right = 0
    for device in devices:
        data = get_data(device, page, action)
        data = data + [(-1 * x) for x in data]
        data = sorted(data)
        if data:
            device_data[device] += data
            loc, scale = norm.fit(data)
            print(loc, scale)
            limit = loc + 3 * scale
            if (limit > x_limit_right):
                x_limit_right = limit
            # percent = 100.0 * len([x for x in data if x >= limit])/len(data)
            # plt.axvline(limit, c='r')
            # plt.text(limit, 0, '%.2f(%.2f%%)' % (limit, percent))
            steps = 1000
            step = 1.0 * (data[-1] - data[0]) / steps
            norm_x = [data[0] + i * step for i in range(steps)]
            fig.plot(norm_x, norm.pdf(norm_x, loc, scale), label="%s(%.2f)" % (device, limit))
            line = "{page}-{action},{device},{sigma1},{sigma2},{sigma3}\n".format(
                page=page, action=action,
                device=device, sigma1=scale,
                sigma2=scale*2, sigma3=scale*3)
            output_file.write(line)
    title = "{page}-{action}".format(page=page, action=action)
    plt.suptitle(title, y=1.0)
    plt.legend()
    plt.xlim(x_limit_left, x_limit_right)
    """
    fmt = '%.0f%%'  # Format you want the ticks, e.g. '40%'
    xticks = mtick.FormatStrFormatter(fmt)
    fig.xaxis.set_major_formatter(xticks)
    """
    plt.savefig("norm/{title}.png".format(title=title))
    plt.close()
    # exit(0)

def divide_u(data):
    try:
        baseline = sum(data) / len(data)
        ret = [x / baseline for x in data]
        return ret
    except:
        return data

def process(type):
    fig = plt.subplot()
    x_limit_right = 0
    for device in devices:
        data = []
        for page in classes[type]:
            data = data + get_data(device, page)
        try:
            device_avg[device].append(sum(data)/len(data))
            print(device, type, sum(data)/len(data))
        except:
            pass
        # data = divide_u(data)
        data = data + [-1 * x for x in data]
        data = sorted(data)
        device_data[device] = device_data[device] + data
        loc, scale = norm.fit(data)
        print(device, type, scale)
        limit = loc + 3 * scale
        if (limit > x_limit_right):
            x_limit_right = limit
        steps = 1000
        try:
            step = 1.0 * (data[-1] - data[0]) / steps
            norm_x = [data[0] + i * step for i in range(steps)]
            fig.plot(norm_x, norm.pdf(norm_x, loc, scale), label="%s(%.2f)" % (device, limit))
            device_limit[device].append(limit)
        except:
            pass
    title = "{type}".format(type=type)
    plt.suptitle(title, y=1.0)
    plt.legend()
    plt.xlim(0, x_limit_right)
    plt.savefig("{root_path}/{type}.png".format(root_path=ROOT_PATH, type=type))
    plt.close()


if __name__ == "__main__":
    devices = get_devices()
    device_data = {}
    device_limit = {}
    device_avg = {}
    for device in devices:
        device_data[device] = []
        device_limit[device] = []
        device_avg[device] = []
    for each in classes:
        process(each)
    for device in devices:
        limits = device_limit[device]
        avgs = device_limit[device]
        # print(device, sum(limits)/len(limits))
        print(device, sum(avgs)/len(avgs))
