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

device_data = {}
device_baseline = {
    # "vivo": 300.5,
    # "HUAWEI": 504.8,
    # "samsung": 202.7,
    # "google": 409.2,
    "vivo": 159.3,
    "HUAWEI": 270.6,
    "samsung": 90.9,
    "google": 463.9,
    "Apple": 533.2,
}

def get_page2action():
    ret = {}
    query = """
        select distinct page, action from mobile_testing_log_server_logrecord        
    """
    cursor.execute(query)
    for row in cursor:
        page, action = row
        if ret.get(page) == None:
            ret[page] = []
        ret[page].append(action)
    return ret

def get_devices():
    ret = []
    query = """
        select distinct device from mobile_testing_log_server_logrecord
     """
    cursor.execute(query)
    for each in cursor:
        ret.append(each[0])
    return ret

def get_data(device, page, action):
    ret = []
    records = LogRecord.objects.filter(device=device, page=page, action=action)
    # delay_baseline = device_baseline[device]
    delay_baseline = 1
    for record in records:
        ret.append(record.delay/delay_baseline)
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

if __name__ == "__main__":
    output_file = open("norm/output_file.csv", "w")
    output_file.write("page-action,device,sigma1,2sigma,3sigma\n")
    devices = get_devices()
    for device in devices:
        device_data[device] = []
    page2action = get_page2action()
    for page in page2action:
        for action in page2action[page]:
            draw_all(page, action)
    output_file.close()
    fig = plt.subplot()
    x_limit_right = 0
    for device in devices:
        data = device_data[device]
        data = sorted(data)
        if data:
            loc, scale = norm.fit(data)
            print(loc, scale)
            limit = loc + 3 * scale
            if (limit > x_limit_right):
                x_limit_right = limit
            # percent = 100.0 * len([x for x in data if x >= limit])/len(data)
            # plt.axvline(limit, c='r')
            # plt.text(limit, 0, '%.2f(%.2f%%)' % (limit, percent))
            steps = 10000
            step = 1.0 * (data[-1] - data[0]) / steps
            norm_x = [data[0] + i * step for i in range(steps)]
            fig.plot(norm_x, norm.pdf(norm_x, loc, scale), label="%s(%.2f)" % (device, limit))
    plt.suptitle("All Performance Data Distribution", y=1.0)
    plt.legend()
    plt.xlim(0, x_limit_right)
    plt.savefig("norm_fixed/all.png")
