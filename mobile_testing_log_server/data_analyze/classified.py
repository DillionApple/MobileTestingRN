import os
import codecs
from django.conf import settings
import django
from mobile_testing_log_server.settings import DATABASES, INSTALLED_APPS
settings.configure(DATABASES=DATABASES, INSTALLED_APPS=INSTALLED_APPS)
django.setup()
from mobile_testing_log_server.models import LogRecord

from django.db import connection
cursor = connection.cursor()

import matplotlib.pyplot as plt
from scipy.stats import norm

classes = {
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
    ret = []
    if page == "All":
        for each_class in classes:
            for page in classes[each_class]:
                if page != "All":
                    ret += get_data(device, page)
        return ret
    # records = LogRecord.objects.filter(device=device, page=page, cpu_stress=0, disk_stress=0, memory_stress=0, network_stress=0)
    records = LogRecord.objects.filter(device=device, page=page)
    for record in records:
        ret.append(record.delay)
    return ret

def get_avg(l):
    return sum(l) / len(l)

def process(type): # type -> device -> {u, sigma, sigma/u, fixed_u, fixed_sigma/u, score}
    fig = plt.subplot()
    max_avg = 0
    max_sigma = 0
    max_sigma_div_avg = 0
    devices_having_records = []
    for device in devices:
        print("processing type: {0}, device: {1}".format(type, device))
        data = []
        for page in classes[type]:
            data = data + get_data(device, page)
        if len(data) == 0:
            continue
        devices_having_records.append(device)
        data_avg = sum(data) / len(data)
        max_avg = max(data_avg, max_avg)
        summary[type][device]['avg'] = data_avg
        data = data + [-1 * x for x in data]
        data = sorted(data)
        loc, scale = norm.fit(data)
        summary[type][device]['sigma'] = scale
        summary[type][device]['sigma_div_avg'] = scale / data_avg
        max_sigma_div_avg = max(scale/data_avg, max_sigma_div_avg)
        max_sigma = max(scale, max_sigma)
        steps = 1000
        try:
            step = 1.0 * (data[-1] - data[0]) / steps
            norm_x = [data[0] + i * step for i in range(steps)]
            fig.plot(norm_x, norm.pdf(norm_x, loc, scale), label="%s(μ=%.2f,σ=%.2f)" % (device, data_avg, scale))
        except:
            pass
    title = "{type}".format(type=type)
    plt.suptitle(title, y=1.0)
    plt.legend()
    plt.xlim(0, 3 * max_sigma)
    plt.savefig(os.path.join(ROOT_PATH, "{0}.png".format(type)))
    plt.close()

    for device in devices_having_records:
        summary[type][device]["fixed_avg"] = summary[type][device]["avg"] / max_avg
        summary[type][device]["fixed_sigma_div_avg"] = summary[type][device]["sigma_div_avg"] / max_sigma_div_avg
        summary[type][device]["score"] = summary[type][device]["fixed_avg"] + summary[type][device]["fixed_sigma_div_avg"]

def output_summary(summary):
    f = codecs.open(os.path.join(ROOT_PATH, "summary.csv"), "w", "utf-8")
    csv_head = ",".join(["type", "device", "mu", "sigma", "sigma/u", "u(fixed)", "sigma/u(fixed)", "score"])
    f.write(csv_head + "\n")
    keys = ["avg", "sigma", "sigma_div_avg", "fixed_avg", "fixed_sigma_div_avg", "score"]
    device_data = {}
    for device in devices:
        device_data[device] = {}
        for key in keys:
            device_data[device][key] = []
    for each_class in classes:
        for device in devices:
            try:
                data = summary[each_class][device]
                csv_line = "{type},{device},{avg:.2f},{sigma:.2f},{sigma_div_avg:.2f},{fixed_avg:.2f},{fixed_sigma_div_avg:.2f},{score:.2f}\n".format(
                    type=each_class,
                    device=device,
                    avg=data["avg"],
                    sigma=data["sigma"],
                    sigma_div_avg=data["sigma_div_avg"],
                    fixed_avg=data["fixed_avg"],
                    fixed_sigma_div_avg=data["fixed_sigma_div_avg"],
                    score=data["score"],
                )
                for key in keys:
                    device_data[device][key].append(data[key])
            except:
                csv_line = "{type},{device},-,-,-,-,-,-\n".format(
                    type = each_class,
                    device = device,
                )
            f.write(csv_line)
    for device in devices:
        csv_line = "All,{device},{avg:.2f},{sigma:.2f},{sigma_div_avg:.2f},{fixed_avg:.2f},{fixed_sigma_div_avg:.2f},{score:.2f}\n".format(
            device=device,
            avg=get_avg(device_data[device]["avg"]),
            sigma=get_avg(device_data[device]["sigma"]),
            sigma_div_avg=get_avg(device_data[device]["sigma_div_avg"]),
            fixed_avg=get_avg(device_data[device]["fixed_avg"]),
            fixed_sigma_div_avg=get_avg(device_data[device]["fixed_sigma_div_avg"]),
            score=get_avg(device_data[device]["score"]),
        )
        f.write(csv_line)


    f.close()


if __name__ == "__main__":
    devices = get_devices()
    summary = {}
    for each in classes:
        summary[each] = {}
        for device in devices:
            summary[each][device] = {}
    for each in classes:
        process(each)
    output_summary(summary)